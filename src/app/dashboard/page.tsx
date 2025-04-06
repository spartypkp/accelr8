'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/UserContext";
import { Building, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
	const { user, extendedUser, houses, loadingHouses, fetchUserHouses, isAdmin, isSuperAdmin } = useUser();
	const router = useRouter();

	useEffect(() => {
		// Redirect to login if no user
		if (!user && !extendedUser) {
			router.push('/login');
			return;
		}

		// Fetch houses if needed
		if (houses.length === 0 && !loadingHouses) {
			fetchUserHouses();
		}

		// Auto-redirect if user has access to exactly one house
		if (houses.length === 1) {
			const houseId = houses[0].id;
			const redirectPath = houses[0].accessType === 'resident' || (!isAdmin && !isSuperAdmin)
				? `/dashboard/${houseId}/resident`
				: `/dashboard/${houseId}/admin`;
			router.push(redirectPath);
		}
	}, [user, extendedUser, houses, loadingHouses, fetchUserHouses, router, isAdmin, isSuperAdmin]);

	// Show loading state while fetching houses
	if (loadingHouses) {
		return (
			<div className="container max-w-6xl mx-auto py-8">
				<div className="mb-8 flex items-center gap-2">
					<HomeIcon className="h-6 w-6" />
					<h1 className="text-3xl font-bold">Your Houses</h1>
				</div>
				<div className="text-center p-8">
					<p>Loading your houses...</p>
				</div>
			</div>
		);
	}

	// Determine preferred access type based on user role
	const preferredAccessType = isAdmin || isSuperAdmin ? 'admin' : 'resident';

	return (
		<div className="container max-w-6xl mx-auto py-8">
			<div className="mb-8 flex items-center gap-2">
				<HomeIcon className="h-6 w-6" />
				<h1 className="text-3xl font-bold">Your Houses</h1>
			</div>

			{houses.length === 0 ? (
				<div className="text-center p-8 border rounded-lg bg-muted/50">
					<Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
					<h2 className="text-xl font-semibold mb-2">No Houses Available</h2>
					<p className="text-muted-foreground mb-4">
						You don't have access to any houses yet.
					</p>
					<Button asChild>
						<Link href="/houses">Browse Houses</Link>
					</Button>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{houses.map((house) => (
						<Card key={house.id} className="overflow-hidden">
							<div className="h-48 relative bg-muted">
								{house.image_url ? (
									<img
										src={house.image_url}
										alt={house.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="flex items-center justify-center h-full">
										<Building className="h-12 w-12 text-muted-foreground" />
									</div>
								)}
							</div>
							<CardHeader>
								<CardTitle>{house.name}</CardTitle>
								<CardDescription>{house.address}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm">
									{house.accessType === 'admin'
										? 'You have management access to this house'
										: 'You are a resident of this house'}
								</p>
							</CardContent>
							<CardFooter className="flex flex-col space-y-2">
								{/* Primary access button based on role */}
								<Button asChild className="w-full">
									<Link href={`/dashboard/${house.id}/${preferredAccessType}`}>
										{preferredAccessType === 'resident' ? 'Go to Resident Dashboard' : 'Manage House'}
									</Link>
								</Button>

								{/* Secondary access button if user has dual access */}
								{isAdmin && house.accessType === 'resident' && (
									<Button asChild variant="outline" className="w-full">
										<Link href={`/dashboard/${house.id}/admin`}>
											Manage as Admin
										</Link>
									</Button>
								)}
								{house.accessType === 'admin' && (
									<Button asChild variant="outline" className="w-full">
										<Link href={`/dashboard/${house.id}/resident`}>
											View as Resident
										</Link>
									</Button>
								)}
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}