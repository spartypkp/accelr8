import { Event } from '@/lib/data/mock-data';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardCard } from './dashboard-card';

interface EventsCalendarProps {
	events: Event[];
	className?: string;
	compact?: boolean;
	autoCycle?: boolean;
	cycleDuration?: number;
}

export function EventsCalendar({
	events,
	className,
	compact = false,
	autoCycle = false,
	cycleDuration = 10000
}: EventsCalendarProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Sort events by date
	const sortedEvents = [...events].sort((a, b) => {
		return a.date.localeCompare(b.date);
	});

	// Auto cycle through events if enabled
	useEffect(() => {
		if (!autoCycle || sortedEvents.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % sortedEvents.length);
		}, cycleDuration);

		return () => clearInterval(interval);
	}, [autoCycle, sortedEvents.length, cycleDuration]);

	// Handler for manual navigation
	const handlePrevious = () => {
		setCurrentIndex(prev => (prev - 1 + sortedEvents.length) % sortedEvents.length);
	};

	const handleNext = () => {
		setCurrentIndex(prev => (prev + 1) % sortedEvents.length);
	};

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

	// Return empty state if no events
	if (sortedEvents.length === 0) {
		return (
			<DashboardCard
				title={compact ? undefined : "Upcoming Events"}
				titleClassName={compact ? undefined : "flex items-center gap-2"}
				titleIcon={compact ? undefined : <CalendarDays className="w-4 h-4 text-blue-400" />}
				className={cn("h-full", className)}
				contentClassName="overflow-hidden"
			>
				<div className="text-center py-3 text-gray-500 text-sm">No upcoming events</div>
			</DashboardCard>
		);
	}

	// Function to render a single event
	const renderEvent = (event: Event, isCompact: boolean) => {
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

		if (isCompact) {
			// Compact version for TV display
			return (
				<div
					className={cn(
						"p-1.5 rounded-lg bg-gradient-to-br border",
						colorClass, borderClass, "shadow-sm"
					)}
				>
					<div className="flex justify-between items-start mb-0.5">
						<h3 className="font-semibold text-[10px] text-white">{event.title}</h3>
						<span className="text-[8px] bg-gray-900/40 px-1 py-0.5 rounded-full text-gray-300">
							{getDaysUntil(event.date)}
						</span>
					</div>

					{event.description && (
						<p className="text-[9px] text-gray-300 mb-1 line-clamp-1">{event.description}</p>
					)}

					<div className="flex items-center flex-wrap gap-1.5 text-[8px]">
						<div className="flex items-center text-blue-400 bg-gray-900/40 px-1 py-0.5 rounded-full">
							<CalendarIcon className="w-2 h-2 mr-0.5" />
							<span>{formatDate(event.date)}</span>
						</div>

						{event.time && (
							<div className="flex items-center text-purple-400 bg-gray-900/40 px-1 py-0.5 rounded-full">
								<Clock className="w-2 h-2 mr-0.5" />
								<span>{event.time}</span>
							</div>
						)}

						<div className="flex items-center text-green-400 bg-gray-900/40 px-1 py-0.5 rounded-full">
							<Users className="w-2 h-2 mr-0.5" />
							<span>{attendeeCount} attending</span>
						</div>
					</div>
				</div>
			);
		}

		// Full version
		return (
			<div className="relative mb-6 last:mb-0">
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

						{/* Use deterministic attendee count */}
						<div className="flex items-center text-green-400 bg-gray-900/40 px-2 py-1 rounded-full">
							<Users className="w-3 h-3 mr-1" />
							<span>{attendeeCount} attending</span>
						</div>

						{/* Mock location */}
						<div className="flex items-center text-amber-400 bg-gray-900/40 px-2 py-1 rounded-full">
							<MapPin className="w-3 h-3 mr-1" />
							<span>Common Room</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// For single event with auto cycle or compact view
	if ((sortedEvents.length === 1 || autoCycle) && compact) {
		return (
			<div className={cn("h-full flex flex-col", className)}>
				<div className="flex justify-between items-center mb-1">
					{sortedEvents.length > 1 && (
						<div className="flex items-center gap-2">
							<button
								onClick={handlePrevious}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700"
							>
								<ChevronLeft className="w-3 h-3" />
							</button>
							<div className="text-[10px] text-gray-400">
								{currentIndex + 1} / {sortedEvents.length}
							</div>
							<button
								onClick={handleNext}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700"
							>
								<ChevronRight className="w-3 h-3" />
							</button>
						</div>
					)}
				</div>

				<div className="flex-1 overflow-hidden">
					<AnimatePresence mode="wait">
						<motion.div
							key={sortedEvents[currentIndex].id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -5 }}
							transition={{ duration: 0.3 }}
						>
							{renderEvent(sortedEvents[currentIndex], true)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		);
	}

	// Full rendering for timeline view
	if (!compact) {
		return (
			<DashboardCard
				title="Upcoming Events"
				titleIcon={<CalendarDays className="w-4 h-4 text-blue-400" />}
				className={cn("h-full", className)}
				contentClassName="overflow-hidden"
			>
				<div className="space-y-3 overflow-y-auto h-full pr-1">
					<div className="relative pl-4 border-l border-blue-800/30">
						{sortedEvents.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
							>
								{renderEvent(event, false)}
							</motion.div>
						))}
					</div>
				</div>
			</DashboardCard>
		);
	}

	// Compact list view
	return (
		<div data-component="events" className={cn("h-full", className)}>
			<AnimatePresence mode="wait">
				<motion.div
					key={sortedEvents[currentIndex].id}
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.3 }}
					className="h-full"
				>
					{renderEvent(sortedEvents[currentIndex], true)}
				</motion.div>
			</AnimatePresence>

			{/* Hidden buttons for external control */}
			<button
				data-action="prev"
				className="hidden"
				onClick={handlePrevious}
				aria-hidden="true"
			/>
			<button
				data-action="next"
				className="hidden"
				onClick={handleNext}
				aria-hidden="true"
			/>
		</div>
	);
} 