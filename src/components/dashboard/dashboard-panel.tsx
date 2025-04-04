import { cn } from "@/lib/utils";

interface DashboardPanelProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
}

export function DashboardPanel({
	title,
	description,
	children,
	className,
	contentClassName,
}: DashboardPanelProps) {
	return (
		<div className="p-4 sm:p-6 md:p-8">
			{(title || description) && (
				<div className="mb-6">
					{title && <h1 className="text-2xl font-bold">{title}</h1>}
					{description && <p className="text-muted-foreground mt-1">{description}</p>}
				</div>
			)}
			<div className={cn("space-y-4", className)}>
				<div className={cn("", contentClassName)}>
					{children}
				</div>
			</div>
		</div>
	);
} 