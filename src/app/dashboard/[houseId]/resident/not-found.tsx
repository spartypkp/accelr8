import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResidentNotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				The resident page you're looking for doesn't exist or you may not have permission to view it.
			</p>
			<Button asChild>
				<Link href="/dashboard">Return to Dashboard</Link>
			</Button>
		</div>
	);
} 