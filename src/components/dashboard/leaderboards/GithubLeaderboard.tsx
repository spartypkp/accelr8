import { Resident } from '@/lib/data/mock-data';
import { formatDate } from '@/lib/utils';
import { Github } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Leaderboard, LeaderboardParticipant } from './Leaderboard';

// Extended resident interface with GitHub commit data
interface ResidentWithCommits extends Resident {
	commitDays: { date: string, count: number; }[];
}

interface GitHubLeaderboardProps {
	residentStats: ResidentWithCommits[];
	className?: string;
	limit?: number;
}

export function GitHubLeaderboard({
	residentStats,
	className,
	limit = 12
}: GitHubLeaderboardProps) {
	// Transform resident data to leaderboard format
	const leaderboardParticipants = useMemo(() => {
		return residentStats.map(resident => {
			const totalCommits = resident.commitDays.reduce((sum, day) => sum + day.count, 0);

			return {
				id: resident.id,
				name: resident.name,
				imagePath: resident.imagePath,
				score: totalCommits,
				additionalData: {
					commitDays: resident.commitDays
				}
			};
		});
	}, [residentStats]);

	// Prepare chart data based on the top participants
	const renderDetail = (participants: LeaderboardParticipant[]) => {
		if (participants.length === 0) return null;

		// Format data for chart display - assume all residents have same dates
		const firstResident = residentStats.find(r => r.id === participants[0].id);
		if (!firstResident) return null;

		const chartData = firstResident.commitDays.map((day, dayIndex) => {
			const data: Record<string, any> = {
				date: formatDate(day.date).substring(0, 6), // Shorter date format
			};

			// Add commit count for top 5 residents (or fewer if there aren't 5)
			participants.slice(0, 5).forEach(participant => {
				const resident = residentStats.find(r => r.id === participant.id);
				if (resident) {
					data[resident.name] = resident.commitDays[dayIndex].count;
				}
			});

			return data;
		});

		// Define chart colors for different residents
		const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

		return (
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
										backgroundColor: colors[participants.findIndex(p => p.name === name) % colors.length]
									}}></div>
									<span>{name}</span>
								</div>
							];
						}}
					/>
					{participants.slice(0, 5).map((participant, index) => (
						<Bar
							key={participant.id}
							dataKey={participant.name}
							fill={colors[index % colors.length]}
							radius={[4, 4, 0, 0]}
							maxBarSize={30}
							isAnimationActive={false}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		);
	};

	return (
		<Leaderboard
			title="GitHub Commit Leaderboard"
			titleIcon={<Github className="w-4 h-4 text-blue-400" />}
			participants={leaderboardParticipants}
			className={className}
			limit={limit}
			renderDetail={renderDetail}
			scoreUnit="commits"
		/>
	);
} 