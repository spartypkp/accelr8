import { ProfilePicture } from '@/components/ui/profile-picture';
import { Resident } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Dumbbell, Medal, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { Leaderboard, LeaderboardParticipant } from './Leaderboard';

// Extended resident interface with workout data
interface ResidentWithWorkouts extends Resident {
	workoutDays: number[];
}

interface WorkoutLeaderboardProps {
	residentStats: ResidentWithWorkouts[];
	className?: string;
	limit?: number;
}

export function WorkoutLeaderboard({ residentStats, className, limit = 12 }: WorkoutLeaderboardProps) {
	// Generate labels for the last 7 days and transform data for the leaderboard
	const { dayLabels, leaderboardParticipants } = useMemo(() => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		// Use a fixed date for server-rendering to avoid hydration mismatches
		const fixedToday = 3; // Represents Wednesday (0 = Sunday, 1 = Monday, etc.)

		const labels = Array(7).fill(0).map((_, i) => {
			// Calculate what day of the week each of the last 7 days was
			// Starting with the oldest day first
			const dayIndex = (fixedToday - 6 + i + 7) % 7; // Ensure positive index
			return days[dayIndex];
		});

		// Transform residents data into leaderboard participants
		const participants: LeaderboardParticipant[] = residentStats.map(resident => {
			const totalWorkouts = resident.workoutDays.reduce((sum, day) => sum + day, 0);

			return {
				id: resident.id,
				name: resident.name,
				imagePath: resident.imagePath,
				score: totalWorkouts,
				additionalData: {
					workoutDays: resident.workoutDays
				}
			};
		});

		return { dayLabels: labels, leaderboardParticipants: participants };
	}, [residentStats]);

	// Render workout day indicators for each participant
	const renderParticipantRow = (participant: LeaderboardParticipant, index: number, maxScore: number) => {
		const workoutDays = participant.additionalData?.workoutDays as number[] || [];
		// Calculate score percentage for the progress bar
		const scorePercentage = maxScore > 0 ? (participant.score / maxScore) * 100 : 0;

		// Different styling based on position
		const gradientColor = index === 0
			? "from-blue-600/20 to-purple-600/10"
			: index === 1
				? "from-cyan-600/20 to-blue-600/10"
				: index === 2
					? "from-indigo-600/20 to-blue-600/10"
					: "from-gray-700/20 to-gray-800/10";

		return (
			<motion.div
				key={participant.id}
				className="flex items-center bg-gray-900/30 rounded-lg p-1.5 sm:p-2 border border-gray-800/50 relative overflow-hidden"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
			>
				{/* Background progress bar */}
				<div
					className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${gradientColor} z-0`}
					style={{ width: `${scorePercentage}%` }}
				/>

				{/* Position indicator */}
				<div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-2 ${index === 0 ? 'bg-blue-600/30 text-blue-300' :
					index === 1 ? 'bg-cyan-600/30 text-cyan-300' :
						index === 2 ? 'bg-indigo-600/30 text-indigo-300' :
							'bg-gray-800 text-gray-300'
					} text-[10px] sm:text-xs font-bold z-10 shadow-md`}>
					{index + 1}
				</div>

				<div className="w-8 sm:w-10 flex-shrink-0 z-10">
					<ProfilePicture
						name={participant.name}
						imageUrl={participant.imagePath}
						size="sm"
						className="shadow-md"
					/>
				</div>

				<div className="ml-2 flex-shrink-0 font-medium text-xs sm:text-sm text-gray-200 z-10 truncate w-16 sm:w-20">
					{participant.name.split(' ')[0]}
				</div>

				<div className="flex-1 flex items-center gap-1 z-10">
					{workoutDays.map((worked, dayIndex) => (
						<div key={dayIndex} className="flex-1 flex justify-center">
							<motion.div
								whileHover={{ scale: 1.1 }}
								className={cn(
									"w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] sm:text-xs",
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
				<div className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-gray-900/60 rounded-full text-[10px] sm:text-xs text-gray-300 z-10 flex-shrink-0">
					{participant.score}/{workoutDays.length}
				</div>
			</motion.div>
		);
	};

	// Render podium for top 3 performers
	const renderPodium = (topParticipants: LeaderboardParticipant[]) => {
		return (
			<div className="flex justify-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-900/40 rounded-lg border border-gray-800 h-[80px] sm:h-[90px]">
				{topParticipants.map((participant, index) => {
					const BadgeIcon = index === 0 ? Trophy : Medal;
					const badgeColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600';
					const glowColor = index === 0 ? 'shadow-yellow-500/30' : index === 1 ? 'shadow-gray-400/30' : 'shadow-amber-700/30';

					return (
						<motion.div
							key={participant.id}
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
									name={participant.name}
									imageUrl={participant.imagePath}
									size={index === 0 ? "sm" : "sm"}
									square={false}
									className={`shadow-lg ${glowColor} ${index === 0 ? 'ring-2 ring-yellow-500/50' : index === 1 ? 'ring-2 ring-gray-400/50' : 'ring-2 ring-amber-700/50'}`}
								/>
								<div className={`absolute -top-1 -right-1 p-1 sm:p-1.5 rounded-full bg-gray-900 ${badgeColor} shadow-lg ${glowColor}`}>
									<BadgeIcon className={`${index === 0 ? 'w-3 h-3 sm:w-5 sm:h-5' : 'w-2.5 h-2.5 sm:w-4 sm:h-4'}`} />
								</div>
							</div>
							<div className="mt-1 sm:mt-2 text-center">
								<div className={`${index === 0 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} font-medium text-white`}>{participant.name.split(' ')[0]}</div>
								<div className={`${index === 0 ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} font-bold ${badgeColor}`}>{participant.score} workouts</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		);
	};

	// Render legend for the workout indicators
	const renderDetail = () => {
		return (
			<div className="h-full flex flex-col">
				{/* Day labels */}
				<div className="flex ml-[5.5rem] sm:ml-24 flex-shrink-0 mb-2">
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

				{/* Legend */}
				<div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 flex-shrink-0 mt-auto pt-1">
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
		);
	};

	return (
		<Leaderboard
			title="7-Day Workout Leaderboard"
			titleIcon={<Dumbbell className="w-4 h-4 text-blue-400" />}
			participants={leaderboardParticipants}
			className={className}
			limit={limit}
			renderPodium={renderPodium}
			renderParticipantRow={renderParticipantRow}
			renderDetail={renderDetail}
			scoreUnit="workouts"
		/>
	);
} 