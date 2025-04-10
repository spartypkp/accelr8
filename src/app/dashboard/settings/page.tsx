'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/UserContext";
import { AlertTriangle, Download, Key, Loader2, Lock, LogOut, Mail, ShieldAlert, User, UserCog } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SettingsPage() {
	const { userProfile, isLoadingProfile, resetPassword, updateUserProfile, signOut } = useUser();
	const { toast } = useToast();
	const [isSaving, setIsSaving] = useState(false);
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const hasLoadedOnce = useRef(false);

	// User preferences state
	const [preferences, setPreferences] = useState({
		communityUpdates: true,
		marketingEmails: false,
		profileVisibility: true,
		usageAnalytics: true
	});

	// Password reset form
	const [email, setEmail] = useState('');

	// Set email when profile loads
	useEffect(() => {
		if (userProfile?.email) {
			setEmail(userProfile.email);
			hasLoadedOnce.current = true;
		}
	}, [userProfile]);

	// Show loading state when profile is loading
	if (isLoadingProfile && !hasLoadedOnce.current) {
		return (
			<div className="container max-w-6xl mx-auto py-8 space-y-8">
				<div className="flex items-center space-x-4">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<UserCog className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Settings</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-6">
						{/* Account Settings Skeleton */}
						<Card className="border-none shadow-md">
							<CardHeader>
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-72 mt-2" />
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<Skeleton className="h-5 w-32" />
									<div className="grid grid-cols-1 gap-4">
										{[...Array(2)].map((_, i) => (
											<div key={i} className="flex justify-between items-center">
												<div>
													<Skeleton className="h-5 w-48" />
													<Skeleton className="h-4 w-64 mt-1" />
												</div>
												<Skeleton className="h-10 w-32" />
											</div>
										))}
									</div>
								</div>

								<div className="pt-6 border-t space-y-4">
									<Skeleton className="h-5 w-32" />
									<div className="space-y-4">
										{[...Array(2)].map((_, i) => (
											<div key={i} className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Skeleton className="h-5 w-48" />
													<Skeleton className="h-4 w-64" />
												</div>
												<Skeleton className="h-6 w-12" />
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Privacy Settings Skeleton */}
						<Card className="border-none shadow-md">
							<CardHeader>
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-72 mt-2" />
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									{[...Array(2)].map((_, i) => (
										<div key={i} className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Skeleton className="h-5 w-48" />
												<Skeleton className="h-4 w-64" />
											</div>
											<Skeleton className="h-6 w-12" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar Skeleton */}
					<div>
						<Card className="border-none shadow-md">
							<CardHeader>
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-48 mt-2" />
							</CardHeader>
							<CardContent className="space-y-4">
								{[...Array(4)].map((_, i) => (
									<Skeleton key={i} className="h-10 w-full" />
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	// Show a message if no profile is available
	if (!userProfile) {
		return (
			<div className="container max-w-6xl mx-auto py-8 space-y-8">
				<div className="flex items-center space-x-4">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<UserCog className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Settings</h1>
				</div>
				<Card className="border-none shadow-md">
					<CardHeader className="bg-destructive/10">
						<CardTitle className="flex items-center text-destructive">
							<AlertTriangle className="h-5 w-5 mr-2" />
							Settings Unavailable
						</CardTitle>
						<CardDescription>Your settings could not be loaded</CardDescription>
					</CardHeader>
					<CardContent>
						<p>There was an issue loading your settings. Please try refreshing the page or contact support.</p>
						<Button className="mt-4" onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handlePreferenceChange = async (name: string, value: boolean) => {
		// Update local state
		setPreferences(prev => ({
			...prev,
			[name]: value
		}));

		// Show success toast
		toast({
			title: "Preference updated",
			description: `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`
		});
	};

	const handlePasswordReset = async () => {
		setIsSaving(true);
		try {
			const { error } = await resetPassword(email);
			if (error) {
				toast({
					title: "Error sending reset link",
					description: error.message,
					variant: "destructive"
				});
			} else {
				toast({
					title: "Password reset email sent",
					description: "Check your email for a link to reset your password."
				});
				setShowPasswordDialog(false);
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

	const handleDeleteAccount = () => {
		setShowDeleteConfirm(false);
		toast({
			title: "Account deletion",
			description: "This feature is not yet implemented in this version.",
			variant: "default"
		});
	};

	const handleDownloadData = () => {
		toast({
			title: "Data download",
			description: "Your data export is being prepared and will be emailed to you.",
		});
	};

	const handleContactSupport = () => {
		window.open('mailto:support@accelr8.com?subject=Support%20Request&body=Hello%20Accelr8%20Support,%0A%0AI%20need%20assistance%20with%20the%20following:%0A%0A', '_blank');
	};

	return (
		<div className="container max-w-6xl mx-auto py-8 space-y-8">
			<div className="flex items-center space-x-4">
				<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
					<UserCog className="h-5 w-5 text-primary" />
				</div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Settings</h1>
			</div>

			<Tabs defaultValue="account" className="w-full">
				<TabsList className="mb-8">
					<TabsTrigger value="account" className="flex items-center gap-2">
						<User className="h-4 w-4" />
						Account
					</TabsTrigger>
					<TabsTrigger value="privacy" className="flex items-center gap-2">
						<Lock className="h-4 w-4" />
						Privacy
					</TabsTrigger>
					<TabsTrigger value="security" className="flex items-center gap-2">
						<ShieldAlert className="h-4 w-4" />
						Security
					</TabsTrigger>
				</TabsList>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-6">
						<TabsContent value="account" className="mt-0 space-y-6">
							{/* Account Settings */}
							<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
								<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
									<CardTitle className="text-xl font-semibold flex items-center">
										<User className="h-5 w-5 mr-2 text-primary" />
										Account Settings
									</CardTitle>
									<CardDescription>Manage your account settings and preferences</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6 pt-6">
									<div className="pt-4 space-y-4">
										<h3 className="text-lg font-semibold">Email Preferences</h3>
										<div className="space-y-6">
											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="communityUpdates" className="text-base">Community Updates</Label>
													<p className="text-sm text-muted-foreground">Receive updates about community events</p>
												</div>
												<Switch
													id="communityUpdates"
													checked={preferences.communityUpdates}
													onCheckedChange={(checked) => handlePreferenceChange('communityUpdates', checked)}
												/>
											</div>

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="marketingEmails" className="text-base">Marketing Emails</Label>
													<p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
												</div>
												<Switch
													id="marketingEmails"
													checked={preferences.marketingEmails}
													onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="privacy" className="mt-0 space-y-6">
							{/* Privacy Settings */}
							<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
								<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
									<CardTitle className="text-xl font-semibold flex items-center">
										<Lock className="h-5 w-5 mr-2 text-primary" />
										Privacy Settings
									</CardTitle>
									<CardDescription>Manage your data and privacy preferences</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6 pt-6">
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label htmlFor="profileVisibility" className="text-base">Profile Visibility</Label>
												<p className="text-sm text-muted-foreground">Show your profile to other residents</p>
											</div>
											<Switch
												id="profileVisibility"
												checked={preferences.profileVisibility}
												onCheckedChange={(checked) => handlePreferenceChange('profileVisibility', checked)}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label htmlFor="usageAnalytics" className="text-base">Usage Analytics</Label>
												<p className="text-sm text-muted-foreground">Help us improve with anonymous usage data</p>
											</div>
											<Switch
												id="usageAnalytics"
												checked={preferences.usageAnalytics}
												onCheckedChange={(checked) => handlePreferenceChange('usageAnalytics', checked)}
											/>
										</div>
									</div>

									<div className="pt-6 border-t">
										<Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
											<DialogTrigger asChild>
												<Button variant="destructive" className="flex items-center gap-2">
													<ShieldAlert className="h-4 w-4" />
													Delete My Account
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle className="text-destructive flex items-center gap-2">
														<AlertTriangle className="h-5 w-5" />
														Delete Account
													</DialogTitle>
													<DialogDescription>
														This action cannot be undone. This will permanently delete your account and remove your data.
													</DialogDescription>
												</DialogHeader>
												<div className="py-4">
													<p className="font-semibold">Are you absolutely sure you want to delete your account?</p>
													<p className="text-sm text-muted-foreground mt-2">
														All of your data will be permanently removed from our servers forever. This action cannot be undone.
													</p>
												</div>
												<DialogFooter>
													<Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
													<Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
										<p className="text-sm text-muted-foreground mt-2">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
									</div>
								</CardContent>
							</Card>

							<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
								<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
									<CardTitle className="text-xl font-semibold flex items-center">
										<Download className="h-5 w-5 mr-2 text-primary" />
										Your Data
									</CardTitle>
									<CardDescription>Download or manage your personal data</CardDescription>
								</CardHeader>
								<CardContent className="pt-6">
									<p className="mb-4">You can download a copy of your personal data at any time.</p>
									<Button className="w-full sm:w-auto" onClick={handleDownloadData}>
										<Download className="h-4 w-4 mr-2" />
										Download Your Data
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="security" className="mt-0 space-y-6">
							{/* Security Settings */}
							<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
								<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
									<CardTitle className="text-xl font-semibold flex items-center">
										<Key className="h-5 w-5 mr-2 text-primary" />
										Security
									</CardTitle>
									<CardDescription>Manage your account security settings</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6 pt-6">
									<div className="grid grid-cols-1 gap-6">
										<div className="flex justify-between items-center">
											<div>
												<Label htmlFor="password" className="text-base">Password</Label>
												<p className="text-sm text-muted-foreground">Change your account password</p>
											</div>
											<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
												<DialogTrigger asChild>
													<Button variant="outline" className="flex items-center gap-2">
														<Key className="h-4 w-4" />
														Change Password
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Reset your password</DialogTitle>
														<DialogDescription>
															We'll send you an email with a link to reset your password.
														</DialogDescription>
													</DialogHeader>
													<div className="space-y-4 py-4">
														<div className="space-y-2">
															<Label htmlFor="email">Email</Label>
															<Input
																id="email"
																value={email}
																onChange={(e) => setEmail(e.target.value)}
																placeholder="Your email address"
															/>
														</div>
													</div>
													<DialogFooter>
														<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
														<Button onClick={handlePasswordReset} disabled={isSaving} className="flex items-center gap-2">
															{isSaving ? (
																<>
																	<Loader2 className="h-4 w-4 animate-spin" />
																	Sending...
																</>
															) : (
																<>
																	<Mail className="h-4 w-4" />
																	Send Reset Link
																</>
															)}
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<Label htmlFor="two-factor" className="text-base">Two-factor Authentication</Label>
												<p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
											</div>
											<Button variant="outline" className="flex items-center gap-2" onClick={() => toast({
												title: "Coming Soon",
												description: "Two-factor authentication will be available soon."
											})}>
												<ShieldAlert className="h-4 w-4" />
												Enable
											</Button>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<Label htmlFor="active-sessions" className="text-base">Active Sessions</Label>
												<p className="text-sm text-muted-foreground">Manage your active login sessions</p>
											</div>
											<Button variant="outline" className="flex items-center gap-2" onClick={() => toast({
												title: "Coming Soon",
												description: "Session management will be available soon."
											})}>
												<User className="h-4 w-4" />
												Manage
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</div>

					{/* Sidebar with Quick Actions */}
					<div>
						<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-none sticky top-6">
							<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
								<CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
								<CardDescription>Common tasks and actions</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<Button
									className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90"
									onClick={handleContactSupport}
								>
									<Mail className="h-4 w-4" />
									Contact Support
								</Button>

								<Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => window.open('/privacy', '_blank')}>
									<Lock className="h-4 w-4" />
									Privacy Policy
								</Button>

								<div className="pt-4 border-t mt-4">
									<Button
										variant="outline"
										className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
										onClick={signOut}
									>
										<LogOut className="h-4 w-4" />
										Sign Out
									</Button>
								</div>

								<div className="pt-4 mt-4 text-center">
									<p className="text-xs text-muted-foreground">
										Accelr8 Dashboard v1.0
									</p>
									<p className="text-xs text-muted-foreground">
										© {new Date().getFullYear()} Accelr8
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Tabs>
		</div>
	);
} 