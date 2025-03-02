import { ProfilePicture } from '@/components/ui/profile-picture';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Github, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardCard } from './dashboard-card';

interface GitHubTrackerProps {
	residentStats: {
		residentId: string,
		residentName: string,
		commitDays: { date: string, count: number; }[];
	}[];
	className?: string;
	limit?: number;
}

export function GitHubTracker({
	residentStats,
	className,
	limit = 5  // Default to showing top 5 residents
}: GitHubTrackerProps) {
	// Calculate total commits for each resident
	const residentsWithTotals = residentStats.map((resident) => {
		const totalCommits = resident.commitDays.reduce((sum, day) => sum + day.count, 0);
		return {
			...resident,
			totalCommits
		};
	});

	// Sort by total commits and take top N
	const topResidents = [...residentsWithTotals]
		.sort((a, b) => b.totalCommits - a.totalCommits)
		.slice(0, limit);

	// Format data for chart display
	const chartData = topResidents[0]?.commitDays.map((day, dayIndex) => {
		const data: Record<string, any> = {
			date: formatDate(day.date).substring(0, 6), // Shorter date format
		};

		// Add each resident's commit count for this day
		topResidents.forEach((resident) => {
			data[resident.residentName] = resident.commitDays[dayIndex].count;
		});

		return data;
	});

	// Define chart colors for different residents
	const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

	return (
		<DashboardCard
			title="GitHub Commit Leaderboard"
			titleIcon={<Github className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			{topResidents.length === 0 ? (
				<div className="text-center py-6 text-gray-500">No GitHub data available</div>
			) : (
				<div className="flex flex-col h-full">
					{/* Total commits leaderboard */}
					<div className="space-y-3 mb-4 overflow-y-auto pr-1 flex-shrink-0">
						{topResidents.map((resident, index) => {
							// For visual effect, calculate commit intensity (percentage of max commits)
							const maxCommits = topResidents[0].totalCommits;
							const commitPercentage = (resident.totalCommits / maxCommits) * 100;

							return (
								<motion.div
									key={resident.residentId}
									className="flex items-center gap-3 bg-gray-900/40 rounded-lg p-2 border border-gray-800 relative overflow-hidden"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									{/* Background progress bar */}
									<div
										className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600/10 to-purple-600/5 z-0"
										style={{ width: `${commitPercentage}%` }}
									/>

									{/* Position indicator */}
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-bold z-10">
										{index + 1}
									</div>

									<ProfilePicture
										name={resident.residentName}
										size="sm"
										className="z-10"
									/>

									<div className="flex-1 font-medium text-sm z-10">{resident.residentName}</div>

									<div className="flex items-center">
										{index === 0 && (
											<div className="mr-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/20 flex items-center">
												<TrendingUp className="w-3 h-3 mr-1" />
												<span>Top</span>
											</div>
										)}
										<div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/20 z-10">
											{resident.totalCommits} commits
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Commits chart */}
					<div className="flex-1 min-h-0 rounded-lg bg-gray-900/40 p-2 border border-gray-800">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 10, fill: '#888' }}
									tickLine={{ stroke: '#444' }}
									axisLine={{ stroke: '#444' }}
								/>
								<YAxis
									tick={{ fontSize: 10, fill: '#888' }}
									tickLine={{ stroke: '#444' }}
									axisLine={{ stroke: '#444' }}
									allowDecimals={false}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(17, 24, 39, 0.8)',
										backdropFilter: 'blur(8px)',
										border: '1px solid #333',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '11px',
										padding: '8px 12px'
									}}
									labelStyle={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}
									formatter={(value: number, name: string) => {
										return [
											<div className="flex items-center gap-2">
												<span>{value} commits</span>
											</div>,
											<div className="flex items-center gap-1">
												<div className="w-3 h-3 rounded-full" style={{
													backgroundColor: colors[topResidents.findIndex(r => r.residentName === name) % colors.length]
												}}></div>
												<span>{name}</span>
											</div>
										];
									}}
								/>
								{topResidents.map((resident, index) => (
									<Bar
										key={resident.residentId}
										dataKey={resident.residentName}
										fill={colors[index % colors.length]}
										radius={[4, 4, 0, 0]}
										maxBarSize={35}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</DashboardCard>
	);
} 