import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardPanelProps {
	children: ReactNode;
	title?: string;
	description?: string;
	className?: string;
	fullWidth?: boolean;
}

export function DashboardPanel({
	children,
	title,
	description,
	className,
	fullWidth = false,
}: DashboardPanelProps) {
	return (
		<section
			className={cn(
				"space-y-4",
				fullWidth ? "w-full" : "container mx-auto",
				className
			)}
		>
			{(title || description) && (
				<div className="mb-6">
					{title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
					{description && (
						<p className="text-muted-foreground mt-1">{description}</p>
					)}
				</div>
			)}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{children}
			</div>
		</section>
	);
}

// Specialized version for a single column layout
export function DashboardPanelSingle({
	children,
	title,
	description,
	className,
	fullWidth = false,
}: DashboardPanelProps) {
	return (
		<section
			className={cn(
				"space-y-4",
				fullWidth ? "w-full" : "container mx-auto",
				className
			)}
		>
			{(title || description) && (
				<div className="mb-6">
					{title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
					{description && (
						<p className="text-muted-foreground mt-1">{description}</p>
					)}
				</div>
			)}
			<div className="space-y-4">
				{children}
			</div>
		</section>
	);
} 