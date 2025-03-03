import { getLatestAnnouncements, getTodaysChores, getUpcomingEvents } from '@/lib/data/data-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Camera, ChevronLeft, ChevronRight, Megaphone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Announcements } from '../cards/announcements';
import { ChoresList } from '../cards/chores-list';
import { EventsCalendar } from '../cards/events-calendar';

// Mock data for slideshow
const houseImages = [
	{
		src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
		alt: 'Accelr8 House Exterior',
		caption: 'Our beautiful house exterior'
	},
	{
		src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
		alt: 'Accelr8 House Kitchen',
		caption: 'Modern kitchen space'
	},
	{
		src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
		alt: 'Accelr8 House Living Room',
		caption: 'Cozy common area'
	}
];

export function AdminDashboard() {
	// Get data for components
	const chores = getTodaysChores();
	const announcements = getLatestAnnouncements(5);
	const events = getUpcomingEvents(5);

	// State for slideshow
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const nextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === houseImages.length - 1 ? 0 : prevIndex + 1
		);
	};

	const prevImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? houseImages.length - 1 : prevIndex - 1
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen w-full flex flex-col overflow-hidden p-4 md:p-6"
		>
			{/* Dashboard Header */}
			<div className="flex items-center justify-center mb-6">
				<h1 className={cn(
					"text-3xl font-bold bg-clip-text text-transparent",
					"bg-gradient-to-r from-blue-500 to-purple-500"
				)}>
					House Administration
				</h1>
			</div>

			{/* Slideshow Section */}
			<div className="mb-6">
				<div className="flex items-center gap-2 mb-3">
					<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
						<Camera className="text-blue-400 h-4 w-4" />
					</div>
					<h2 className="text-lg font-semibold text-gray-200">House Highlights</h2>
				</div>

				<div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
					<motion.img
						key={currentImageIndex}
						src={houseImages[currentImageIndex].src}
						alt={houseImages[currentImageIndex].alt}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="w-full h-full object-cover"
					/>

					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
						<p className="text-white text-sm md:text-base">
							{houseImages[currentImageIndex].caption}
						</p>
					</div>

					<button
						onClick={prevImage}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
						aria-label="Previous image"
					>
						<ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
					</button>

					<button
						onClick={nextImage}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
						aria-label="Next image"
					>
						<ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
					</button>

					<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
						{houseImages.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentImageIndex(index)}
								className={cn(
									"w-2 h-2 rounded-full transition-colors",
									index === currentImageIndex
										? "bg-white"
										: "bg-white/50 hover:bg-white/80"
								)}
								aria-label={`Go to image ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Dashboard Content - Responsive Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1">
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
				<div className="flex flex-col h-full sm:col-span-2 xl:col-span-1">
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