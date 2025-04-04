import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
	// This page will almost never be seen as middleware will redirect
	// However, we provide a fallback UI just in case
	return (
		<div className="container mx-auto py-8">
			<h2 className="text-2xl font-bold mb-4">Redirecting to your dashboard...</h2>
			<p className="text-muted-foreground mb-6">
				You'll be redirected to your specific dashboard momentarily.
			</p>

			<div className="space-y-4">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-64" />
				<Skeleton className="h-4 w-32" />
			</div>
		</div>
	);
} 