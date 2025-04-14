'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/UserContext';
import { claimInvitation } from '@/lib/api/users';
import { Person as SanityPerson } from '@/lib/sanity/sanity.types';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Password validation helper
const validatePassword = (password: string): { valid: boolean; message: string; } => {
	// Minimum 8 characters
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters' };
	}

	// At least one uppercase letter
	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter' };
	}

	// At least one lowercase letter
	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter' };
	}

	// At least one number
	if (!/[0-9]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one number' };
	}

	// At least one special character
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one special character' };
	}

	return { valid: true, message: '' };
};

function OnboardingContent() {
	const { userProfile, isLoading, updateUserProfile, updatePassword } = useUser();
	const router = useRouter();
	const supabase = createClient();

	const [step, setStep] = useState('welcome');
	const [formData, setFormData] = useState({
		name: '',
		phone_number: '',
		emergency_contact_name: '',
		emergency_contact_phone: '',
		bio: '',
		company: '',
		role: '',
		password: '',
		confirmPassword: ''
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [invitationData, setInvitationData] = useState<any>(null);
	const [processingInvitation, setProcessingInvitation] = useState(true);

	// Check for authenticated session and extract metadata
	useEffect(() => {
		const checkSession = async () => {
			try {
				// The auth/confirm route.ts has already verified any tokens
				// Now we just need to check if there's a valid session
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				if (sessionError) {
					console.error('Error getting session:', sessionError);
					setError('There was a problem accessing your account.');
					setProcessingInvitation(false);
					return;
				}

				if (!session) {
					console.error('No session found');
					setError('You must be logged in to complete onboarding.');
					setProcessingInvitation(false);
					return;
				}

				// Extract user metadata
				const userMeta = session.user.user_metadata;
				console.log('User metadata:', userMeta);

				// Check if this is a resident invitation
				if (userMeta && userMeta.role === 'resident') {
					setInvitationData({
						name: userMeta.name,
						invited_by: userMeta.invited_by,
						temp_password: userMeta.temp_password,
						role: userMeta.role
					});

					// Pre-fill form data
					setFormData(prev => ({
						...prev,
						name: userMeta.name || ''
					}));

					// Skip to password step for invited users
					setStep('password');
				}
			} catch (err) {
				console.error('Error checking session:', err);
				setError('There was a problem processing your account information.');
			} finally {
				setProcessingInvitation(false);
			}
		};

		checkSession();
	}, [supabase.auth]);

	// If user is already onboarded, redirect to dashboard
	useEffect(() => {
		if (!isLoading && userProfile?.onboarding_completed) {
			router.push('/dashboard');
		}

		// Pre-fill form data if available from user profile
		if (userProfile) {
			setFormData(prev => ({
				...prev,
				name: userProfile.sanityPerson?.name || prev.name,
				phone_number: userProfile.phone_number || '',
				emergency_contact_name: userProfile.emergency_contact_name || '',
				emergency_contact_phone: userProfile.emergency_contact_phone || '',
				bio: userProfile.sanityPerson?.bio || '',
				company: userProfile.sanityPerson?.company || '',
				role: userProfile.sanityPerson?.role || ''
			}));
		}
	}, [isLoading, userProfile, router]);

	// Return with a loading state if still processing
	if (isLoading || processingInvitation) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-4">Loading your profile...</h1>
					<p>Please wait while we set things up for you.</p>
				</div>
			</div>
		);
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError('');

		try {
			// Validate password if on password step
			if (step === 'password') {
				// Check passwords match
				if (formData.password !== formData.confirmPassword) {
					setError('Passwords do not match');
					setSubmitting(false);
					return;
				}

				// Validate password strength
				const passwordCheck = validatePassword(formData.password);
				if (!passwordCheck.valid) {
					setError(passwordCheck.message);
					setSubmitting(false);
					return;
				}

				// Update user's password using UserContext method
				const { error: passwordError } = await updatePassword(formData.password);
				if (passwordError) {
					setError(passwordError.message || 'Failed to update password');
					setSubmitting(false);
					return;
				}
			}

			// Update user profile with the collected information
			await updateUserProfile({
				phone_number: formData.phone_number,
				emergency_contact_name: formData.emergency_contact_name,
				emergency_contact_phone: formData.emergency_contact_phone,
				sanityPerson: {
					name: formData.name,
					bio: formData.bio,
					company: formData.company,
					role: formData.role
				} as Partial<SanityPerson>,
				onboarding_completed: true
			});

			// If this was an invitation, update its status to claimed
			if (invitationData && userProfile) {
				// The inviteId was passed as temp_password in the metadata
				const inviteId = invitationData.temp_password;
				if (inviteId) {
					await claimInvitation(inviteId, userProfile.id);
				}
			}

			// Redirect to dashboard
			router.push('/dashboard');
		} catch (err) {
			console.error('Error updating profile:', err);
			setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto py-10 max-w-3xl">
			<h1 className="text-3xl font-bold text-center mb-8">Welcome to Accelr8!</h1>

			{invitationData && (
				<Alert className="mb-6">
					<AlertTitle>You've been invited to Accelr8!</AlertTitle>
					<AlertDescription>
						<p className="mb-2">
							You've been invited to join Accelr8 {invitationData.role && `as a ${invitationData.role}`} by {invitationData.invited_by}.
						</p>
						<p>
							Please complete your profile setup to get started. You'll need to create a password and provide some basic information.
						</p>
					</AlertDescription>
				</Alert>
			)}

			<Tabs defaultValue="welcome" value={step} onValueChange={setStep}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="welcome">Welcome</TabsTrigger>
					<TabsTrigger value="profile">Your Profile</TabsTrigger>
					<TabsTrigger value="password">Set Password</TabsTrigger>
				</TabsList>

				<TabsContent value="welcome">
					<Card>
						<CardHeader>
							<CardTitle>Welcome to Accelr8</CardTitle>
							<CardDescription>
								We're excited to have you join our community! Let's get your account set up.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p>
								{invitationData
									? `You've been invited to join Accelr8 as a resident by ${invitationData.invited_by}.`
									: "You've been invited to join Accelr8 as a resident."}
								This onboarding process will help you set up your profile
								and provide essential information needed for your stay.
							</p>
							<p>
								This will only take a few minutes to complete. You'll need to:
							</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>Complete your basic profile information</li>
								<li>Provide emergency contact details</li>
								<li>Add a brief bio to help others get to know you</li>
							</ul>
						</CardContent>
						<CardFooter>
							<Button onClick={() => setStep('profile')}>Let's Get Started</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>Complete Your Profile</CardTitle>
							<CardDescription>
								Please provide the following information to complete your profile
							</CardDescription>
						</CardHeader>
						<form onSubmit={(e) => {
							e.preventDefault();
							setStep('password');
						}}>
							<CardContent className="space-y-4">
								{error && (
									<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone_number">Phone Number</Label>
									<Input
										id="phone_number"
										name="phone_number"
										value={formData.phone_number}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
									<Input
										id="emergency_contact_name"
										name="emergency_contact_name"
										value={formData.emergency_contact_name}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
									<Input
										id="emergency_contact_phone"
										name="emergency_contact_phone"
										value={formData.emergency_contact_phone}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="company">Company/Project</Label>
									<Input
										id="company"
										name="company"
										value={formData.company}
										onChange={handleChange}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="role">Role/Title</Label>
									<Input
										id="role"
										name="role"
										value={formData.role}
										onChange={handleChange}
										placeholder="e.g. Founder, Engineer, Designer"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Short Bio</Label>
									<Textarea
										id="bio"
										name="bio"
										value={formData.bio}
										onChange={handleChange}
										placeholder="Tell us a bit about yourself, your work, and your interests"
										className="min-h-[100px]"
									/>
								</div>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button variant="outline" onClick={() => setStep('welcome')}>
									Back
								</Button>
								<Button type="submit">
									Continue
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>

				<TabsContent value="password">
					<Card>
						<CardHeader>
							<CardTitle>Set Your Password</CardTitle>
							<CardDescription>
								Choose a secure password for your Accelr8 account
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4">
								{error && (
									<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="password">New Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										required
										placeholder="Min 8 characters with letters, numbers & symbols"
									/>
									<p className="text-xs text-gray-500">
										Password must be at least 8 characters and include uppercase, lowercase,
										numbers, and special characters.
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
									/>
								</div>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button variant="outline" onClick={() => setStep('profile')}>
									Back
								</Button>
								<Button type="submit" disabled={submitting}>
									{submitting ? 'Saving...' : 'Complete Setup'}
								</Button>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default function OnboardingPage() {
	return (
		<Suspense fallback={
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-4">Loading...</h1>
					<p>Please wait while we set things up for you.</p>
				</div>
			</div>
		}>
			<OnboardingContent />
		</Suspense>
	);
} 