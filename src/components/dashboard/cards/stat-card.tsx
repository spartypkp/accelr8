import { Progress } from '@/components/ui/progress';
import { calculatePercentage, formatNumber, getPercentageChange } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { DashboardCard } from './dashboard-card';

interface StatCardProps {
	title: string;
	value: number;
	previousValue?: number;
	target?: number;
	unit?: string;
	className?: string;
	icon?: React.ReactNode;
}

export function StatCard({
	title,
	value,
	previousValue,
	target,
	unit = '',
	className,
	icon
}: StatCardProps) {
	const displayValue = `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;

	// Calculate percentage for progress bar if target exists
	const percentage = target ? calculatePercentage(value, target) : undefined;

	// Calculate percentage change if previous value exists
	const change = previousValue !== undefined
		? getPercentageChange(value, previousValue)
		: undefined;

	return (
		<DashboardCard title={title} className={className} titleClassName="text-sm">
			<div className="flex items-center gap-2">
				{icon && (
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500">
						{icon}
					</div>
				)}
				<div className="flex-1">
					<div className="text-xl font-bold">{displayValue}</div>

					{change && (
						<div className="flex items-center text-xs">
							{change.isPositive ? (
								<TrendingUp className="w-3 h-3 mr-1 text-green-500" />
							) : (
								<TrendingDown className="w-3 h-3 mr-1 text-red-500" />
							)}
							<span className={change.isPositive ? "text-green-500" : "text-red-500"}>
								{change.percentage}%
							</span>
						</div>
					)}
				</div>
			</div>

			{target && (
				<div className="mt-2">
					<div className="flex justify-between text-xs text-gray-400 mb-1">
						<span>Progress</span>
						<span>{percentage}%</span>
					</div>
					<Progress value={percentage} className="h-1.5 bg-gray-800" />
				</div>
			)}
		</DashboardCard>
	);
} 