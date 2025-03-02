import { HouseStat } from '@/lib/data/mock-data';
import { cn, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
	Award,
	Beer,
	Coffee,
	DollarSign,
	Moon,
	Pizza,
	TrendingUp,
	Users
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { DashboardCard } from './dashboard-card';

interface HouseHighlightStatsProps {
	stats: HouseStat[];
	className?: string;
}

export function HouseHighlightStats({ stats, className }: HouseHighlightStatsProps) {
	// Get icon and color for a stat
	const getStatVisuals = (statName: string) => {
		const iconMap: Record<string, { icon: React.ReactNode; color: string; }> = {
			'Total Social Media Followers': { icon: <Users className="w-5 h-5" />, color: '#3B82F6' },
			'House MRR': { icon: <DollarSign className="w-5 h-5" />, color: '#10B981' },
			'Beers Consumed (Month)': { icon: <Beer className="w-5 h-5" />, color: '#F59E0B' },
			'Pizza Ordered (Month)': { icon: <Pizza className="w-5 h-5" />, color: '#EF4444' },
			'Coffee Brewed (Week)': { icon: <Coffee className="w-5 h-5" />, color: '#8B5CF6' },
			'Avg. Sleep Score': { icon: <Moon className="w-5 h-5" />, color: '#EC4899' }
		};

		return iconMap[statName] || { icon: <Award className="w-5 h-5" />, color: '#3B82F6' };
	};

	// Calculate visual stats
	const getVisualMetrics = (stat: HouseStat) => {
		const percentage = stat.previousValue
			? ((stat.value - stat.previousValue) / stat.previousValue) * 100
			: 0;

		const isPositive = percentage >= 0;

		// For percentage stats like sleep score, use the value directly
		const circlePercentage = stat.name.includes('Score')
			? stat.value
			: isPositive ? Math.min(Math.abs(percentage), 100) : 0;

		return { percentage, isPositive, circlePercentage };
	};

	return (
		<DashboardCard
			title="House Highlight Metrics"
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="space-y-6 overflow-y-auto h-full pr-1">
				{stats.map((stat, index) => {
					const { icon, color } = getStatVisuals(stat.name);
					const { percentage, isPositive, circlePercentage } = getVisualMetrics(stat);

					return (
						<motion.div
							key={stat.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
							className="bg-gray-900/40 rounded-lg border border-gray-800 overflow-hidden"
						>
							{/* Header */}
							<div className="p-4 border-b border-gray-800 flex justify-between items-center">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
										<div style={{ color }}>{icon}</div>
									</div>
									<div className="font-medium">{stat.name}</div>
								</div>
								{stat.previousValue && (
									<div className={cn(
										"flex items-center gap-1 text-xs px-2 py-1 rounded-full",
										isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
									)}>
										{isPositive ? <TrendingUp className="w-3 h-3" /> : null}
										<span>{isPositive ? '+' : ''}{percentage.toFixed(1)}%</span>
									</div>
								)}
							</div>

							{/* Main content */}
							<div className="p-4">
								<div className="flex items-center justify-between">
									{/* Value side */}
									<div className="flex-1">
										<div className="text-3xl font-bold" style={{ color }}>
											{formatNumber(stat.value)}
											<span className="text-sm text-gray-400 ml-1">{stat.unit}</span>
										</div>

										{stat.previousValue && (
											<div className="mt-1 text-sm text-gray-400">
												Previous: {formatNumber(stat.previousValue)} {stat.unit}
											</div>
										)}

										{/* Custom visualization based on stat type */}
										{renderCustomVisualization(stat)}
									</div>

									{/* Circle progress */}
									<div className="w-20 h-20">
										<CircularProgressbar
											value={circlePercentage}
											text={stat.name.includes('Score') ? `${stat.value}%` : `${isPositive ? '+' : ''}${percentage.toFixed(0)}%`}
											strokeWidth={10}
											styles={buildStyles({
												strokeLinecap: 'round',
												textSize: '16px',
												pathColor: color,
												textColor: color,
												trailColor: '#374151',
											})}
										/>
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</DashboardCard>
	);
}

// Custom visualization based on stat type
function renderCustomVisualization(stat: HouseStat) {
	// Beers visualization
	if (stat.name.includes('Beers')) {
		const beers = Math.min(stat.value, 20); // Cap for visual display
		return (
			<div className="mt-3 flex items-end h-10">
				{Array.from({ length: beers }).map((_, i) => {
					// Use deterministic height based on index instead of random
					const heightPercent = 20 + ((i % 5) * 5);
					return (
						<motion.div
							key={i}
							initial={{ height: 0 }}
							animate={{ height: `${heightPercent}px` }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
							className="w-2 mx-0.5 bg-amber-500 rounded-t-sm"
						/>
					);
				})}
			</div>
		);
	}

	// Coffee visualization
	if (stat.name.includes('Coffee')) {
		// Define deterministic day values
		const dayValues = [
			Math.floor(stat.value / 7),
			Math.floor(stat.value / 7) + 1,
			Math.floor(stat.value / 7) - 1,
			Math.floor(stat.value / 7) + 2,
			Math.floor(stat.value / 7),
			Math.floor(stat.value / 7) - 1,
			Math.floor(stat.value / 7) + 1
		];

		return (
			<div className="mt-3 grid grid-cols-7 gap-1">
				{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
					return (
						<div key={day} className="text-center">
							<div className="text-xs text-gray-500">{day}</div>
							<motion.div
								initial={{ height: 0 }}
								animate={{ height: `${dayValues[i] * 3}px` }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								className="w-full bg-purple-500 rounded-t-sm mx-auto"
							/>
							<div className="text-xs mt-1">{dayValues[i]}</div>
						</div>
					);
				})}
			</div>
		);
	}

	// Pizza visualization
	if (stat.name.includes('Pizza')) {
		const slices = 8; // A pizza has 8 slices
		const pizzas = stat.value;
		const totalSlices = pizzas * slices;
		const eatenSlices = Math.round(totalSlices * 0.9); // 90% eaten

		return (
			<div className="mt-3">
				<div className="flex items-center justify-between text-xs text-gray-400 mb-1">
					<span>Slices Eaten</span>
					<span>{eatenSlices} / {totalSlices}</span>
				</div>
				<div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${(eatenSlices / totalSlices) * 100}%` }}
						transition={{ duration: 0.8 }}
						className="h-full bg-red-500 rounded-full"
					/>
				</div>
			</div>
		);
	}

	// Sleep score visualization
	if (stat.name.includes('Sleep')) {
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		// Define deterministic sleep scores based on day index
		const baseSleepScore = stat.value;
		const variations = [-5, 7, -3, 4, -2, 8, -1];
		const scores = days.map((_, i) =>
			Math.max(50, Math.min(95, baseSleepScore + variations[i]))
		);

		return (
			<div className="mt-3">
				<div className="flex justify-between items-end">
					{scores.map((score, i) => (
						<div key={i} className="flex flex-col items-center">
							<motion.div
								initial={{ height: 0 }}
								animate={{ height: `${score / 2}px` }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								className="w-3 rounded-t-sm"
								style={{ backgroundColor: score > 80 ? '#10B981' : score > 70 ? '#FBBF24' : '#EF4444' }}
							/>
							<div className="text-xs mt-1">{Math.round(score)}</div>
							<div className="text-[10px] text-gray-500">{days[i]}</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return null; // Default case
} 