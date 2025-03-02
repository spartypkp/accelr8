import { getLatestAnnouncements, getTodaysChores, getUpcomingEvents } from '@/lib/data/data-utils';
import { motion } from 'framer-motion';
import { Announcements } from '../cards/announcements';
import { ChoresList } from '../cards/chores-list';
import { EventsCalendar } from '../cards/events-calendar';

export function AdminDashboard() {
	// Get data
	const chores = getTodaysChores();
	const announcements = getLatestAnnouncements(3);
	const events = getUpcomingEvents(3); // Limit to fewer events

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col h-full w-full p-6 overflow-hidden"
		>
			<h2 className="text-2xl font-bold text-white mb-6 ml-1 flex items-center">
				<span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
					Administrative Dashboard
				</span>
				<div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent ml-4"></div>
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 h-[calc(100%-3rem)] overflow-hidden">
				<ChoresList chores={chores} className="overflow-hidden max-h-full" />

				<div className="grid grid-rows-2 gap-6 h-full overflow-hidden">
					<Announcements announcements={announcements} className="overflow-hidden" />
					<EventsCalendar events={events} className="overflow-hidden" />
				</div>
			</div>
		</motion.div>
	);
} 