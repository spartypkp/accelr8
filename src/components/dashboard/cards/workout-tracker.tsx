import { ProfilePicture } from '@/components/ui/profile-picture';
import { Resident } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Dumbbell, Medal, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { DashboardCard } from './dashboard-card';

// Extended resident interface with workout data
interface ResidentWithWorkouts extends Resident {
	workoutDays: number[];
}

interface WorkoutTrackerProps {
	residentStats: ResidentWithWorkouts[];
	className?: string;
}

export function WorkoutTracker({ residentStats, className }: WorkoutTrackerProps) {
	// Generate labels for the last 14 days
	// Use useMemo to calculate the days once
	const { dayLabels, sortedResidents } = useMemo(() => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		// Use a fixed date for server-rendering to avoid hydration mismatches
		// In a production app, you would get this from the API
		const fixedToday = 3; // Represents Wednesday (0 = Sunday, 1 = Monday, etc.)

		const labels = Array(14).fill(0).map((_, i) => {
			// Calculate what day of the week each of the last 14 days was
			// Starting with the oldest day first
			const dayIndex = (fixedToday - 13 + i + 7) % 7; // Ensure positive index
			return days[dayIndex];
		});

		// Sort residents by number of workouts, using the full 30 days of data
		const sorted = [...residentStats].sort((a, b) => {
			const aTotal = a.workoutDays.reduce((sum, day) => sum + day, 0);
			const bTotal = b.workoutDays.reduce((sum, day) => sum + day, 0);
			return bTotal - aTotal;
		});

		return { dayLabels: labels, sortedResidents: sorted };
	}, [residentStats]);

	// Get total workouts for each resident (full 30 days)
	const getWorkoutTotal = (workoutDays: number[]) => {
		return workoutDays.reduce((sum, day) => sum + day, 0);
	};

	// Get the recent workout data for display (last 14 days)
	const getRecentWorkoutDays = (workoutDays: number[]) => {
		// Get last 14 days from the 30-day dataset
		return workoutDays.slice(workoutDays.length - 14);
	};

	return (
		<DashboardCard
			title="14-Day Workout Tracker"
			titleIcon={<Dumbbell className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			{sortedResidents.length === 0 ? (
				<div className="text-center py-6 text-gray-500">No workout data available</div>
			) : (
				<div className="space-y-3 overflow-y-auto h-full pr-1 flex flex-col">
					{/* Top 3 Athletes - Fixed height container */}
					<div className="flex justify-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-900/40 rounded-lg border border-gray-800 flex-shrink-0 h-[80px] sm:h-[90px]">
						{sortedResidents.slice(0, 3).map((resident, index) => {
							const totalWorkouts = getWorkoutTotal(resident.workoutDays);
							const BadgeIcon = index === 0 ? Trophy : Medal;
							const badgeColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600';
							const glowColor = index === 0 ? 'shadow-yellow-500/30' : index === 1 ? 'shadow-gray-400/30' : 'shadow-amber-700/30';

							return (
								<motion.div
									key={resident.id}
									className="flex flex-col items-center"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: index * 0.1 }}
								>
									<div className="relative">
										<motion.div
											className={`absolute -inset-1 rounded-full blur-md -z-10 ${index === 0 ? 'bg-yellow-500/20' : index === 1 ? 'bg-gray-400/20' : 'bg-amber-700/20'}`}
											animate={{
												opacity: [0.4, 0.7, 0.4],
												scale: [0.96, 1.01, 0.96]
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "easeInOut"
											}}
										/>
										<ProfilePicture
											name={resident.name}
											imageUrl={resident.imagePath}
											size={index === 0 ? "sm" : "sm"}
											square={false}
											className={`shadow-lg ${glowColor} ${index === 0 ? 'ring-2 ring-yellow-500/50' : index === 1 ? 'ring-2 ring-gray-400/50' : 'ring-2 ring-amber-700/50'}`}
										/>
										<div className={`absolute -top-1 -right-1 p-1 sm:p-1.5 rounded-full bg-gray-900 ${badgeColor} shadow-lg ${glowColor}`}>
											<BadgeIcon className={`${index === 0 ? 'w-3 h-3 sm:w-5 sm:h-5' : 'w-2.5 h-2.5 sm:w-4 sm:h-4'}`} />
										</div>
									</div>
									<div className="mt-1 sm:mt-2 text-center">
										<div className={`${index === 0 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} font-medium text-white`}>{resident.name.split(' ')[0]}</div>
										<div className={`${index === 0 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} font-bold ${badgeColor}`}>{totalWorkouts} workouts</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Day labels */}
					<div className="flex ml-14 sm:ml-16 flex-shrink-0">
						{dayLabels.map((day, index) => (
							<div
								key={index}
								className={cn(
									"flex-1 text-center text-[10px] sm:text-xs font-medium",
									index === 6 ? "text-blue-400" : "text-gray-400" // Highlight today's column
								)}
							>
								{day}
							</div>
						))}
					</div>

					{/* Workout Streak Display for All Participants */}
					<div className="space-y-2 overflow-y-auto flex-1">
						{sortedResidents.map((resident, index) => {
							const totalWorkouts = getWorkoutTotal(resident.workoutDays);
							const recentWorkouts = getRecentWorkoutDays(resident.workoutDays);

							return (
								<motion.div
									key={resident.id}
									className="p-2 sm:p-3 rounded-lg bg-gray-900/40 border border-gray-800 flex flex-col"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.2, delay: index * 0.06 }}
								>
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<ProfilePicture
												name={resident.name}
												imageUrl={resident.imagePath}
												size="sm"
												className="ring-1 ring-gray-700"
											/>
											<span className="font-medium text-sm">{resident.name}</span>
										</div>
										<div className="bg-blue-500/10 px-2 py-0.5 rounded text-xs font-medium text-blue-400">
											{totalWorkouts} workouts
										</div>
									</div>

									{/* Calendar streak display */}
									<div className="flex justify-between items-center">
										<div className="flex space-x-1 sm:space-x-[6px]">
											{recentWorkouts.map((day, i) => (
												<div
													key={i}
													className={cn(
														"w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-colors",
														day
															? "bg-blue-500 text-white shadow-glow-sm"
															: "bg-gray-800 text-gray-600"
													)}
												>
													{day ? "✓" : ""}
												</div>
											))}
										</div>

										{/* Day labels for desktop */}
										<div className="hidden md:flex space-x-[6px] text-[9px] mt-1 text-gray-500 max-w-[340px] overflow-hidden">
											{dayLabels.map((day, i) => (
												<div key={i} className="w-4 text-center">
													{i % 2 === 0 ? day.charAt(0) : ""}
												</div>
											))}
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Legend */}
					<div className="pt-1 sm:pt-2 mt-1 sm:mt-2 border-t border-gray-800 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
						<div className="flex items-center">
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-md bg-gradient-to-br from-green-500/30 to-green-500/10 border border-green-500/30 mr-1"></div>
							<span>Workout</span>
						</div>
						<div className="flex items-center">
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-md bg-gray-800/50 border border-gray-700/50 mr-1"></div>
							<span>No Workout</span>
						</div>
					</div>
				</div>
			)}
		</DashboardCard>
	);
} 