import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface Event {
	id: string;
	title: string;
	start_time: string;
	end_time: string;
	location: string;
	description: string;
	sanity_house_id: string;
}

interface EventsCardProps {
	houseId: string;
	limit?: number;
}

const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId, limit] = url.split('/').slice(-3);

	const { data, error } = await supabase
		.from("internal_events")
		.select("*")
		.eq("sanity_house_id", houseId)
		.gte("start_time", new Date().toISOString())
		.order("start_time", { ascending: true })
		.limit(parseInt(limit));

	if (error) throw error;
	return data;
};

export function EventsCard({ houseId, limit = 3 }: EventsCardProps) {
	const { data, error, isLoading } = useSWR<Event[]>(
		`/api/events/${houseId}/${limit}`,
		fetcher
	);

	return (
		<DashboardCard
			title="Upcoming Events"
			titleIcon={<Calendar className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			fullHeight
		>
			{data && data.length > 0 ? (
				<div className="space-y-4">
					{data.map((event) => (
						<div key={event.id} className="flex items-start space-x-3">
							<div className="bg-primary/10 p-2 rounded-md">
								<Calendar className="h-4 w-4 text-primary" />
							</div>
							<div className="space-y-1">
								<p className="font-medium text-sm">{event.title}</p>
								<div className="flex items-center text-xs text-muted-foreground">
									<Clock className="h-3 w-3 mr-1" />
									<span>
										{new Date(event.start_time).toLocaleDateString()} at{" "}
										{new Date(event.start_time).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
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
		</DashboardCard>
	);
} 