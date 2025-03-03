import { ProfilePicture } from '@/components/ui/profile-picture';
import { Resident } from '@/lib/data/mock-data';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Github, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardCard } from './dashboard-card';

// Extended resident interface with GitHub commit data
interface ResidentWithCommits extends Resident {
	commitDays: { date: string, count: number; }[];
	totalCommits?: number;
}

interface GitHubTrackerProps {
	residentStats: ResidentWithCommits[];
	className?: string;
	limit?: number;
}

export function GitHubTracker({
	residentStats,
	className,
	limit = 5  // Default to showing top 5 residents
}: GitHubTrackerProps) {
	// Calculate total commits for each resident (using full 30 days)
	const residentsWithTotals = residentStats.map((resident) => {
		const totalCommits = resident.commitDays.reduce((sum, day) => sum + day.count, 0);
		return {
			...resident,
			totalCommits
		};
	});

	// Sort by total commits and take top N
	const topResidents = [...residentsWithTotals]
		.sort((a, b) => (b.totalCommits || 0) - (a.totalCommits || 0))
		.slice(0, limit);

	// Get the last 14 days for display
	const recentCommitDays = topResidents.map(resident => {
		return {
			...resident,
			displayCommitDays: resident.commitDays.slice(resident.commitDays.length - 14)
		};
	});

	// Format data for chart display (using the last 14 days)
	const chartData = recentCommitDays[0]?.displayCommitDays.map((day, dayIndex) => {
		const data: Record<string, any> = {
			date: formatDate(day.date).substring(0, 6), // Shorter date format
		};

		// Add each resident's commit count for this day
		recentCommitDays.forEach((resident) => {
			data[resident.name] = resident.displayCommitDays[dayIndex].count;
		});

		return data;
	}) || [];

	// Define chart colors for different residents
	const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

	return (
		<DashboardCard
			title="14-Day GitHub Activity"
			titleIcon={<Github className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			{topResidents.length === 0 ? (
				<div className="text-center py-6 text-gray-500">No GitHub data available</div>
			) : (
				<div className="flex flex-col h-full">
					{/* Total commits leaderboard - Fixed height container */}
					<div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3 overflow-y-auto pr-1 flex-shrink-0 h-[100px] sm:h-[110px]">
						{topResidents.map((resident, index) => {
							// For visual effect, calculate commit intensity (percentage of max commits)
							const maxCommits = topResidents[0].totalCommits || 0;
							const commitPercentage = ((resident.totalCommits || 0) / maxCommits) * 100;
							const gradientColor = index === 0
								? "from-blue-600/20 to-purple-600/10"
								: index === 1
									? "from-cyan-600/20 to-blue-600/10"
									: "from-indigo-600/20 to-blue-600/10";

							return (
								<motion.div
									key={resident.id}
									className="flex items-center gap-2 sm:gap-3 bg-gray-900/40 rounded-lg p-1.5 sm:p-2 border border-gray-800 relative overflow-hidden"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.2, delay: index * 0.05 }}
								>
									{/* Background progress bar */}
									<div
										className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${gradientColor} z-0`}
										style={{ width: `${commitPercentage}%` }}
									/>

									{/* Position indicator */}
									<div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${index === 0 ? 'bg-blue-600/30 text-blue-300' : 'bg-gray-800 text-gray-300'} text-[10px] sm:text-xs font-bold z-10 shadow-md`}>
										{index + 1}
									</div>

									<div className="relative">
										<ProfilePicture
											name={resident.name}
											imageUrl={resident.imagePath}
											size="sm"
											className="z-10 shadow-md"
										/>
										{index === 0 && (
											<motion.div
												className="absolute -inset-0.5 rounded-full blur-sm -z-10 bg-blue-500/20"
												animate={{
													opacity: [0.4, 0.7, 0.4],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut"
												}}
											/>
										)}
									</div>

									<div className="flex-1 font-medium text-xs sm:text-sm z-10 truncate">{resident.name}</div>

									<div className="flex items-center">
										{index === 0 && (
											<div className="mr-1 sm:mr-2 px-1.5 sm:px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] sm:text-xs border border-yellow-500/20 flex items-center">
												<TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
												<span>Top</span>
											</div>
										)}
										<div className="bg-blue-500/10 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs border border-blue-500/20 z-10 whitespace-nowrap">
											{resident.totalCommits} commits
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Commits chart - Using flex-1 for consistent sizing */}
					<div className="flex-1 min-h-0 rounded-lg bg-gray-900/40 p-1 sm:p-2 border border-gray-800">
						<ResponsiveContainer width="100%" height="100%" debounce={1}>
							<BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 5 }} layout="horizontal">
								<CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 8, fill: '#888' }}
									tickLine={{ stroke: '#444' }}
									axisLine={{ stroke: '#444' }}
									height={20}
								/>
								<YAxis
									tick={{ fontSize: 8, fill: '#888' }}
									tickLine={{ stroke: '#444' }}
									axisLine={{ stroke: '#444' }}
									allowDecimals={false}
									width={20}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(17, 24, 39, 0.8)',
										backdropFilter: 'blur(8px)',
										border: '1px solid #333',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '10px',
										padding: '6px 10px'
									}}
									labelStyle={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '10px' }}
									formatter={(value: number, name: string) => {
										return [
											<div className="flex items-center gap-1 sm:gap-2">
												<span>{value} commits</span>
											</div>,
											<div className="flex items-center gap-1">
												<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{
													backgroundColor: colors[topResidents.findIndex(r => r.name === name) % colors.length]
												}}></div>
												<span>{name}</span>
											</div>
										];
									}}
								/>
								{topResidents.map((resident, index) => (
									<Bar
										key={resident.id}
										dataKey={resident.name}
										fill={colors[index % colors.length]}
										radius={[4, 4, 0, 0]}
										maxBarSize={30}
										isAnimationActive={false}
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