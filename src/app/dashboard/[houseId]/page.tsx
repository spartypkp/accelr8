import AuthGuard from "@/components/auth/auth-guard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHouse } from "@/lib/api";
import {
	AlertCircle,
	Calendar,
	Clock, InfoIcon,
	Users,
	Wrench
} from "lucide-react";
import { Metadata } from "next";
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

	return (
		<AuthGuard
			requiredPermission="view_house"
			resource={{ id: params.houseId, type: "house" }}
		>
			<HouseDashboardContent houseId={params.houseId} house={house} />
		</AuthGuard>
	);
}

// Separate the authenticated content to a new component
async function HouseDashboardContent({
	houseId,
	house
}: {
	houseId: string;
	house: any;
}) {
	// Get Supabase client
	const supabase = await import("@/lib/supabase/client").then(
		(mod) => mod.createClient()
	);

	// Get announcements from Supabase
	const { data: announcements } = await supabase
		.from("announcements")
		.select("*")
		.eq("sanity_house_id", houseId)
		.order("created_at", { ascending: false })
		.limit(3);

	// Get upcoming events
	const { data: events } = await supabase
		.from("internal_events")
		.select("*")
		.eq("sanity_house_id", houseId)
		.gte("start_time", new Date().toISOString())
		.order("start_time", { ascending: true })
		.limit(3);

	// Get maintenance requests - we need the user from requirePermission for this
	// so we're using it directly in the component
	const { requirePermission } = await import('@/components/auth/auth-guard');
	const user = await requirePermission('view_house', { id: houseId, type: 'house' });

	const { data: maintenanceRequests } = await supabase
		.from("maintenance_requests")
		.select("*")
		.eq("sanity_house_id", houseId)
		.eq("requested_by", user?.id)
		.neq("status", "completed")
		.order("created_at", { ascending: false })
		.limit(3);

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
						<Link href={`/dashboard/${houseId}/community`}>
							<Users className="mr-2 h-4 w-4" />
							Connect with Residents
						</Link>
					</Button>
				</div>
			</div>

			{/* Recent announcements */}
			{announcements && announcements.length > 0 && (
				<Alert variant="default" className="bg-amber-50 border-amber-200">
					<AlertCircle className="h-4 w-4 text-amber-600" />
					<AlertTitle>House Announcement</AlertTitle>
					<AlertDescription>
						{announcements[0].title}
					</AlertDescription>
					<div className="mt-2">
						<Link
							href={`/dashboard/${houseId}/announcements`}
							className="text-sm text-amber-600 font-medium hover:underline"
						>
							View all announcements
						</Link>
					</div>
				</Alert>
			)}

			{/* Dashboard grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Upcoming events */}
				<Card className="col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Upcoming Events
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{events && events.length > 0 ? (
							<div className="space-y-4">
								{events.map((event) => (
									<div key={event.id} className="flex items-start space-x-3">
										<div className="bg-slate-100 p-2 rounded-md">
											<Calendar className="h-4 w-4 text-blue-500" />
										</div>
										<div className="space-y-1">
											<p className="font-medium text-sm">{event.title}</p>
											<p className="text-xs text-muted-foreground">
												{new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</p>
										</div>
									</div>
								))}
								<Button variant="outline" size="sm" className="w-full" asChild>
									<Link href={`/dashboard/${houseId}/events`}>
										View All Events
									</Link>
								</Button>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-40 text-center">
								<Calendar className="h-10 w-10 text-muted-foreground/60 mb-2" />
								<p className="text-sm text-muted-foreground">No upcoming events</p>
								<Button variant="outline" size="sm" className="mt-4" asChild>
									<Link href={`/dashboard/${houseId}/events`}>
										View Events Calendar
									</Link>
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Maintenance requests */}
				<Card className="col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Maintenance Requests
						</CardTitle>
						<Wrench className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{maintenanceRequests && maintenanceRequests.length > 0 ? (
							<div className="space-y-4">
								{maintenanceRequests.map((request) => (
									<div key={request.id} className="flex items-start space-x-3">
										<div className={`p-2 rounded-md ${request.status === 'open' ? 'bg-red-100' :
											request.status === 'in_progress' ? 'bg-amber-100' :
												'bg-slate-100'
											}`}>
											<Wrench className={`h-4 w-4 ${request.status === 'open' ? 'text-red-500' :
												request.status === 'in_progress' ? 'text-amber-500' :
													'text-slate-500'
												}`} />
										</div>
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<p className="font-medium text-sm">{request.title}</p>
												<Badge className={
													request.status === 'open' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
														request.status === 'in_progress' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
															request.status === 'assigned' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
																'bg-slate-100 text-slate-700 hover:bg-slate-100'
												}>
													{request.status.replace('_', ' ')}
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground">
												Reported on {new Date(request.created_at).toLocaleDateString()}
											</p>
										</div>
									</div>
								))}
								<Button variant="outline" size="sm" className="w-full" asChild>
									<Link href={`/dashboard/${houseId}/maintenance`}>
										View All Requests
									</Link>
								</Button>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-40 text-center">
								<Wrench className="h-10 w-10 text-muted-foreground/60 mb-2" />
								<p className="text-sm text-muted-foreground">No active maintenance requests</p>
								<Button variant="outline" size="sm" className="mt-4" asChild>
									<Link href={`/dashboard/${houseId}/maintenance/new`}>
										Submit a Request
									</Link>
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* House quick links */}
				<Card className="col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Quick Links
						</CardTitle>
						<InfoIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Button variant="outline" className="w-full justify-start" asChild>
								<Link href={`/dashboard/${houseId}/resources`}>
									<Clock className="mr-2 h-4 w-4" />
									Book a Resource
								</Link>
							</Button>
							<Button variant="outline" className="w-full justify-start" asChild>
								<Link href={`/dashboard/${houseId}/maintenance/new`}>
									<Wrench className="mr-2 h-4 w-4" />
									Report an Issue
								</Link>
							</Button>
							<Button variant="outline" className="w-full justify-start" asChild>
								<Link href={`/dashboard/${houseId}/community`}>
									<Users className="mr-2 h-4 w-4" />
									Resident Directory
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 