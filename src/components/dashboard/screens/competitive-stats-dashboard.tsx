import { getCommitStats, getWorkoutStats } from '@/lib/data/data-utils';
import { GitHubTracker } from '../cards/github-tracker';
import { WorkoutTracker } from '../cards/workout-tracker';

export function CompetitiveStatsDashboard() {
	// Get data
	const workoutStats = getWorkoutStats(7);
	const limitedWorkoutStats = workoutStats.slice(0, 8); // Limit to 8 residents
	const commitStats = getCommitStats(7);

	return (
		<div className="flex flex-col h-full w-full p-6 overflow-hidden">
			<h2 className="text-2xl font-bold text-white mb-4">Competitive Stats Dashboard</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 h-[calc(100%-3rem)] overflow-hidden">
				<WorkoutTracker residentStats={limitedWorkoutStats} className="overflow-hidden max-h-full" />
				<GitHubTracker residentStats={commitStats} limit={5} className="overflow-hidden max-h-full" />
			</div>
		</div>
	);
} 