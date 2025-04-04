import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { BookOpenText, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface Resource {
	id: string;
	name: string;
	type: "meeting_room" | "equipment" | "common_area";
	description: string;
	location: string;
	available: boolean;
	image?: string;
	sanity_house_id: string;
}

interface ResourcesCardProps {
	houseId: string;
	limit?: number;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId, limit] = url.split('/').slice(-3);

	// In a real implementation, this would fetch from Supabase
	// For now, return mock data
	const mockResources: Resource[] = [
		{
			id: "1",
			name: "Conference Room A",
			type: "meeting_room",
			description: "Main conference room with video equipment",
			location: "2nd Floor",
			available: true,
			sanity_house_id: houseId
		},
		{
			id: "2",
			name: "Brainstorm Space",
			type: "meeting_room",
			description: "Whiteboard walls and flexible seating",
			location: "1st Floor",
			available: false,
			sanity_house_id: houseId
		},
		{
			id: "3",
			name: "4K Projector",
			type: "equipment",
			description: "High-resolution projector for presentations",
			location: "Equipment Room",
			available: true,
			sanity_house_id: houseId
		},
		{
			id: "4",
			name: "Rooftop Deck",
			type: "common_area",
			description: "Outdoor space with seating and views",
			location: "Roof",
			available: true,
			sanity_house_id: houseId
		}
	];

	return mockResources.slice(0, parseInt(limit));
};

export function ResourcesCard({ houseId, limit = 3 }: ResourcesCardProps) {
	const { data, error, isLoading } = useSWR<Resource[]>(
		`/api/resources/${houseId}/${limit}`,
		fetcher
	);

	// Render icon based on resource type
	const getResourceIcon = (type: Resource['type']) => {
		switch (type) {
			case 'meeting_room':
				return <BookOpenText className="h-4 w-4 text-primary" />;
			case 'equipment':
				return <Clock className="h-4 w-4 text-amber-500" />;
			case 'common_area':
				return <MapPin className="h-4 w-4 text-green-500" />;
			default:
				return <BookOpenText className="h-4 w-4 text-primary" />;
		}
	};

	return (
		<DashboardCard
			title="Available Resources"
			titleIcon={<BookOpenText className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			fullHeight
		>
			{data && data.length > 0 ? (
				<div className="space-y-4">
					{data.map((resource) => (
						<div key={resource.id} className="flex items-start space-x-3">
							<div className={`p-2 rounded-md ${resource.type === 'meeting_room' ? 'bg-primary/10' :
								resource.type === 'equipment' ? 'bg-amber-500/10' :
									'bg-green-500/10'
								}`}>
								{getResourceIcon(resource.type)}
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<p className="font-medium text-sm">{resource.name}</p>
									<span className={`text-xs px-2 py-0.5 rounded-full ${resource.available
										? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
										: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
										}`}>
										{resource.available ? 'Available' : 'In use'}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">{resource.description}</p>
								<div className="flex items-center text-xs text-muted-foreground">
									<MapPin className="h-3 w-3 mr-1" />
									<span>{resource.location}</span>
								</div>
							</div>
						</div>
					))}
					<Button variant="outline" size="sm" className="w-full" asChild>
						<Link href={`/dashboard/${houseId}/resources`}>
							View All Resources
						</Link>
					</Button>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-40 text-center">
					<BookOpenText className="h-10 w-10 text-muted-foreground/60 mb-2" />
					<p className="text-sm text-muted-foreground">No resources available</p>
					<Button variant="outline" size="sm" className="mt-4" asChild>
						<Link href={`/dashboard/${houseId}/resources`}>
							View Resources
						</Link>
					</Button>
				</div>
			)}
		</DashboardCard>
	);
} 