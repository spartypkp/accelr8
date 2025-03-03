import { ProfilePicture } from '@/components/ui/profile-picture';
import { Resident } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Award, Brain, Briefcase, Dumbbell, Github, Heart, Rocket, Star, Target } from 'lucide-react';

// Extend the Resident type with the stats we need
interface ResidentWithStats extends Resident {
	stats?: {
		workouts: boolean[];
		github_commits: number[];
	};
	custom_metrics?: {
		mrr?: number;
		[key: string]: any;
	};
	bio?: string;
	company?: string;
}

interface ResidentProfileProps {
	resident: ResidentWithStats;
	className?: string;
}

export function ResidentProfile({ resident, className }: ResidentProfileProps) {
	// Get most recent stats for display
	const workoutStats = resident.stats?.workouts?.slice(-7) || Array(7).fill(false);
	const workoutCount = workoutStats.filter(Boolean).length;

	const commitStats = resident.stats?.github_commits?.slice(-7) || Array(7).fill(0);
	const totalCommits = commitStats.reduce((sum: number, val: number) => sum + val, 0);

	// Custom resident stats (if available)
	const customStats = resident.customStats || [];

	// Generate a color based on resident name for personalization
	const generateResidentColor = (name: string) => {
		const colors = [
			'from-blue-500 to-cyan-400',
			'from-purple-500 to-pink-400',
			'from-emerald-500 to-green-400',
			'from-orange-500 to-amber-400',
			'from-rose-500 to-red-400',
			'from-indigo-500 to-blue-400',
		];

		// Use string hash to select a color
		const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	const gradientColor = generateResidentColor(resident.name);

	// Match icons to stat names
	const getStatIcon = (statName: string) => {
		const name = statName.toLowerCase();

		if (name.includes('bench') || name.includes('press') || name.includes('workout') || name.includes('exercise'))
			return <Dumbbell className="w-4 h-4" />;
		if (name.includes('sleep') || name.includes('mind') || name.includes('meditation'))
			return <Brain className="w-4 h-4" />;
		if (name.includes('heart') || name.includes('health') || name.includes('fitness'))
			return <Heart className="w-4 h-4" />;
		if (name.includes('goal') || name.includes('target'))
			return <Target className="w-4 h-4" />;
		if (name.includes('mile') || name.includes('running') || name.includes('marathon'))
			return <Rocket className="w-4 h-4" />;
		if (name.includes('commitment') || name.includes('score'))
			return <Star className="w-4 h-4" />;

		// Default
		return <Award className="w-4 h-4" />;
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className={cn(
				"h-full rounded-xl overflow-hidden bg-gray-900/80 backdrop-blur-sm",
				className
			)}
		>
			{/* Background gradient - reduced opacity */}
			<div className={cn(
				"absolute inset-0 bg-gradient-to-br opacity-5 z-0",
				gradientColor
			)} />

			{/* Main content container */}
			<div className="relative z-10 flex flex-col h-full p-3">
				{/* Profile header - top section */}
				<div className="flex flex-col items-center mb-4">
					{/* Profile picture with subtle border effect */}
					<motion.div
						className="relative mb-3"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						{/* Subtle glow effect */}
						<motion.div
							className={cn(
								"absolute -inset-2 rounded-full blur-md -z-10 opacity-30",
								gradientColor
							)}
							animate={{
								opacity: [0.2, 0.4, 0.2],
								scale: [0.96, 1.01, 0.96]
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>

						{/* Profile picture */}
						<ProfilePicture
							name={resident.name}
							imageUrl={resident.imagePath}
							size="xl"
							className="ring-1 ring-gray-700 ring-offset-1 ring-offset-gray-950 shadow-lg"
							showBorder
						/>
					</motion.div>

					{/* Name with understated gradient text */}
					<motion.h2
						className="text-xl font-bold text-white"
					>
						{resident.name}
						<div className={cn(
							"h-1 w-12 rounded-full mx-auto mt-1.5",
							"bg-gradient-to-r opacity-60",
							gradientColor
						)} />
					</motion.h2>

					{/* Company with icon */}
					{resident.company && (
						<div className="flex items-center mt-1 text-gray-300">
							<Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
							<span className="text-sm">{resident.company}</span>
						</div>
					)}

					{/* Bio with quote styling */}
					{resident.bio && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="mt-3 text-sm text-gray-300 text-center max-w-xs mx-auto"
						>
							<q className="italic text-gray-400">{resident.bio}</q>
						</motion.div>
					)}
				</div>

				{/* Divider */}
				<div className="h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent mb-3"></div>

				{/* Stats section */}
				<div className="flex-1 overflow-y-auto space-y-3 pr-1">
					<h3 className="text-sm font-semibold text-white/90 mb-2">Personal Stats</h3>

					{customStats.length > 0 ? (
						<div className="grid grid-cols-1 gap-3">
							{customStats.map((stat: any, idx: number) => {
								// Calculate percentage for the progress bar
								const percentage = stat.target
									? Math.min(Math.round((stat.value / stat.target) * 100), 100)
									: 0;

								const statIcon = getStatIcon(stat.name);

								return (
									<motion.div
										key={idx}
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, delay: idx * 0.05 }}
										className="bg-gray-900/80 rounded-lg p-3 border border-gray-800/60"
									>
										<div className="flex justify-between items-center mb-2">
											<div className="flex items-center">
												<div className="bg-gray-800 p-2 rounded-md mr-3 border border-gray-700/30">
													{statIcon}
												</div>
												<div>
													<h4 className="text-sm font-medium text-gray-200">{stat.name}</h4>
													<div className="flex items-baseline mt-0.5">
														<span className="text-base font-bold text-white">{stat.value.toLocaleString()}</span>
														{stat.unit &&
															<span className="text-xs text-gray-400 ml-1">
																{stat.unit}
															</span>
														}
														{stat.target &&
															<span className="text-xs text-gray-500 ml-2">
																of {stat.target.toLocaleString()}
															</span>
														}
													</div>
												</div>
											</div>
										</div>

										{/* Progress bar with more subtle styling */}
										{stat.target && (
											<div className="w-full bg-gray-800/90 rounded-full h-2 overflow-hidden mt-1">
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${percentage}%` }}
													transition={{ duration: 1, ease: "easeOut" }}
													className={cn(
														"h-full rounded-full",
														percentage >= 100
															? "bg-green-500/70"
															: percentage >= 80
																? "bg-blue-500/70"
																: percentage >= 50
																	? "bg-amber-500/70"
																	: "bg-orange-500/70"
													)}
												/>
											</div>
										)}
									</motion.div>
								);
							})}
						</div>
					) : (
						// Default stats when no custom stats are available
						<div className="space-y-3">
							{/* Workout Activity */}
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
								className="bg-gray-900/80 rounded-lg p-3 border border-gray-800/60"
							>
								<div className="flex items-center mb-2">
									<div className="p-2 bg-gray-800 rounded-md mr-3 border border-gray-700/30">
										<Dumbbell className="w-4 h-4 text-blue-400" />
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-200">Workout Activity</h4>
										<div className="text-base font-bold text-white">
											{workoutCount}/7 days
										</div>
									</div>
								</div>

								{/* Workout days indicator */}
								<div className="flex space-x-2 mt-2">
									{workoutStats.map((didWorkout, idx) => (
										<motion.div
											key={idx}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.2, delay: idx * 0.05 }}
											className={cn(
												"flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium",
												didWorkout
													? "bg-gray-800 text-blue-300 border border-blue-500/30"
													: "bg-gray-800/50 text-gray-500 border border-gray-800/60"
											)}
										>
											{["M", "T", "W", "T", "F", "S", "S"][idx]}
										</motion.div>
									))}
								</div>
							</motion.div>

							{/* GitHub Activity */}
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: 0.1 }}
								className="bg-gray-900/80 rounded-lg p-3 border border-gray-800/60"
							>
								<div className="flex items-center mb-2">
									<div className="p-2 bg-gray-800 rounded-md mr-3 border border-gray-700/30">
										<Github className="w-4 h-4 text-purple-400" />
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-200">GitHub Commits</h4>
										<div className="text-base font-bold text-white">
											{totalCommits} total
										</div>
									</div>
								</div>

								{/* Commit activity bars with more subtle styling */}
								<div className="flex items-end space-x-2 h-12 mt-2 bg-gray-800/80 rounded-lg p-2">
									{commitStats.map((commitCount, idx) => {
										// Calculate height percentage (max height of 100%)
										const maxCommitCount = Math.max(...commitStats, 3); // minimum 3 for scale
										const heightPercentage = (commitCount / maxCommitCount) * 100;

										return (
											<motion.div
												key={idx}
												initial={{ height: "5%" }}
												animate={{ height: `${Math.max(heightPercentage, 5)}%` }}
												transition={{ duration: 0.6, delay: idx * 0.05 }}
												className={cn(
													"flex-1 rounded-md flex items-center justify-center text-xs",
													commitCount > 0
														? "bg-purple-600/70 text-white"
														: "bg-gray-700/30"
												)}
											>
												{commitCount > 0 && (
													<span>{commitCount}</span>
												)}
											</motion.div>
										);
									})}
								</div>

								<div className="flex justify-between text-xs text-gray-500 mt-1">
									<span>7 days ago</span>
									<span>Today</span>
								</div>
							</motion.div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
} 