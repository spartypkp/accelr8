import { getLatestAnnouncements, getTodaysChores, getUpcomingEvents } from '@/lib/data/data-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Megaphone, Trash2 } from 'lucide-react';
import { Announcements } from '../cards/announcements';
import { ChoresList } from '../cards/chores-list';
import { EventsCalendar } from '../cards/events-calendar';

export function AdminDashboard() {
	// Get data for components
	const chores = getTodaysChores();
	const announcements = getLatestAnnouncements(5);
	const events = getUpcomingEvents(5);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="h-screen w-full flex flex-col overflow-hidden p-4 md:p-6"
		>
			{/* Dashboard Header */}
			<div className="flex items-center justify-center mb-4">
				<h1 className={cn(
					"text-3xl font-bold bg-clip-text text-transparent",
					"bg-gradient-to-r from-blue-500 to-purple-500"
				)}>
					House Administration
				</h1>
			</div>

			{/* Dashboard Content */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 h-[calc(100vh-100px)]">
				{/* Column 1: Chores Assignment */}
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-2">
						<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
							<Trash2 className="text-blue-400 h-4 w-4" />
						</div>
						<h2 className="text-lg font-semibold text-gray-200">Daily Chores</h2>
					</div>
					<div className="flex-1 overflow-hidden">
						<ChoresList chores={chores} className="h-full" />
					</div>
				</div>

				{/* Column 2: Announcements */}
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-2">
						<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
							<Megaphone className="text-blue-400 h-4 w-4" />
						</div>
						<h2 className="text-lg font-semibold text-gray-200">Announcements</h2>
					</div>
					<div className="flex-1 overflow-hidden">
						<Announcements announcements={announcements} className="h-full" />
					</div>
				</div>

				{/* Column 3: Events Calendar */}
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-2">
						<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
							<Calendar className="text-blue-400 h-4 w-4" />
						</div>
						<h2 className="text-lg font-semibold text-gray-200">Upcoming Events</h2>
					</div>
					<div className="flex-1 overflow-hidden">
						<EventsCalendar events={events} className="h-full" />
					</div>
				</div>
			</div>
		</motion.div>
	);
} 