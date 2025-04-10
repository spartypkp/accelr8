'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/UserContext";
import { urlFor } from "@/lib/sanity/client";
import { UserProfile } from "@/lib/types";
import { AlertTriangle, ArrowRight, BadgeCheck, Camera, CheckCircle, Loader2, Phone, Shield, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
	const { userProfile, isLoadingProfile, updateUserProfile } = useUser();
	const { toast } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const hasLoadedOnce = useRef(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone_number: '',
		emergency_contact_name: '',
		emergency_contact_phone: ''
	});

	// Form validation states
	const [formErrors, setFormErrors] = useState({
		name: '',
		phone_number: '',
		emergency_contact_name: '',
		emergency_contact_phone: ''
	});

	// Initialize form data when profile is loaded
	useEffect(() => {
		if (userProfile) {
			setFormData({
				name: userProfile.sanityPerson?.name || '',
				email: userProfile.email || '',
				phone_number: userProfile.phone_number || '',
				emergency_contact_name: userProfile.emergency_contact_name || '',
				emergency_contact_phone: userProfile.emergency_contact_phone || ''
			});
			hasLoadedOnce.current = true;
		}
	}, [userProfile]);

	// Validate form fields
	const validateForm = () => {
		const errors = {
			name: '',
			phone_number: '',
			emergency_contact_name: '',
			emergency_contact_phone: ''
		};
		let isValid = true;

		// Name validation
		if (!formData.name.trim()) {
			errors.name = 'Name is required';
			isValid = false;
		}

		// Phone validation (optional but if provided should be valid)
		if (formData.phone_number && !/^\+?[0-9\s\-()]{7,}$/.test(formData.phone_number)) {
			errors.phone_number = 'Please enter a valid phone number';
			isValid = false;
		}

		// Emergency contact validation (both fields required if either is provided)
		if (formData.emergency_contact_name && !formData.emergency_contact_phone) {
			errors.emergency_contact_phone = 'Phone number is required when name is provided';
			isValid = false;
		}

		if (formData.emergency_contact_phone && !formData.emergency_contact_name) {
			errors.emergency_contact_name = 'Name is required when phone is provided';
			isValid = false;
		}

		// If emergency phone is provided, validate format
		if (formData.emergency_contact_phone &&
			!/^\+?[0-9\s\-()]{7,}$/.test(formData.emergency_contact_phone)) {
			errors.emergency_contact_phone = 'Please enter a valid phone number';
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	// Loading skeleton UI - only show if we've never loaded before
	if (isLoadingProfile && !hasLoadedOnce.current) {
		return (
			<div className="container max-w-6xl mx-auto py-12">
				<div className="flex items-center space-x-4 mb-12">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<User className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Profile</h1>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						<Card className="border-none shadow-md">
							<CardHeader className="pb-14 relative">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-24 mt-2" />
								<div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
									<Skeleton className="w-32 h-32 rounded-full" />
								</div>
							</CardHeader>
							<CardContent className="pt-24 text-center">
								<Skeleton className="h-7 w-40 mx-auto mb-1" />
								<Skeleton className="h-4 w-32 mx-auto mb-4" />
								<Skeleton className="h-10 w-full mt-6" />
							</CardContent>
						</Card>
					</div>
					<div className="lg:col-span-2 space-y-6">
						<Card className="border-none shadow-md">
							<CardHeader>
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-72 mt-2" />
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
									{[...Array(4)].map((_, i) => (
										<div key={i} className="space-y-1">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-6 w-40 mt-2" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						<Card className="border-none shadow-md">
							<CardHeader>
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-72 mt-2" />
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
									{[...Array(2)].map((_, i) => (
										<div key={i} className="space-y-1">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-6 w-40 mt-2" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	// Error state if no profile
	if (!userProfile) {
		return (
			<div className="container max-w-6xl mx-auto py-12">
				<div className="flex items-center space-x-4 mb-12">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<User className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Profile</h1>
				</div>
				<Card className="border-none shadow-lg">
					<CardHeader className="bg-destructive/10">
						<CardTitle className="flex items-center text-destructive">
							<AlertTriangle className="h-5 w-5 mr-2" />
							Profile Unavailable
						</CardTitle>
						<CardDescription>Your profile information could not be loaded</CardDescription>
					</CardHeader>
					<CardContent className="pt-6">
						<p>There was an issue loading your profile. Please try refreshing the page or contact support.</p>
						<Button className="mt-4" onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleEdit = () => {
		setFormData({
			name: userProfile.sanityPerson?.name || '',
			email: userProfile.email || '',
			phone_number: userProfile.phone_number || '',
			emergency_contact_name: userProfile.emergency_contact_name || '',
			emergency_contact_phone: userProfile.emergency_contact_phone || ''
		});
		// Reset any previous validation errors
		setFormErrors({
			name: '',
			phone_number: '',
			emergency_contact_name: '',
			emergency_contact_phone: ''
		});
		setIsEditing(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));

		// Clear specific error when user starts typing
		if (formErrors[name as keyof typeof formErrors]) {
			setFormErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset form data to current profile
		setFormData({
			name: userProfile.sanityPerson?.name || '',
			email: userProfile.email || '',
			phone_number: userProfile.phone_number || '',
			emergency_contact_name: userProfile.emergency_contact_name || '',
			emergency_contact_phone: userProfile.emergency_contact_phone || ''
		});
	};

	const handleSave = async () => {
		// Validate form before saving
		if (!validateForm()) {
			toast({
				title: "Form validation failed",
				description: "Please fix the errors in the form before saving.",
				variant: "destructive"
			});
			return;
		}

		setIsSaving(true);
		try {
			// Only include fields that need to be updated
			const updateData: Partial<UserProfile> = {};

			// Only include fields that have changed
			if (formData.phone_number !== userProfile.phone_number) {
				updateData.phone_number = formData.phone_number;
			}

			if (formData.emergency_contact_name !== userProfile.emergency_contact_name) {
				updateData.emergency_contact_name = formData.emergency_contact_name;
			}

			if (formData.emergency_contact_phone !== userProfile.emergency_contact_phone) {
				updateData.emergency_contact_phone = formData.emergency_contact_phone;
			}

			// Add Sanity data if name has changed
			if (formData.name !== userProfile.sanityPerson?.name && userProfile.sanityPerson) {
				// Clone existing person and update just the name
				const updatedPerson = { ...userProfile.sanityPerson, name: formData.name };
				updateData.sanityPerson = updatedPerson;
			}

			// Only update if there are changes
			if (Object.keys(updateData).length === 0) {
				toast({
					title: "No changes made",
					description: "Your profile is already up to date."
				});
				setIsEditing(false);
				setIsSaving(false);
				return;
			}

			// Update the profile
			const { error } = await updateUserProfile(updateData);

			if (error) {
				toast({
					title: "Error updating profile",
					description: error.message,
					variant: "destructive"
				});
			} else {
				toast({
					title: "Profile updated",
					description: "Your profile has been successfully updated.",
					variant: "default"
				});
				setIsEditing(false);
			}
		} catch (err) {
			toast({
				title: "Error",
				description: "An unexpected error occurred.",
				variant: "destructive"
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="container max-w-6xl mx-auto py-12 space-y-8">
			<div className="flex items-center space-x-4 mb-4">
				<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
					<User className="h-5 w-5 text-primary" />
				</div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Profile</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column - Profile image and role section */}
				<div className="lg:col-span-1 space-y-6">
					<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-none">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-14 relative">
							<CardTitle className="text-xl font-semibold z-10">
								{userProfile.role === 'super_admin' ? 'Super Admin' :
									userProfile.role === 'admin' ? 'House Admin' :
										userProfile.role === 'resident' ? 'House Resident' : 'Applicant'}
							</CardTitle>
							<CardDescription className="z-10">Member since {new Date(userProfile.created_at).toLocaleDateString()}</CardDescription>
							<div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
								<div className="w-32 h-32 rounded-full bg-background p-1 shadow-lg">
									{userProfile.sanityPerson?.profileImage ? (
										<img
											src={urlFor(userProfile.sanityPerson.profileImage).width(200).height(200).url()}
											alt={userProfile.sanityPerson.name || "Profile"}
											className="w-full h-full object-cover rounded-full"
										/>
									) : (
										<div className="w-full h-full rounded-full bg-muted flex items-center justify-center relative group cursor-pointer">
											<User className="h-12 w-12 text-muted-foreground/40" />
											<div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
												<Camera className="h-6 w-6 text-white" />
											</div>
										</div>
									)}
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-24 text-center">
							<h2 className="text-2xl font-bold mb-1">{userProfile.sanityPerson?.name || userProfile.email?.split('@')[0]}</h2>
							<p className="text-muted-foreground mb-4">{userProfile.email}</p>

							<div className="flex flex-wrap justify-center gap-2 mb-6">
								{userProfile.role === 'super_admin' && (
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
										<BadgeCheck className="h-3 w-3 mr-1" /> Super Admin
									</span>
								)}
								{(userProfile.role === 'admin' || userProfile.role === 'super_admin') && (
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
										<Shield className="h-3 w-3 mr-1" /> Admin
									</span>
								)}
								{userProfile.onboarding_completed && (
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs">
										<CheckCircle className="h-3 w-3 mr-1" /> Verified
									</span>
								)}
							</div>

							{!isEditing && (
								<Button onClick={handleEdit} variant="outline" className="w-full hover:bg-primary/5 transition-colors">
									Edit Profile
								</Button>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right column - Personal info and emergency contacts */}
				<div className="lg:col-span-2 space-y-6">
					<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
							<CardTitle className="text-xl font-semibold flex items-center">
								<User className="h-5 w-5 mr-2 text-primary" />
								Personal Information
							</CardTitle>
							<CardDescription>Manage your personal details and contact information</CardDescription>
						</CardHeader>
						<CardContent className="pt-6 pb-4">
							{isEditing ? (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="name" className="text-sm font-medium">Name</Label>
											<Input
												id="name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												placeholder="Your name"
												className={`border-muted ${formErrors.name ? 'border-destructive' : ''}`}
											/>
											{formErrors.name && (
												<p className="text-xs text-destructive mt-1">{formErrors.name}</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="email" className="text-sm font-medium">Email</Label>
											<Input
												id="email"
												name="email"
												value={formData.email}
												disabled
												placeholder="Your email"
												className="bg-muted/50 border-muted"
											/>
											<p className="text-xs text-muted-foreground">Email can't be changed here</p>
										</div>

										<div className="space-y-2">
											<Label htmlFor="phone_number" className="text-sm font-medium">Phone</Label>
											<Input
												id="phone_number"
												name="phone_number"
												value={formData.phone_number}
												onChange={handleChange}
												placeholder="Your phone number"
												className={`border-muted ${formErrors.phone_number ? 'border-destructive' : ''}`}
											/>
											{formErrors.phone_number && (
												<p className="text-xs text-destructive mt-1">{formErrors.phone_number}</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="role" className="text-sm font-medium">Role</Label>
											<Input
												id="role"
												value={userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
												disabled
												className="bg-muted/50 border-muted"
											/>
											<p className="text-xs text-muted-foreground">Role can only be changed by admins</p>
										</div>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Name</h3>
										<p className="font-medium text-lg">{userProfile.sanityPerson?.name || 'Not set'}</p>
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Email</h3>
										<p className="font-medium text-lg">{userProfile.email}</p>
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
										<p className="font-medium text-lg">{userProfile.phone_number || 'Not set'}</p>
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Role</h3>
										<p className="font-medium text-lg capitalize">{userProfile.role}</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
							<CardTitle className="text-xl font-semibold flex items-center">
								<Phone className="h-5 w-5 mr-2 text-primary" />
								Emergency Contact
							</CardTitle>
							<CardDescription>Contact information in case of emergency</CardDescription>
						</CardHeader>
						<CardContent className="pt-6 pb-4">
							{isEditing ? (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="emergency_contact_name" className="text-sm font-medium">Contact Name</Label>
											<Input
												id="emergency_contact_name"
												name="emergency_contact_name"
												value={formData.emergency_contact_name}
												onChange={handleChange}
												placeholder="Emergency contact name"
												className={`border-muted ${formErrors.emergency_contact_name ? 'border-destructive' : ''}`}
											/>
											{formErrors.emergency_contact_name && (
												<p className="text-xs text-destructive mt-1">{formErrors.emergency_contact_name}</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="emergency_contact_phone" className="text-sm font-medium">Contact Phone</Label>
											<Input
												id="emergency_contact_phone"
												name="emergency_contact_phone"
												value={formData.emergency_contact_phone}
												onChange={handleChange}
												placeholder="Emergency contact phone"
												className={`border-muted ${formErrors.emergency_contact_phone ? 'border-destructive' : ''}`}
											/>
											{formErrors.emergency_contact_phone && (
												<p className="text-xs text-destructive mt-1">{formErrors.emergency_contact_phone}</p>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Contact Name</h3>
										<p className="font-medium text-lg">{userProfile.emergency_contact_name || 'Not set'}</p>
									</div>

									<div className="space-y-1">
										<h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
										<p className="font-medium text-lg">{userProfile.emergency_contact_phone || 'Not set'}</p>
									</div>
								</div>
							)}
						</CardContent>
						{isEditing && (
							<CardFooter className="bg-muted/10 px-6 py-4">
								<div className="flex flex-col sm:flex-row w-full gap-3 justify-end">
									<Button
										onClick={handleSave}
										className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90"
										disabled={isSaving}
									>
										{isSaving ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</>
										) : (
											<>
												Save Changes
												<ArrowRight className="ml-2 h-4 w-4" />
											</>
										)}
									</Button>
									<Button
										onClick={handleCancel}
										variant="outline"
										disabled={isSaving}
									>
										Cancel
									</Button>
								</div>
							</CardFooter>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
} 