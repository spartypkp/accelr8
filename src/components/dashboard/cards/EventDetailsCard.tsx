import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, MessageSquare, ThumbsUp, Users } from "lucide-react";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface Attendee {
	id: string;
	name: string;
	avatar?: string;
}

interface Event {
	id: string;
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	location: string;
	type: string;
	organizer: string;
	attendees: Attendee[];
	capacity: number;
	tags: string[];
	required?: boolean;
	sanity_house_id: string;
}

interface EventDetailsCardProps {
	eventId: string;
	houseId: string;
	className?: string;
	onRSVP?: (eventId: string, attending: boolean) => void;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, eventId, houseId] = url.split('/').slice(-3);

	// In a real implementation, this would fetch from Supabase
	// For now, return mock data
	const mockEvent: Event = {
		id: eventId,
		title: "Founder Pitch Practice",
		description: "Weekly session for founders to practice their pitches and get feedback from peers. Open to all house residents.",
		start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in the future
		end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
		location: "Conference Room",
		type: "Workshop",
		organizer: "Maya Johnson",
		attendees: [
			{ id: "1", name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: "2", name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: "3", name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: "4", name: "Jordan Lee", avatar: "/placeholder-user.jpg" },
			{ id: "5", name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: "6", name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
			{ id: "7", name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			{ id: "8", name: "Robin Patel", avatar: "/placeholder-user.jpg" },
		],
		capacity: 12,
		tags: ["Pitch Practice", "Feedback", "Networking"],
		sanity_house_id: houseId
	};

	return mockEvent;
};

export function EventDetailsCard({ eventId, houseId, className, onRSVP }: EventDetailsCardProps) {
	const { data: event, error, isLoading } = useSWR<Event>(
		`/api/events/${eventId}/${houseId}`,
		fetcher
	);

	// Format date to display as "Monday, July 15"
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
	};

	// Format time to display as "6:00 PM - 8:00 PM"
	const formatTimeRange = (startTimeString: string, endTimeString: string) => {
		const startTime = new Date(startTimeString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
		const endTime = new Date(endTimeString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
		return `${startTime} - ${endTime}`;
	};

	// Handle RSVP action
	const handleRSVP = (attending: boolean) => {
		if (event && onRSVP) {
			onRSVP(event.id, attending);
		}
	};

	return (
		<DashboardCard
			title="Event Details"
			titleIcon={<Calendar className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			className={className}
			fullHeight
		>
			{event && (
				<div className="space-y-4">
					{/* Event Header */}
					<div className={cn("px-4 py-3 -mx-4 -mt-2 bg-muted/50",
						event.required ? "border-l-4 border-primary" : "")}>
						<div className="flex justify-between items-start">
							<h3 className="text-lg font-semibold">{event.title}</h3>
							<Badge>{event.type}</Badge>
						</div>
						<div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
							<div className="flex items-center">
								<Calendar className="h-4 w-4 mr-1.5" />
								<span>{formatDate(event.start_time)}</span>
							</div>
							<div className="flex items-center">
								<Clock className="h-4 w-4 mr-1.5" />
								<span>{formatTimeRange(event.start_time, event.end_time)}</span>
							</div>
							<div className="flex items-center">
								<MapPin className="h-4 w-4 mr-1.5" />
								<span>{event.location}</span>
							</div>
						</div>
					</div>

					{/* Event Description */}
					<div>
						<p className="text-sm">{event.description}</p>
					</div>

					{/* Organized By */}
					<div>
						<p className="text-sm text-muted-foreground mb-1">Organized by</p>
						<div className="flex items-center">
							<Avatar className="h-8 w-8 mr-2">
								<AvatarImage src="/placeholder-user.jpg" alt={event.organizer} />
								<AvatarFallback>{event.organizer[0]}</AvatarFallback>
							</Avatar>
							<span className="text-sm font-medium">{event.organizer}</span>
						</div>
					</div>

					{/* Attendees */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<p className="text-sm text-muted-foreground">
								Attendees ({event.attendees.length}/{event.capacity})
							</p>
							<Button variant="ghost" size="sm" className="h-7 text-xs">View All</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{event.attendees.slice(0, 8).map((attendee) => (
								<Avatar key={attendee.id} className="h-8 w-8 border-2 border-background">
									<AvatarImage src={attendee.avatar} alt={attendee.name} />
									<AvatarFallback>{attendee.name[0]}</AvatarFallback>
								</Avatar>
							))}
							{event.attendees.length > 8 && (
								<div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs border-2 border-background">
									+{event.attendees.length - 8}
								</div>
							)}
						</div>
					</div>

					{/* Tags */}
					<div>
						<p className="text-sm text-muted-foreground mb-2">Tags</p>
						<div className="flex flex-wrap gap-2">
							{event.tags.map((tag, idx) => (
								<Badge key={idx} variant="outline">
									{tag}
								</Badge>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className="pt-2 mt-4 border-t flex justify-between">
						<Button variant="ghost" size="sm">
							<MessageSquare className="h-4 w-4 mr-2" />
							Discussion
						</Button>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => handleRSVP(false)}>
								<ThumbsUp className="h-4 w-4 mr-2" />
								Interested
							</Button>
							<Button size="sm" onClick={() => handleRSVP(true)}>
								<Users className="h-4 w-4 mr-2" />
								RSVP
							</Button>
						</div>
					</div>
				</div>
			)}
		</DashboardCard>
	);
} 