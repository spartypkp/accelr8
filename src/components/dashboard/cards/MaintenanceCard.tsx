import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Wrench } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface MaintenanceRequest {
	id: string;
	title: string;
	description: string;
	status: "open" | "assigned" | "in_progress" | "completed" | "cancelled";
	created_at: string;
	requested_by: string;
	sanity_house_id: string;
}

interface MaintenanceCardProps {
	houseId: string;
	userId: string;
	limit?: number;
}

const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId, userId, limit] = url.split('/').slice(-4);

	const { data, error } = await supabase
		.from("maintenance_requests")
		.select("*")
		.eq("sanity_house_id", houseId)
		.eq("requested_by", userId)
		.neq("status", "completed")
		.order("created_at", { ascending: false })
		.limit(parseInt(limit));

	if (error) throw error;
	return data;
};

export function MaintenanceCard({ houseId, userId, limit = 3 }: MaintenanceCardProps) {
	const { data, error, isLoading } = useSWR<MaintenanceRequest[]>(
		`/api/maintenance/${houseId}/${userId}/${limit}`,
		fetcher
	);

	// Status colors mapping
	const getStatusColor = (status: MaintenanceRequest['status']) => {
		switch (status) {
			case 'open':
				return 'bg-red-100 text-red-700 hover:bg-red-100';
			case 'in_progress':
				return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
			case 'assigned':
				return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
			case 'completed':
				return 'bg-green-100 text-green-700 hover:bg-green-100';
			default:
				return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
		}
	};

	return (
		<DashboardCard
			title="Maintenance Requests"
			titleIcon={<Wrench className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			fullHeight
		>
			{data && data.length > 0 ? (
				<div className="space-y-4">
					{data.map((request) => (
						<div key={request.id} className="flex items-start space-x-3">
							<div className={`p-2 rounded-md ${request.status === 'open' ? 'bg-red-100' :
								request.status === 'in_progress' ? 'bg-amber-100' :
									request.status === 'assigned' ? 'bg-blue-100' :
										'bg-slate-100'
								}`}>
								<Wrench className={`h-4 w-4 ${request.status === 'open' ? 'text-red-500' :
									request.status === 'in_progress' ? 'text-amber-500' :
										request.status === 'assigned' ? 'text-blue-500' :
											'text-slate-500'
									}`} />
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-sm">{request.title}</p>
									<Badge className={getStatusColor(request.status)}>
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
		</DashboardCard>
	);
} 