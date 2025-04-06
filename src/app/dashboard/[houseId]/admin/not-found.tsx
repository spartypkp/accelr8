import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminNotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<h1 className="text-4xl font-bold mb-4">Admin Page Not Found</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				The admin page you're looking for doesn't exist or you may not have permission to view it.
			</p>
			<div className="flex gap-4">
				<Button asChild variant="outline">
					<Link href="/dashboard">Return to Dashboard</Link>
				</Button>
				<Button asChild>
					<Link href="/dashboard">View All Houses</Link>
				</Button>
			</div>
		</div>
	);
} 