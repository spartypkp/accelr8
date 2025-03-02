import { cn } from '@/lib/utils';

interface DashboardCardProps {
	title?: string;
	titleIcon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	titleClassName?: string;
	contentClassName?: string;
	fullHeight?: boolean;
}

export function DashboardCard({
	title,
	titleIcon,
	children,
	className,
	titleClassName,
	contentClassName,
	fullHeight = false,
}: DashboardCardProps) {
	return (
		<div
			className={cn(
				"rounded-xl bg-gray-900/90 border border-gray-800 p-4 flex flex-col h-full",
				fullHeight && "h-full",
				className
			)}
		>
			{title && (
				<div className={cn(
					"text-lg font-semibold mb-2 pb-2 border-b border-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text flex-shrink-0",
					titleClassName
				)}>
					{titleIcon && <span className="mr-2">{titleIcon}</span>}
					{title}
				</div>
			)}
			<div className={cn(
				"flex-1 min-h-0",
				contentClassName
			)}>
				{children}
			</div>
		</div>
	);
} 