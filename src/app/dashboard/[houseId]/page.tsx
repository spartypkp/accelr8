import { AnnouncementsCard } from "@/components/dashboard/cards/AnnouncementsCard";
import { EventsCard } from "@/components/dashboard/cards/EventsCard";
import { MaintenanceCard } from "@/components/dashboard/cards/MaintenanceCard";
import { QuickLinksCard } from "@/components/dashboard/cards/QuickLinksCard";
import { DashboardPanel } from "@/components/dashboard/panels/DashboardPanel";
import { Button } from "@/components/ui/button";
import { getHouse } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(
	{ params }: { params: { houseId: string; }; }
): Promise<Metadata> {
	const house = await getHouse(params.houseId);
	if (!house) {
		return {
			title: "House Not Found | Accelr8",
		};
	}

	return {
		title: `${house.name} Dashboard | Accelr8`,
		description: `Manage your stay at ${house.name}`,
	};
}

export default async function HouseDashboardPage({
	params
}: {
	params: { houseId: string; };
}) {
	const house = await getHouse(params.houseId);

	if (!house) {
		notFound();
	}

	// Get user from Supabase session
	const cookieStore = cookies();
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		// This should not happen due to middleware, but handle just in case
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Welcome to {house.name}</h1>
					<p className="text-muted-foreground">
						Here's what's happening at your house
					</p>
				</div>
				<div className="flex gap-2">
					<Button asChild>
						<Link href={`/dashboard/${params.houseId}/community`}>
							<Users className="mr-2 h-4 w-4" />
							Connect with Residents
						</Link>
					</Button>
				</div>
			</div>

			{/* Latest Announcement (Highlighted) */}
			<AnnouncementsCard
				houseId={params.houseId}
				limit={1}
				showAllLink={false}
			/>

			{/* Dashboard panels */}
			<DashboardPanel>
				{/* Use client components with SWR */}
				<EventsCard houseId={params.houseId} />
				<MaintenanceCard houseId={params.houseId} userId={user.id} />
				<QuickLinksCard houseId={params.houseId} />
			</DashboardPanel>
		</div>
	);
} 