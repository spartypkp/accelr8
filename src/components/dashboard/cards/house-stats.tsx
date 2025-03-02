import { HouseStat } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import {
	Beer,
	Coffee,
	DollarSign,
	Moon,
	Pizza,
	Users
} from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import { StatCard } from './stat-card';

interface HouseStatsProps {
	stats: HouseStat[];
	className?: string;
}

export function HouseStats({ stats, className }: HouseStatsProps) {
	// Map of icons for different stats
	const getIconForStat = (statName: string) => {
		const iconMap: Record<string, React.ReactNode> = {
			'Total Social Media Followers': <Users className="w-4 h-4" />,
			'House MRR': <DollarSign className="w-4 h-4" />,
			'Beers Consumed (Month)': <Beer className="w-4 h-4" />,
			'Pizza Ordered (Month)': <Pizza className="w-4 h-4" />,
			'Coffee Brewed (Week)': <Coffee className="w-4 h-4" />,
			'Avg. Sleep Score': <Moon className="w-4 h-4" />
		};

		return iconMap[statName] || null;
	};

	return (
		<DashboardCard
			title="House Stats"
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto h-full pr-1">
				{stats.map((stat) => (
					<StatCard
						key={stat.name}
						title={stat.name}
						value={stat.value}
						previousValue={stat.previousValue}
						unit={stat.unit}
						icon={getIconForStat(stat.name)}
						className="h-auto"
					/>
				))}
			</div>
		</DashboardCard>
	);
} 