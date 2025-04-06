import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Building, HomeIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "House Selection | Accelr8",
	description: "Select a house to view",
};

// Define house type
type House = {
	id: string;
	name: string;
	address: string;
	image_url?: string;
};

export default async function DashboardPage() {
	const supabase = await createClient();

	// Get current user
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect("/login");
	}

	// Get user role
	const { data: userData } = await supabase
		.from('accelr8_users')
		.select('role')
		.eq('id', user.id)
		.single();

	const userRole = userData?.role || 'resident';

	// Get houses based on user role
	const houses: House[] = [];

	if (userRole === 'super_admin') {
		// Super admins can see all houses
		const { data: allHouses } = await supabase
			.from('houses')
			.select('id, name, address, image_url');

		if (allHouses) {
			allHouses.forEach((house: any) => {
				houses.push({
					id: house.id,
					name: house.name,
					address: house.address,
					image_url: house.image_url
				});
			});
		}
	} else if (userRole === 'admin') {
		// Admins see houses they manage
		const { data: adminHouses } = await supabase
			.from('house_admins')
			.select(`
				id,
				houses:sanity_house_id (
					id, 
					name,
					address,
					image_url
				)
			`)
			.eq('user_id', user.id);

		if (adminHouses) {
			adminHouses.forEach((item: any) => {
				if (item.houses) {
					houses.push({
						id: item.houses.id,
						name: item.houses.name,
						address: item.houses.address,
						image_url: item.houses.image_url
					});
				}
			});
		}
	} else {
		// Residents see houses they live in
		const { data: residentHouses } = await supabase
			.from('residencies')
			.select(`
				id,
				houses:sanity_house_id (
					id, 
					name,
					address,
					image_url
				)
			`)
			.eq('user_id', user.id)
			.eq('status', 'active');

		if (residentHouses) {
			residentHouses.forEach((item: any) => {
				if (item.houses) {
					houses.push({
						id: item.houses.id,
						name: item.houses.name,
						address: item.houses.address,
						image_url: item.houses.image_url
					});
				}
			});
		}
	}

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
									{userRole === 'admin' || userRole === 'super_admin'
										? 'You have management access to this house'
										: 'You are a resident of this house'}
								</p>
							</CardContent>
							<CardFooter>
								<Button asChild className="w-full">
									<Link href={`/dashboard/${house.id}/${userRole === 'resident' ? 'resident' : 'admin'}`}>
										{userRole === 'resident' ? 'Go to Resident Dashboard' : 'Manage House'}
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
} 