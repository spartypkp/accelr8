import { HouseStat } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
	Beer,
	Coffee,
	DollarSign,
	Moon,
	Pizza,
	Share2,
	TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';
import {
	Bar,
	BarChart,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

interface HouseStatVisualizationProps {
	stat: HouseStat;
	className?: string;
}

/**
 * Visualization component for house stats that provides custom visuals based on stat type
 */
export function HouseStatVisualization({ stat, className }: HouseStatVisualizationProps) {
	// Generate appropriate visualization based on stat name
	const { icon, content } = useStatVisualization(stat);

	return (
		<div className={cn("flex flex-col items-center w-full h-full", className)}>
			{/* Stat Header */}
			<div className="flex flex-col items-center mb-3">
				<div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500/20 mb-2">
					{icon}
				</div>
				<h3 className="text-sm sm:text-base font-semibold text-white text-center mb-1.5">
					{stat.name}
				</h3>
				<div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
					{formatStatValue(stat)}
				</div>
				{stat.previousValue && (
					<div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm mt-1">
						<span>Previous: {formatStatValue(stat, true)}</span>
						{renderChangeIndicator(stat)}
					</div>
				)}
			</div>

			{/* Stat Visualization */}
			<div className="flex-1 w-full">
				{content}
			</div>
		</div>
	);
}

// Custom hook to generate the appropriate visualization for each stat type
function useStatVisualization(stat: HouseStat) {
	// Common chart colors
	const colors = {
		primary: '#3b82f6',
		secondary: '#8b5cf6',
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444',
		neutral: '#6b7280',
	};

	// Process data for visualizations
	const visualizationData = useMemo(() => {
		// Generate mock historical data based on current and previous values
		const historyPoints = 7; // 7 data points for a week
		const current = stat.value;
		const previous = stat.previousValue || current * 0.9; // Use 90% if no previous value

		// Create a linear progression from previous to current value
		const stepValue = (current - previous) / (historyPoints - 1);

		return Array.from({ length: historyPoints }).map((_, index) => {
			const value = previous + (stepValue * index);

			return {
				name: `Day ${index + 1}`,
				value: Math.round(value),
				// Add some random variation for more natural-looking data
				adjusted: Math.round(value * (0.95 + Math.random() * 0.1)),
			};
		});
	}, [stat]);

	// Generate percentage change for gauge charts
	const percentChange = useMemo(() => {
		if (!stat.previousValue) return 0;
		return ((stat.value - stat.previousValue) / stat.previousValue) * 100;
	}, [stat]);

	// Pick the right visualization based on the stat name
	switch (stat.name.toLowerCase()) {
		case 'total social media followers':
			return {
				icon: <Share2 className="text-blue-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={visualizationData}>
							<Line
								type="monotone"
								dataKey="value"
								stroke={colors.primary}
								strokeWidth={2}
								dot={{ r: 4, fill: colors.primary, strokeWidth: 0 }}
								activeDot={{ r: 6, fill: colors.secondary }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: 'rgba(17, 24, 39, 0.8)',
									backdropFilter: 'blur(8px)',
									border: '1px solid #333',
									borderRadius: '8px',
									color: '#fff',
									fontSize: '10px',
								}}
								formatter={(value: number) => [`${value.toLocaleString()} followers`, 'Followers']}
								labelFormatter={() => 'Followers Growth'}
							/>
							<XAxis
								dataKey="name"
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
								width={40}
								tickFormatter={(value) => `${value / 1000}k`}
							/>
						</LineChart>
					</ResponsiveContainer>
				)
			};

		case 'house mrr':
			return {
				icon: <DollarSign className="text-green-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={visualizationData}>
							<Bar dataKey="value" radius={[4, 4, 0, 0]}>
								{visualizationData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={index === visualizationData.length - 1 ? colors.success : colors.primary}
									/>
								))}
							</Bar>
							<Tooltip
								contentStyle={{
									backgroundColor: 'rgba(17, 24, 39, 0.8)',
									backdropFilter: 'blur(8px)',
									border: '1px solid #333',
									borderRadius: '8px',
									color: '#fff',
									fontSize: '10px',
								}}
								formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
								labelFormatter={() => 'Monthly Revenue'}
							/>
							<XAxis
								dataKey="name"
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
								width={40}
								tickFormatter={(value) => `$${value / 1000}k`}
							/>
						</BarChart>
					</ResponsiveContainer>
				)
			};

		case 'beers consumed (month)':
			return {
				icon: <Beer className="text-amber-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<div className="h-full flex flex-col items-center justify-center">
						<div className="relative w-full h-full flex items-center justify-center">
							{/* Beer mug visualization */}
							<div className="relative w-24 h-32 bg-amber-500/20 rounded-b-2xl flex items-end overflow-hidden border-b-2 border-l-2 border-r-2 border-amber-500/40">
								<motion.div
									className="w-full bg-amber-500/60 rounded-t-sm"
									style={{ height: `${Math.min(100, (stat.value / 100) * 100)}%` }}
									animate={{
										height: [`${Math.min(100, (stat.value / 100) * 100)}%`, `${Math.min(100, ((stat.value / 100) * 100) - 5)}%`, `${Math.min(100, (stat.value / 100) * 100)}%`],
										y: [0, 3, 0]
									}}
									transition={{
										repeat: Infinity,
										duration: 2,
										ease: "easeInOut"
									}}
								>
									{/* Beer foam */}
									<motion.div
										className="absolute top-0 left-0 right-0 h-3 bg-amber-200/70 rounded-full"
										animate={{
											opacity: [0.7, 0.9, 0.7],
											scale: [1, 1.02, 1]
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											ease: "easeInOut"
										}}
									/>
								</motion.div>
							</div>

							{/* Beer handle */}
							<div className="absolute right-[calc(50%-40px)] h-16 w-4 rounded-r-full border-r-2 border-t-2 border-b-2 border-amber-500/40 bg-amber-500/10" />

							{/* Month progress */}
							<div className="absolute bottom-2 text-xs text-amber-400 font-medium">
								{Math.round(Math.min(100, (stat.value / 100) * 100))}% of 100 beers
							</div>
						</div>
					</div>
				)
			};

		case 'pizza ordered (month)':
			return {
				icon: <Pizza className="text-orange-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<div className="h-full flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={[
										{ name: 'Consumed', value: stat.value, fill: colors.warning },
										{ name: 'Remaining', value: 15, fill: colors.neutral }
									]}
									cx="50%"
									cy="50%"
									innerRadius={30}
									outerRadius={60}
									paddingAngle={2}
									dataKey="value"
									label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
										const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
										const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
										const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

										return (
											<text
												x={x}
												y={y}
												fill="#fff"
												textAnchor="middle"
												dominantBaseline="middle"
												fontSize={12}
											>
												{`${(percent * 100).toFixed(0)}%`}
											</text>
										);
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(17, 24, 39, 0.8)',
										backdropFilter: 'blur(8px)',
										border: '1px solid #333',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '10px',
									}}
									formatter={(value: number, name: string) => [`${value} pizzas`, name]}
								/>
							</PieChart>
						</ResponsiveContainer>

						{/* Pizza slices visualization */}
						<div className="absolute flex gap-1">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="w-4 h-4">
									<motion.div
										className={`w-full h-full rounded-full ${i < Math.min(8, Math.round((stat.value / 15) * 8)) ? 'bg-orange-500/70' : 'bg-gray-600/40'}`}
										animate={i < Math.min(8, Math.round((stat.value / 15) * 8)) ? {
											scale: [1, 1.1, 1],
										} : {}}
										transition={{
											repeat: Infinity,
											duration: 2,
											delay: i * 0.2,
											ease: "easeInOut"
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)
			};

		case 'coffee brewed (week)':
			return {
				icon: <Coffee className="text-amber-700 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<div className="h-full flex flex-col items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<RadialBarChart
								cx="50%"
								cy="50%"
								innerRadius="20%"
								outerRadius="80%"
								barSize={10}
								data={[
									{
										name: 'Current',
										value: stat.value,
										fill: '#92400e',
									}
								]}
								startAngle={180}
								endAngle={0}
							>
								<RadialBar
									background={{ fill: '#292524' }}
									dataKey="value"
									cornerRadius={10}
									label={{
										position: 'center',
										fill: '#fff',
										fontSize: 16,
										fontWeight: 'bold',
										formatter: (value: any) => `${value} cups`
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(17, 24, 39, 0.8)',
										backdropFilter: 'blur(8px)',
										border: '1px solid #333',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '10px',
									}}
									formatter={(value: number) => [`${value} cups`, 'Coffee brewed']}
								/>
							</RadialBarChart>
						</ResponsiveContainer>

						{/* Coffee cups visualization */}
						<div className="absolute bottom-4 flex gap-1">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="relative w-7 h-7">
									<motion.div
										className="absolute w-5 h-4 bg-amber-900/70 bottom-0 left-1 rounded-b-lg"
										animate={{
											y: [0, -2, 0],
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											delay: i * 0.3,
											ease: "easeInOut"
										}}
									/>
									<motion.div
										className="absolute w-3 h-1.5 bg-amber-700/40 -right-1 top-1 rounded-full border border-amber-700/60"
										animate={{
											y: [0, -2, 0],
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											delay: i * 0.3,
											ease: "easeInOut"
										}}
									/>
									<motion.div
										className="absolute w-4 h-1 bg-gradient-to-b from-amber-500/60 to-transparent rounded-full top-0 left-0.5"
										animate={{
											y: [0, -2, 0],
											opacity: [0.6, 0.8, 0.6]
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											delay: i * 0.3,
											ease: "easeInOut"
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)
			};

		case 'avg. sleep score':
			return {
				icon: <Moon className="text-indigo-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<div className="h-full flex flex-col items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<RadialBarChart
								cx="50%"
								cy="50%"
								innerRadius="30%"
								outerRadius="100%"
								barSize={20}
								data={[
									{
										name: 'Current',
										value: stat.value,
										fill: '#818cf8',
									}
								]}
								startAngle={90}
								endAngle={-270}
							>
								<RadialBar
									background={{ fill: '#1e1b4b' }}
									dataKey="value"
									cornerRadius={10}
									label={{
										position: 'center',
										fill: '#fff',
										fontSize: 24,
										fontWeight: 'bold',
										formatter: () => `${stat.value}%`
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(17, 24, 39, 0.8)',
										backdropFilter: 'blur(8px)',
										border: '1px solid #333',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '10px',
									}}
									formatter={(value: number) => [`${value}%`, 'Sleep Score']}
								/>
							</RadialBarChart>
						</ResponsiveContainer>

						{/* Sleep quality indicator */}
						<div className="absolute bottom-4 text-xs">
							{stat.value >= 80 ? (
								<div className="text-green-400">Excellent Sleep Quality</div>
							) : stat.value >= 70 ? (
								<div className="text-blue-400">Good Sleep Quality</div>
							) : stat.value >= 60 ? (
								<div className="text-yellow-400">Average Sleep Quality</div>
							) : (
								<div className="text-red-400">Poor Sleep Quality</div>
							)}
						</div>
					</div>
				)
			};

		// Default fallback visualization (line chart)
		default:
			return {
				icon: <TrendingUp className="text-blue-400 h-6 w-6 sm:h-7 sm:w-7" />,
				content: (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={visualizationData}>
							<Line
								type="monotone"
								dataKey="value"
								stroke={colors.primary}
								strokeWidth={2}
								dot={{ r: 3, fill: colors.primary, strokeWidth: 0 }}
								activeDot={{ r: 5, fill: colors.secondary }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: 'rgba(17, 24, 39, 0.8)',
									backdropFilter: 'blur(8px)',
									border: '1px solid #333',
									borderRadius: '8px',
									color: '#fff',
									fontSize: '10px',
								}}
								formatter={(value: number) => [stat.unit ? `${value} ${stat.unit}` : value, stat.name]}
							/>
							<XAxis
								dataKey="name"
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: '#888' }}
								stroke="#444"
								tickLine={{ stroke: '#444' }}
								axisLine={{ stroke: '#444' }}
								width={30}
							/>
						</LineChart>
					</ResponsiveContainer>
				)
			};
	}
}

// Helper function to format stat value based on type
function formatStatValue(stat: HouseStat, usePrevious = false): string {
	const value = usePrevious ? (stat.previousValue || 0) : stat.value;

	// Format currency
	if (stat.name.toLowerCase().includes('mrr')) {
		return formatCurrency(value);
	}

	// Format large numbers
	if (value >= 10000) {
		return `${(value / 1000).toFixed(1)}k`;
	}

	// Format percentages
	if (stat.unit === '%') {
		return `${value}%`;
	}

	// Default formatting
	return value.toLocaleString() + (stat.unit ? ` ${stat.unit}` : '');
}

// Helper function to render change indicator arrow
function renderChangeIndicator(stat: HouseStat) {
	if (!stat.previousValue) return null;

	const change = stat.value - stat.previousValue;
	const percentChange = (change / stat.previousValue) * 100;

	if (change > 0) {
		return (
			<motion.div
				className="flex items-center text-green-400 text-xs"
				animate={{ y: [0, -1, 0] }}
				transition={{ repeat: Infinity, duration: 1.5 }}
			>
				<TrendingUp className="w-3 h-3 mr-0.5" />
				{percentChange.toFixed(1)}%
			</motion.div>
		);
	} else if (change < 0) {
		return (
			<motion.div
				className="flex items-center text-red-400 text-xs"
				animate={{ y: [0, 1, 0] }}
				transition={{ repeat: Infinity, duration: 1.5 }}
			>
				<TrendingUp className="w-3 h-3 mr-0.5 rotate-180" />
				{Math.abs(percentChange).toFixed(1)}%
			</motion.div>
		);
	}

	return null;
}

// Add formatCurrency utility function
function formatCurrency(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(value);
} 