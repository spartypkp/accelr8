import { HouseStat } from '@/lib/data/mock-data';
import { cn, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AreaChart, BarChart as BarChartIcon, LineChart, PieChart } from 'lucide-react';
import { useState } from 'react';
import {
	Area,
	Bar,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	Pie,
	AreaChart as RechartsAreaChart,
	BarChart as RechartsBarChart,
	LineChart as RechartsLineChart,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';
import { DashboardCard } from './dashboard-card';

interface HouseMetricChartsProps {
	stats: HouseStat[];
	className?: string;
}

type ChartType = 'area' | 'bar' | 'line' | 'pie';

export function HouseMetricCharts({ stats, className }: HouseMetricChartsProps) {
	const [selectedStat, setSelectedStat] = useState<HouseStat>(stats[0]);
	const [chartType, setChartType] = useState<ChartType>('area');

	// Generate mock historical data for the selected stat
	const generateHistoricalData = (stat: HouseStat) => {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
		const currentValue = stat.value;
		const previousValue = stat.previousValue || currentValue * 0.9;

		// Create a trend that ends at the current value
		const step = (currentValue - previousValue) / (months.length - 1);

		return months.map((month, index) => {
			const baseValue = previousValue + (step * index);
			// Add some randomness to make the chart more interesting
			const randomFactor = 0.9 + (Math.random() * 0.2);
			const value = index === months.length - 1 ? currentValue : Math.round(baseValue * randomFactor);

			return {
				name: month,
				value: value,
			};
		});
	};

	// Generate mock comparison data between stats
	const generateComparisonData = () => {
		return stats.map(stat => ({
			name: stat.name.split(' ')[0], // Get just the first word for brevity
			value: stat.value,
			fill: getColorForStat(stat.name),
		}));
	};

	// Colors for different stats
	const getColorForStat = (statName: string) => {
		const colorMap: Record<string, string> = {
			'Total Social Media Followers': '#3B82F6', // blue
			'House MRR': '#10B981', // green
			'Beers Consumed (Month)': '#F59E0B', // amber
			'Pizza Ordered (Month)': '#EF4444', // red
			'Coffee Brewed (Week)': '#8B5CF6', // purple
			'Avg. Sleep Score': '#EC4899', // pink
		};

		return colorMap[statName] || '#3B82F6';
	};

	// Historical data for the selected stat
	const historicalData = generateHistoricalData(selectedStat);

	// Comparison data for all stats
	const comparisonData = generateComparisonData();

	// Chart type buttons
	const chartTypeButtons = [
		{ type: 'area', icon: <AreaChart className="w-4 h-4" /> },
		{ type: 'bar', icon: <BarChartIcon className="w-4 h-4" /> },
		{ type: 'line', icon: <LineChart className="w-4 h-4" /> },
		{ type: 'pie', icon: <PieChart className="w-4 h-4" /> },
	];

	return (
		<DashboardCard
			title="House Metrics Visualization"
			className={cn("h-full flex flex-col", className)}
			contentClassName="flex-1 overflow-hidden flex flex-col"
		>
			{/* Stat Selection Pills */}
			<div className="flex flex-wrap gap-2 mb-4">
				{stats.map((stat) => (
					<button
						key={stat.name}
						onClick={() => setSelectedStat(stat)}
						className={cn(
							"px-2 py-1 text-xs rounded-full transition-all",
							selectedStat.name === stat.name
								? "bg-blue-500 text-white"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						)}
					>
						{stat.name.split(' ')[0]}
					</button>
				))}
			</div>

			{/* Chart Type Selection */}
			<div className="flex gap-2 mb-4">
				{chartTypeButtons.map((button) => (
					<button
						key={button.type}
						onClick={() => setChartType(button.type as ChartType)}
						className={cn(
							"p-2 rounded-md transition-all",
							chartType === button.type
								? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
								: "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
						)}
					>
						{button.icon}
					</button>
				))}
			</div>

			{/* Selected Stat Info */}
			<motion.div
				key={selectedStat.name}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
			>
				<div className="text-lg font-bold">{selectedStat.name}</div>
				<div className="text-2xl font-bold text-blue-400">
					{formatNumber(selectedStat.value)} {selectedStat.unit}
				</div>
			</motion.div>

			{/* Chart Area */}
			<div className="flex-1 min-h-0 bg-gray-900/40 rounded-lg p-3 border border-gray-800">
				<ResponsiveContainer width="100%" height="100%">
					{(() => {
						switch (chartType) {
							case 'area':
								return (
									<RechartsAreaChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
										<defs>
											<linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor={getColorForStat(selectedStat.name)} stopOpacity={0.8} />
												<stop offset="95%" stopColor={getColorForStat(selectedStat.name)} stopOpacity={0.1} />
											</linearGradient>
										</defs>
										<CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
										<YAxis tick={{ fill: '#888', fontSize: 12 }} />
										<Tooltip
											contentStyle={{
												backgroundColor: 'rgba(17, 24, 39, 0.8)',
												backdropFilter: 'blur(8px)',
												border: '1px solid #333',
												borderRadius: '8px'
											}}
											formatter={(value) => [`${formatNumber(value as number)} ${selectedStat.unit}`]}
										/>
										<Area
											type="monotone"
											dataKey="value"
											stroke={getColorForStat(selectedStat.name)}
											fillOpacity={1}
											fill="url(#colorGradient)"
										/>
									</RechartsAreaChart>
								);
							case 'bar':
								return (
									<RechartsBarChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
										<CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
										<YAxis tick={{ fill: '#888', fontSize: 12 }} />
										<Tooltip
											contentStyle={{
												backgroundColor: 'rgba(17, 24, 39, 0.8)',
												backdropFilter: 'blur(8px)',
												border: '1px solid #333',
												borderRadius: '8px'
											}}
											formatter={(value) => [`${formatNumber(value as number)} ${selectedStat.unit}`]}
										/>
										<Bar
											dataKey="value"
											fill={getColorForStat(selectedStat.name)}
											radius={[4, 4, 0, 0]}
											maxBarSize={50}
										/>
									</RechartsBarChart>
								);
							case 'line':
								return (
									<RechartsLineChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
										<CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
										<YAxis tick={{ fill: '#888', fontSize: 12 }} />
										<Tooltip
											contentStyle={{
												backgroundColor: 'rgba(17, 24, 39, 0.8)',
												backdropFilter: 'blur(8px)',
												border: '1px solid #333',
												borderRadius: '8px'
											}}
											formatter={(value) => [`${formatNumber(value as number)} ${selectedStat.unit}`]}
										/>
										<Line
											type="monotone"
											dataKey="value"
											stroke={getColorForStat(selectedStat.name)}
											strokeWidth={2}
											dot={{ stroke: getColorForStat(selectedStat.name), strokeWidth: 2, r: 4, fill: '#111' }}
											activeDot={{ stroke: getColorForStat(selectedStat.name), strokeWidth: 2, r: 6, fill: '#111' }}
										/>
									</RechartsLineChart>
								);
							default: // 'pie'
								return (
									<RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
										<Tooltip
											contentStyle={{
												backgroundColor: 'rgba(17, 24, 39, 0.8)',
												backdropFilter: 'blur(8px)',
												border: '1px solid #333',
												borderRadius: '8px'
											}}
											formatter={(value, name) => [`${formatNumber(value as number)}`, name]}
										/>
										<Pie
											data={comparisonData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											innerRadius={40}
											fill="#8884d8"
											paddingAngle={2}
											label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
											labelLine={false}
										>
											{comparisonData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
											))}
										</Pie>
										<Legend
											verticalAlign="bottom"
											height={36}
											formatter={(value) => <span style={{ color: '#888', fontSize: 12 }}>{value}</span>}
										/>
									</RechartsPieChart>
								);
						}
					})()}
				</ResponsiveContainer>
			</div>
		</DashboardCard>
	);
} 