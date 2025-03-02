import { getAllHouseStats } from '@/lib/data/data-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
			className="space-y-6 p-8"
		>
			<div className="flex items-center justify-center">
				<h1 className={cn(
					"text-3xl font-bold bg-clip-text text-transparent",
					"bg-gradient-to-r from-blue-500 to-purple-500"
				)}>
					House Statistics Dashboard
				</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
				{/* Main stats */}
				<HouseStats
					stats={mainStats}
					className="h-full"
				/>

				{/* Interactive charts */}
				<HouseMetricCharts
					stats={stats}
					className="h-full"
				/>

				{/* Highlight stats with custom visualizations */}
				<HouseHighlightStats
					stats={highlightStats}
					className="h-full"
				/>
			</div>
		</motion.div>
	);
} 