import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface DashboardCardProps {
	title?: string;
	titleIcon?: React.ReactNode;
	headerAction?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	titleClassName?: string;
	contentClassName?: string;
	fullHeight?: boolean;
	isLoading?: boolean;
	error?: Error | null;
	loadingContent?: React.ReactNode;
}

export function DashboardCard({
	title,
	titleIcon,
	headerAction,
	children,
	className,
	titleClassName,
	contentClassName,
	fullHeight = false,
	isLoading = false,
	error = null,
	loadingContent,
}: DashboardCardProps) {
	return (
		<div
			className={cn(
				"rounded-xl bg-card border shadow-sm p-2 sm:p-3 lg:p-4 flex flex-col",
				fullHeight && "h-full",
				className
			)}
		>
			{title && (
				<div className={cn(
					"text-base sm:text-lg font-semibold mb-1 sm:mb-2 pb-1 sm:pb-2 border-b flex items-center justify-between",
					titleClassName
				)}>
					<div className="flex items-center">
						{titleIcon && <span className="mr-1 sm:mr-2">{titleIcon}</span>}
						{title}
					</div>
					{headerAction && (
						<div className="ml-auto">
							{headerAction}
						</div>
					)}
				</div>
			)}
			<div className={cn(
				"flex-1 min-h-0",
				contentClassName
			)}>
				{isLoading ? (
					loadingContent || <DefaultLoadingContent />
				) : error ? (
					<ErrorContent error={error} />
				) : (
					children
				)}
			</div>
		</div>
	);
}

function DefaultLoadingContent() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-20 w-full" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}

function ErrorContent({ error }: { error: Error; }) {
	return (
		<Alert variant="destructive" className="my-2">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error loading content</AlertTitle>
			<AlertDescription>
				{error.message || "Something went wrong. Please try again later."}
			</AlertDescription>
		</Alert>
	);
} 