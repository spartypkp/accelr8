'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/UserContext";
import { getApplications } from "@/lib/api/applications";
import { getHouses } from "@/lib/api/houses";
import { urlFor } from "@/lib/sanity/client";
import { ApplicationStatus, House, SupabaseApplication } from "@/lib/types";
import {
	ArrowRight,
	ClipboardList,
	HomeIcon,
	LayoutDashboard,
	ShieldAlert,
	Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
	const { user, userProfile, isLoadingProfile, isAdmin, isSuperAdmin, isResident, isApplicant } = useUser();
	const router = useRouter();
	const [houses, setHouses] = useState<House[]>([]);
	const [applications, setApplications] = useState<SupabaseApplication[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingError, setLoadingError] = useState<string | null>(null);
	const hasLoadedOnce = useRef(false);
	const { toast } = useToast();

	useEffect(() => {
		async function fetchData() {
			if (!userProfile) return; // Skip if userProfile is not available yet

			setIsLoading(true);
			setLoadingError(null);

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

				hasLoadedOnce.current = true;
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				setLoadingError('There was an error loading your dashboard data. Please try refreshing the page.');
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [userProfile, isResident, isAdmin, isSuperAdmin, isApplicant, user]);

	// Show loading state when profile is loading or data is loading
	if ((isLoadingProfile || isLoading) && !hasLoadedOnce.current) {
		return (
			<div className="container max-w-5xl mx-auto py-8 space-y-8">
				<div className="flex items-center space-x-4">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<LayoutDashboard className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Dashboard</h1>
				</div>

				<Card className="border-none shadow-md">
					<CardHeader>
						<Skeleton className="h-7 w-48" />
						<Skeleton className="h-4 w-72 mt-2" />
					</CardHeader>
					<CardContent className="space-y-8">
						<div className="space-y-4">
							<Skeleton className="h-6 w-32" />
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[...Array(3)].map((_, i) => (
									<Card key={i} className="border-none">
										<CardHeader className="pb-2">
											<Skeleton className="h-5 w-40" />
											<Skeleton className="h-4 w-32 mt-1" />
										</CardHeader>
										<CardContent className="pb-2">
											<Skeleton className="h-4 w-full mb-2" />
											<Skeleton className="h-4 w-full" />
										</CardContent>
										<CardFooter>
											<Skeleton className="h-10 w-full" />
										</CardFooter>
									</Card>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show a message if no profile is available
	if (!userProfile) {
		return (
			<div className="container max-w-5xl mx-auto py-8 space-y-8">
				<div className="flex items-center space-x-4">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<LayoutDashboard className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Dashboard</h1>
				</div>
				<Card className="border-none shadow-lg">
					<CardHeader className="bg-primary/5">
						<CardTitle>Welcome</CardTitle>
						<CardDescription>Your profile information is not available</CardDescription>
					</CardHeader>
					<CardContent>
						<p>There was an issue loading your profile. Please try refreshing the page or contact support.</p>
						<Button className="mt-4" onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error handling
	if (loadingError) {
		return (
			<div className="container max-w-5xl mx-auto py-8 space-y-8">
				<div className="flex items-center space-x-4">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<LayoutDashboard className="h-5 w-5 text-primary" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Dashboard</h1>
				</div>
				<Card className="border-none shadow-lg">
					<CardHeader className="bg-destructive/10">
						<CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
						<CardDescription>There was a problem fetching your data</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{loadingError}</p>
						<Button className="mt-4" onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Helper function to get status badge
	const getApplicationStatusBadge = (status: ApplicationStatus) => {
		switch (status) {
			case ApplicationStatus.Approved:
			case ApplicationStatus.Accepted:
				return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs flex items-center">
					{status.replace('_', ' ')}
				</span>;
			case ApplicationStatus.Reviewing:
			case ApplicationStatus.InterviewScheduled:
			case ApplicationStatus.InterviewCompleted:
				return <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs flex items-center">
					{status.replace('_', ' ')}
				</span>;
			case ApplicationStatus.Waitlisted:
				return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs flex items-center">
					{status.replace('_', ' ')}
				</span>;
			case ApplicationStatus.Rejected:
			case ApplicationStatus.Cancelled:
				return <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs flex items-center">
					{status.replace('_', ' ')}
				</span>;
			default:
				return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs flex items-center">
					{status.replace('_', ' ')}
				</span>;
		}
	};

	return (
		<div className="container max-w-5xl mx-auto py-8 space-y-8">
			{/* Dashboard Header */}
			<div className="flex items-center">
				<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
					<LayoutDashboard className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
						Dashboard
					</h1>
					<p className="text-muted-foreground">
						Welcome, {userProfile?.sanityPerson?.name?.split(' ')[0] || userProfile?.email?.split('@')[0]}
					</p>
				</div>
			</div>

			{/* Main Dashboard Content */}
			<div className="grid grid-cols-1 gap-6">
				{/* Applicant View: Application Cards */}
				{isApplicant && (
					<Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
							<CardTitle className="flex items-center">
								<ClipboardList className="h-5 w-5 mr-2 text-primary" />
								Your Application Dashboard
							</CardTitle>
							<CardDescription>
								Manage and track your applications to Accelr8 houses
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-4">
								{applications.length > 0 ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{applications.map((app) => (
											<Card key={app.id} className="border shadow-sm hover:shadow transition-shadow">
												<CardHeader className="pb-2">
													<CardTitle className="text-base flex justify-between items-center">
														<span>Application {app.id.split('-')[0]}</span>
														{getApplicationStatusBadge(app.status)}
													</CardTitle>
													<CardDescription className="text-xs">
														Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Not submitted yet'}
													</CardDescription>
												</CardHeader>
												<CardFooter className="pt-2 pb-4">
													<Button
														className="w-full"
														onClick={() => router.push(`/dashboard/applications/${app.id}`)}
													>
														View Application <ArrowRight className="h-4 w-4 ml-2" />
													</Button>
												</CardFooter>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center py-6">
										<ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
										<h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
										<p className="text-muted-foreground mb-4">Start your journey with Accelr8 by applying for a house.</p>
										<Button asChild>
											<Link href="/apply">Apply Now</Link>
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* House Cards for Residents & Admins */}
				{(isResident || isAdmin || isSuperAdmin) && houses.length > 0 && (
					<Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
							<CardTitle className="flex items-center">
								<HomeIcon className="h-5 w-5 mr-2 text-primary" />
								Your Houses
							</CardTitle>
							<CardDescription>
								Access your Accelr8 houses and their dashboards
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{houses.map((house) => (
									<Card key={house.id} className="border shadow-sm overflow-hidden">
										<div className="h-32 bg-muted relative">
											{house.sanityHouse?.mainImage ? (
												<>
													<img
														src={urlFor(house.sanityHouse.mainImage).width(400).height(200).url()}
														alt={house.sanityHouse?.name || "House"}
														className="w-full h-full object-cover"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
													<div className="absolute bottom-0 left-0 p-3">
														<h3 className="font-semibold text-white">{house.sanityHouse?.name || "Unnamed House"}</h3>
													</div>
												</>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<HomeIcon className="h-8 w-8 text-muted-foreground" />
												</div>
											)}
										</div>
										<CardContent className="p-4">
											<div className="flex flex-wrap gap-2 mb-4">
												<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs capitalize">
													{house.status}
												</span>
												<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs flex items-center gap-1">
													<Users className="h-3 w-3" /> {house.current_occupancy}
												</span>
											</div>
											<div className="grid grid-cols-2 gap-2">
												<Button
													onClick={() => router.push(`/dashboard/${house.id}/resident`)}
													className="w-full"
												>
													Resident
												</Button>

												{(isAdmin || isSuperAdmin) && (
													<Button
														variant="outline"
														onClick={() => router.push(`/dashboard/${house.id}/admin`)}
														className="w-full"
													>
														Admin
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* For residents who don't have houses yet */}
				{(isResident || isAdmin || isSuperAdmin) && houses.length === 0 && (
					<Card className="border border-dashed">
						<CardContent className="text-center py-10">
							<HomeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="font-medium text-lg">No Houses Available</h3>
							<p className="text-muted-foreground mt-1 mb-4">You don't have access to any houses yet.</p>
							<Button variant="outline" asChild>
								<Link href="/houses">
									View Available Houses
								</Link>
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Super Admin Global Dashboard */}
				{isSuperAdmin && (
					<Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
							<CardTitle className="flex items-center">
								<ShieldAlert className="h-5 w-5 mr-2 text-primary" />
								Super Admin Dashboard
							</CardTitle>
							<CardDescription>
								Access global admin tools and features
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<Button
								className="w-full"
								onClick={() => router.push("/dashboard/superAdmin")}
							>
								Go to Super Admin Dashboard <ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}