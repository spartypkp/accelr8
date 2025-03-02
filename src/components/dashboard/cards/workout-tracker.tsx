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
	// Generate labels for the last 7 days
	// Use useMemo to calculate the days once
	const { dayLabels, sortedResidents } = useMemo(() => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		// Use a fixed date for server-rendering to avoid hydration mismatches
		// In a production app, you would get this from the API
		const fixedToday = 3; // Represents Wednesday (0 = Sunday, 1 = Monday, etc.)

		const labels = Array(7).fill(0).map((_, i) => {
			// Calculate what day of the week each of the last 7 days was
			// Starting with the oldest day first
			const dayIndex = (fixedToday - 6 + i + 7) % 7; // Ensure positive index
			return days[dayIndex];
		});

		// Sort residents by number of workouts
		const sorted = [...residentStats].sort((a, b) => {
			const aTotal = a.workoutDays.reduce((sum, day) => sum + day, 0);
			const bTotal = b.workoutDays.reduce((sum, day) => sum + day, 0);
			return bTotal - aTotal;
		});

		return { dayLabels: labels, sortedResidents: sorted };
	}, [residentStats]);

	// Get total workouts for each resident
	const getWorkoutTotal = (workoutDays: number[]) => {
		return workoutDays.reduce((sum, day) => sum + day, 0);
	};

	return (
		<DashboardCard
			title="7-Day Workout Tracker"
			titleIcon={<Dumbbell className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			{sortedResidents.length === 0 ? (
				<div className="text-center py-6 text-gray-500">No workout data available</div>
			) : (
				<div className="space-y-4 overflow-y-auto h-full pr-1">
					{/* Top 3 Athletes */}
					<div className="flex justify-center gap-4 mb-2 p-3 bg-gray-900/40 rounded-lg border border-gray-800">
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
									transition={{ duration: 0.3, delay: index * 0.2 }}
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
											size={index === 0 ? "lg" : "md"}
											square={false}
											className={`shadow-lg ${glowColor} ${index === 0 ? 'ring-2 ring-yellow-500/50' : index === 1 ? 'ring-2 ring-gray-400/50' : 'ring-2 ring-amber-700/50'}`}
										/>
										<div className={`absolute -top-1 -right-1 p-1.5 rounded-full bg-gray-900 ${badgeColor} shadow-lg ${glowColor}`}>
											<BadgeIcon className={`${index === 0 ? 'w-5 h-5' : 'w-4 h-4'}`} />
										</div>
									</div>
									<div className="mt-2 text-center">
										<div className={`${index === 0 ? 'text-sm' : 'text-xs'} font-medium text-white`}>{resident.name.split(' ')[0]}</div>
										<div className={`${index === 0 ? 'text-sm' : 'text-xs'} font-bold ${badgeColor}`}>{totalWorkouts} workouts</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Day labels */}
					<div className="flex ml-16">
						{dayLabels.map((day, index) => (
							<div
								key={index}
								className={cn(
									"flex-1 text-center text-xs font-medium",
									index === 6 ? "text-blue-400" : "text-gray-400" // Highlight today's column
								)}
							>
								{day}
							</div>
						))}
					</div>

					{/* Residents and their workout days */}
					<div className="space-y-3">
						{sortedResidents.map((resident, resIndex) => (
							<motion.div
								key={resident.id}
								className="flex items-center bg-gray-900/30 rounded-lg p-2 border border-gray-800/50"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.5 + (resIndex * 0.05) }}
							>
								<div className="w-16 flex items-center gap-2">
									<ProfilePicture
										name={resident.name}
										imageUrl={resident.imagePath}
										size="sm"
										className="flex-shrink-0 shadow-md"
									/>
								</div>
								<div className="flex-1 flex items-center gap-0.5">
									{resident.workoutDays.map((worked, index) => (
										<div key={index} className="flex-1 flex justify-center">
											<motion.div
												whileHover={{ scale: 1.1 }}
												className={cn(
													"w-7 h-7 rounded-md flex items-center justify-center text-xs",
													worked
														? "bg-gradient-to-br from-green-500/30 to-green-500/10 text-green-400 border border-green-500/30"
														: "bg-gray-800/50 text-gray-500 border border-gray-700/50"
												)}
											>
												{worked ? "✓" : ""}
											</motion.div>
										</div>
									))}
								</div>
								{/* Total workouts */}
								<div className="ml-2 px-2 py-0.5 bg-gray-900/60 rounded-full text-xs text-gray-300">
									{getWorkoutTotal(resident.workoutDays)}/{resident.workoutDays.length}
								</div>
							</motion.div>
						))}
					</div>

					{/* Legend */}
					<div className="pt-2 mt-2 border-t border-gray-800 flex items-center justify-center gap-3 text-xs text-gray-400">
						<div className="flex items-center">
							<div className="w-3 h-3 rounded-md bg-gradient-to-br from-green-500/30 to-green-500/10 border border-green-500/30 mr-1"></div>
							<span>Workout</span>
						</div>
						<div className="flex items-center">
							<div className="w-3 h-3 rounded-md bg-gray-800/50 border border-gray-700/50 mr-1"></div>
							<span>No Workout</span>
						</div>
					</div>
				</div>
			)}
		</DashboardCard>
	);
} 