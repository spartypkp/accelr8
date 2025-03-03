import { getCommitStats, getWorkoutStats } from '@/lib/data/data-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Dumbbell, GitBranch, Trophy } from 'lucide-react';
import { GitHubTracker } from '../cards/github-tracker';
import { WorkoutTracker } from '../cards/workout-tracker';

export function CompetitiveStatsDashboard() {
	// Get data
	const workoutStats = getWorkoutStats(30);
	const limitedWorkoutStats = workoutStats.slice(0, 8); // Limit to 8 residents
	const commitStats = getCommitStats(30);

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
				<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
					<Trophy className="text-blue-400 h-4 w-4" />
				</div>
				<h1 className={cn(
					"text-3xl font-bold bg-clip-text text-transparent",
					"bg-gradient-to-r from-blue-500 to-purple-500"
				)}>
					Resident Competition
				</h1>
			</div>

			{/* Dashboard Content */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
				{/* Workout Tracker */}
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-3">
						<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
							<Dumbbell className="text-blue-400 h-4 w-4" />
						</div>
						<h2 className="text-lg font-semibold text-gray-200">7-Day Workout Tracker</h2>
					</div>
					<div className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 shadow-lg overflow-hidden">
						<WorkoutTracker
							residentStats={limitedWorkoutStats}
							className="h-full"
						/>
					</div>
				</div>

				{/* GitHub Tracker */}
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-3">
						<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center">
							<GitBranch className="text-blue-400 h-4 w-4" />
						</div>
						<h2 className="text-lg font-semibold text-gray-200">GitHub Commit Activity</h2>
					</div>
					<div className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 shadow-lg overflow-hidden">
						<GitHubTracker
							residentStats={commitStats}
							limit={8}
							className="h-full"
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
} 