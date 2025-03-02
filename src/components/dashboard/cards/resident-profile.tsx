import { ProfilePicture } from '@/components/ui/profile-picture';
import { Progress } from '@/components/ui/progress';
import { Resident } from '@/lib/data/mock-data';
import { cn, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Award, Brain, Briefcase, Dumbbell, Heart, Info, User } from 'lucide-react';

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

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.4 }}
			className={cn(
				"flex flex-col h-full rounded-xl border border-gray-800 overflow-hidden bg-gray-900/60 backdrop-blur-sm",
				className
			)}
		>
			{/* Header with profile information */}
			<div className="relative">
				{/* Background gradient */}
				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-br opacity-20 z-0",
						gradientColor
					)}
				/>

				{/* Profile information */}
				<div className="relative z-10 p-5">
					{/* Restructured layout to emphasize profile picture */}
					<div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
						{/* Large profile picture - now more prominent with glowing effect */}
						<motion.div
							className="flex-shrink-0 ring-2 ring-offset-4 ring-offset-gray-900 rounded-full p-1.5 shadow-lg shadow-blue-500/20 mb-4 sm:mb-0 relative"
							style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							{/* Pulsing glow effect behind the profile picture */}
							<motion.div
								className={cn(
									"absolute -inset-1 rounded-full blur-md -z-10",
									gradientColor
								)}
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
								size="lg"
								className="h-44 w-44 sm:h-48 sm:w-48"
								showBorder
							/>
						</motion.div>

						{/* Name, company and bio */}
						<div className="flex-1">
							<motion.h3
								className={cn(
									"text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
									gradientColor
								)}
							>
								{resident.name}
							</motion.h3>

							{resident.company && (
								<div className="flex items-center mt-1 text-sm text-gray-300">
									<Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
									<span>{resident.company}</span>
								</div>
							)}

							{resident.bio && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
									className="mt-3 text-sm text-gray-300 line-clamp-3"
								>
									<q className="italic text-gray-400">{resident.bio}</q>
								</motion.div>
							)}
						</div>
					</div>

					{/* Divider */}
					<div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-4"></div>
				</div>
			</div>

			{/* Stats section */}
			<div className="flex-1 p-4 overflow-y-auto">
				<div className="flex items-center mb-3">
					<div className="mr-2 p-1 rounded-md bg-blue-500/10">
						<Info className="h-4 w-4 text-blue-400" />
					</div>
					<h3 className="font-medium text-gray-200">Personal Goals & Metrics</h3>
				</div>

				{/* Custom stats */}
				{customStats.length > 0 ? (
					<div className="space-y-3">
						{customStats.map((stat: any, idx: number) => {
							// Calculate percentage for the progress bar
							const percentage = stat.target
								? Math.min(Math.round((stat.value / stat.target) * 100), 100)
								: 0;

							// Determine icon based on stat name
							let Icon = Award;
							if (stat.name.toLowerCase().includes('sleep')) Icon = Brain;
							else if (stat.name.toLowerCase().includes('weight')) Icon = Dumbbell;
							else if (stat.name.toLowerCase().includes('heart')) Icon = Heart;
							else if (stat.name.toLowerCase().includes('follow')) Icon = User;

							return (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: idx * 0.1 }}
									className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30"
									whileHover={{
										backgroundColor: 'rgba(31, 41, 55, 0.7)',
										transition: { duration: 0.2 }
									}}
								>
									<div className="flex justify-between items-center mb-2">
										<div className="flex items-center">
											<div className="p-1.5 rounded-md bg-gray-700/50 mr-2">
												<Icon className="w-4 h-4 text-blue-400" />
											</div>
											<div>
												<div className="font-medium text-sm text-gray-200">{stat.name}</div>
												{stat.description && (
													<div className="text-xs text-gray-400 mt-0.5">{stat.description}</div>
												)}
											</div>
										</div>
										<div className="text-right">
											<div className="text-lg font-bold text-gray-200">
												{formatNumber(stat.value)}
												<span className="text-xs text-gray-400 ml-1">{stat.unit}</span>
											</div>
											{stat.target && (
												<div className="text-xs text-gray-400">
													Goal: {formatNumber(stat.target)} {stat.unit}
												</div>
											)}
										</div>
									</div>

									{/* Progress bar if target exists */}
									{stat.target && (
										<div className="mt-2">
											<div className="flex justify-between text-xs mb-1">
												<span className="text-gray-400">{percentage}% complete</span>
												<span className="text-gray-500">{formatNumber(stat.value)} / {formatNumber(stat.target)}</span>
											</div>
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: '100%' }}
												transition={{ delay: 0.3, duration: 0.5 }}
											>
												<Progress value={percentage} className="h-1.5" />
											</motion.div>
										</div>
									)}
								</motion.div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
						<User className="h-8 w-8 mb-2 opacity-20" />
						<p>No personal metrics available</p>
						<p className="text-sm">This resident hasn't set any goals yet</p>
					</div>
				)}
			</div>
		</motion.div>
	);
} 