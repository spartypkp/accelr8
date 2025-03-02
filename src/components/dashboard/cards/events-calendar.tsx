import { Event } from '@/lib/data/mock-data';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CalendarDays, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { DashboardCard } from './dashboard-card';

interface EventsCalendarProps {
	events: Event[];
	className?: string;
}

export function EventsCalendar({ events, className }: EventsCalendarProps) {
	// Sort events by date
	const sortedEvents = [...events].sort((a, b) => {
		return a.date.localeCompare(b.date);
	});

	// Function to get days until event
	const getDaysUntil = (dateString: string) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const eventDate = new Date(dateString);
		eventDate.setHours(0, 0, 0, 0);

		const diffTime = eventDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		return `In ${diffDays} days`;
	};

	// Function to generate deterministic attendee counts based on event ID
	const getAttendeeCount = (eventId: string) => {
		// Use the last character of the ID to generate a number between 5-12
		const lastChar = eventId.charCodeAt(eventId.length - 1);
		return (lastChar % 8) + 5; // Results in a number between 5-12
	};

	return (
		<DashboardCard
			title="Upcoming Events"
			titleIcon={<CalendarDays className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="space-y-3 overflow-y-auto h-full pr-1">
				{sortedEvents.length === 0 ? (
					<div className="text-center py-6 text-gray-500">No upcoming events</div>
				) : (
					<div className="relative pl-4 border-l border-blue-800/30">
						{sortedEvents.map((event, index) => {
							// Generate a deterministic hue based on the event title
							const hue = event.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
							const colorClass = hue < 60 ? "from-red-500/20 to-orange-500/5" :
								hue < 120 ? "from-orange-500/20 to-yellow-500/5" :
									hue < 180 ? "from-green-500/20 to-emerald-500/5" :
										hue < 240 ? "from-blue-500/20 to-cyan-500/5" :
											hue < 300 ? "from-indigo-500/20 to-purple-500/5" :
												"from-purple-500/20 to-pink-500/5";

							const borderClass = hue < 60 ? "border-orange-500/20" :
								hue < 120 ? "border-yellow-500/20" :
									hue < 180 ? "border-emerald-500/20" :
										hue < 240 ? "border-cyan-500/20" :
											hue < 300 ? "border-purple-500/20" :
												"border-pink-500/20";

							// Get deterministic attendee count
							const attendeeCount = getAttendeeCount(event.id);

							return (
								<motion.div
									key={event.id}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4, delay: index * 0.1 }}
									className="relative mb-6 last:mb-0"
								>
									{/* Timeline dot */}
									<div className={cn(
										"absolute -left-[21px] w-6 h-6 rounded-full flex items-center justify-center",
										"bg-gray-900", "border-2", borderClass
									)}>
										<div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClass.split(" ")[0].replace('/20', '')}`}></div>
									</div>

									{/* Event card */}
									<div className={cn(
										"ml-2 p-3 rounded-lg bg-gradient-to-br border shadow-lg",
										colorClass, borderClass
									)}>
										<div className="flex justify-between items-start mb-2">
											<h3 className="font-semibold text-sm text-white">{event.title}</h3>
											<span className="text-xs bg-gray-900/40 px-2 py-0.5 rounded-full text-gray-300">
												{getDaysUntil(event.date)}
											</span>
										</div>

										{event.description && (
											<p className="text-sm text-gray-300 mb-3">{event.description}</p>
										)}

										<div className="flex items-center flex-wrap gap-3 text-xs">
											<div className="flex items-center text-blue-400 bg-gray-900/40 px-2 py-1 rounded-full">
												<CalendarIcon className="w-3 h-3 mr-1" />
												<span>{formatDate(event.date)}</span>
											</div>

											{event.time && (
												<div className="flex items-center text-purple-400 bg-gray-900/40 px-2 py-1 rounded-full">
													<Clock className="w-3 h-3 mr-1" />
													<span>{formatTime(event.time)}</span>
												</div>
											)}

											{/* Use deterministic attendee count instead of random */}
											<div className="flex items-center text-green-400 bg-gray-900/40 px-2 py-1 rounded-full">
												<Users className="w-3 h-3 mr-1" />
												<span>{attendeeCount} attending</span>
											</div>

											{/* Mock location - would come from real data in production */}
											<div className="flex items-center text-amber-400 bg-gray-900/40 px-2 py-1 rounded-full">
												<MapPin className="w-3 h-3 mr-1" />
												<span>Common Room</span>
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</DashboardCard>
	);
} 