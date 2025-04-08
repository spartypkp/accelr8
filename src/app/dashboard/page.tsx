'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/UserContext";
import { getApplications } from "@/lib/api/applications";
import { getHouses } from "@/lib/api/houses";
import { urlFor } from "@/lib/sanity/client";
import { ApplicationStatus, House, SupabaseApplication } from "@/lib/types";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
	const { user, userProfile, isAdmin, isSuperAdmin, isResident, isApplicant } = useUser();
	const router = useRouter();
	const [houses, setHouses] = useState<House[]>([]);
	const [applications, setApplications] = useState<SupabaseApplication[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			try {
				// Fetch houses if user is resident, admin, or super_admin
				if (isResident || isAdmin || isSuperAdmin) {
					const userHouses = await getHouses();
					setHouses(userHouses);
				}

				// Fetch applications if user is an applicant
				if (isApplicant && user) {
					const userApplications = await getApplications({});
					// Filter applications by user_id
					const filteredApplications = userApplications.filter(app => app.user_id === user.id);
					setApplications(filteredApplications);
				}
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				setIsLoading(false);
			}
		}

		if (userProfile) {
			fetchData();
		}
	}, [userProfile, isResident, isAdmin, isSuperAdmin, isApplicant, user]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="container max-w-6xl mx-auto py-8">
				<h1 className="text-3xl font-bold mb-8">Dashboard</h1>
				<div className="text-center p-8">
					<p>Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container max-w-6xl mx-auto py-8 space-y-8">
			<h1 className="text-3xl font-bold">Dashboard</h1>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					{(isResident || isAdmin || isSuperAdmin) && (
						<TabsTrigger value="houses">My Houses</TabsTrigger>
					)}
					{isApplicant && (
						<TabsTrigger value="applications">My Applications</TabsTrigger>
					)}
					<TabsTrigger value="profile">Profile</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Welcome, {userProfile?.sanityPerson?.name || userProfile?.email?.split('@')[0]}</CardTitle>
							<CardDescription>
								{isApplicant && "Track your application status and manage your profile."}
								{isResident && "Access your houses and manage your profile."}
								{isAdmin && "Manage houses, residents, and applications."}
								{isSuperAdmin && "Full access to all houses and administrative functions."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{/* Quick stats and actions based on role */}
								{isApplicant && applications.length > 0 && (
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg">Application Status</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="capitalize font-medium">{applications[0].status}</p>
											<p className="text-sm text-muted-foreground">
												Submitted on {applications[0].submitted_at ? new Date(applications[0].submitted_at).toLocaleDateString() : 'N/A'}
											</p>
										</CardContent>
										<CardFooter>
											<Button variant="outline" size="sm" className="w-full">
												View Application
											</Button>
										</CardFooter>
									</Card>
								)}
								{(isResident || isAdmin) && houses.length > 0 && (
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg">My Houses</CardTitle>
										</CardHeader>
										<CardContent>
											<p>{houses.length} house{houses.length !== 1 ? 's' : ''} available</p>
										</CardContent>
										<CardFooter>
											<Button
												variant="outline"
												size="sm"
												className="w-full"
												onClick={() => {
													const element = document.querySelector('[data-value="houses"]');
													if (element instanceof HTMLElement) element.click();
												}}
											>
												View Houses
											</Button>
										</CardFooter>
									</Card>
								)}
								{/* Profile card for all users */}
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-lg">Your Profile</CardTitle>
									</CardHeader>
									<CardContent>
										<p>Manage your personal information and settings</p>
									</CardContent>
									<CardFooter>
										<Button
											variant="outline"
											size="sm"
											className="w-full"
											onClick={() => {
												const element = document.querySelector('[data-value="profile"]');
												if (element instanceof HTMLElement) element.click();
											}}
										>
											View Profile
										</Button>
									</CardFooter>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Houses Tab */}
				{(isResident || isAdmin || isSuperAdmin) && (
					<TabsContent value="houses" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{houses.length > 0 ? (
								houses.map((house) => (
									<Card key={house.id} className="overflow-hidden">
										<div className="h-48 bg-muted flex items-center justify-center">
											{house.sanityHouse?.mainImage ? (
												<img
													src={urlFor(house.sanityHouse.mainImage).width(400).height(300).url()}
													alt={house.sanityHouse?.name || "House"}
													className="w-full h-full object-cover"
												/>
											) : (
												<HomeIcon className="h-12 w-12 text-muted-foreground" />
											)}
										</div>
										<CardHeader>
											<CardTitle>{house.sanityHouse?.name || "Unnamed House"}</CardTitle>
											<CardDescription>
												{house.sanityHouse?.location?.city}, {house.sanityHouse?.location?.state}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<p className="text-sm">Status: {house.status}</p>
											<p className="text-sm">Occupancy: {house.current_occupancy} residents</p>
										</CardContent>
										<CardFooter className="flex flex-col space-y-2">
											<Button
												className="w-full"
												onClick={() => router.push(`/dashboard/${house.sanityHouse?.slug?.current}/resident`)}
											>
												Resident Dashboard
											</Button>

											{(isAdmin || isSuperAdmin) && (
												<Button
													variant="outline"
													className="w-full"
													onClick={() => router.push(`/dashboard/${house.sanityHouse?.slug?.current}/admin`)}
												>
													Admin Dashboard
												</Button>
											)}
										</CardFooter>
									</Card>
								))
							) : (
								<div className="col-span-full text-center p-12">
									<h3 className="font-medium text-lg">No Houses Available</h3>
									<p className="text-muted-foreground mt-1">You don't have access to any houses yet.</p>
								</div>
							)}
						</div>
					</TabsContent>
				)}

				{/* Applications Tab */}
				{isApplicant && (
					<TabsContent value="applications" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Your Applications</CardTitle>
								<CardDescription>Track the status of your housing applications</CardDescription>
							</CardHeader>
							<CardContent>
								{applications.length > 0 ? (
									<div className="space-y-4">
										{applications.map((app) => (
											<Card key={app.id}>
												<CardHeader>
													<CardTitle className="text-lg">
														Application for {app.preferred_houses ? app.preferred_houses.join(', ') : 'Accelr8 Housing'}
													</CardTitle>
													<CardDescription>
														Submitted on {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A'}
													</CardDescription>
												</CardHeader>
												<CardContent>
													<div className="flex justify-between items-center">
														<div>
															<p className="font-medium">Status</p>
															<p className="capitalize">{app.status}</p>
														</div>
														{app.status === ApplicationStatus.InterviewScheduled && (
															<div>
																<p className="font-medium">Interview</p>
																<p>Check your email for details</p>
															</div>
														)}
													</div>
												</CardContent>
												<CardFooter>
													<Button variant="outline" className="w-full">View Details</Button>
												</CardFooter>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center p-6">
										<p className="mb-4">You don't have any active applications.</p>
										<Button asChild>
											<Link href="/apply">Apply Now</Link>
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				)}

				{/* Profile Tab */}
				<TabsContent value="profile" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile Settings</CardTitle>
							<CardDescription>Manage your account information</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h3 className="font-medium">Personal Information</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-sm font-medium">Email</p>
										<p>{userProfile?.email}</p>
									</div>
									<div>
										<p className="text-sm font-medium">Role</p>
										<p className="capitalize">{userProfile?.role}</p>
									</div>
									{userProfile?.phone_number && (
										<div>
											<p className="text-sm font-medium">Phone</p>
											<p>{userProfile.phone_number}</p>
										</div>
									)}
								</div>
							</div>

							<div className="pt-4 flex flex-col sm:flex-row gap-2">
								<Button className="flex-1">Edit Profile</Button>
								<Button variant="outline" className="flex-1">Change Password</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}