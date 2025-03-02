import { getAllHouseStats } from '@/lib/data/data-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { HouseHighlightStats } from '../cards/house-highlight-stats';
import { HouseMetricCharts } from '../cards/house-metric-charts';
import { HouseStats } from '../cards/house-stats';

export function HouseStatsDashboard() {
	const stats = getAllHouseStats();

	// Split the stats for different visualizations
	const mainStats = stats.slice(0, 3); // First 3 stats for main display
	const highlightStats = stats.slice(3); // Rest for highlight stats

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="h-screen w-full flex flex-col overflow-hidden p-4 md:p-6"
		>
			{/* Dashboard Header */}
			<div className="flex items-center justify-center mb-4">
				<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
					<TrendingUp className="text-blue-400 h-4 w-4" />
				</div>
				<h1 className={cn(
					"text-3xl font-bold bg-clip-text text-transparent",
					"bg-gradient-to-r from-blue-500 to-purple-500"
				)}>
					House Metrics
				</h1>
			</div>

			{/* Dashboard Content */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 h-[calc(100vh-100px)]">
				{/* Main stats */}
				<div className="h-full overflow-hidden">
					<HouseStats
						stats={mainStats}
						className="h-full"
					/>
				</div>

				{/* Interactive charts */}
				<div className="h-full overflow-hidden">
					<HouseMetricCharts
						stats={stats}
						className="h-full"
					/>
				</div>

				{/* Highlight stats with custom visualizations */}
				<div className="h-full overflow-hidden">
					<HouseHighlightStats
						stats={highlightStats}
						className="h-full"
					/>
				</div>
			</div>
		</motion.div>
	);
} 