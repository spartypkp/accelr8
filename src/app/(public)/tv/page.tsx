"use client";

import { MasterDashboard } from '@/components/dashboard/screens/master-dashboard';

export default function TVDashboard() {
	return (
		<>
			{/* Back to Main Dashboard Link */}
			{/* <div className="fixed top-4 left-4 z-50">
				<Button asChild variant="outline" size="sm" className="bg-black/40 backdrop-blur-sm border-gray-700 hover:bg-black/60">
					<Link href="/" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						<span>Exit TV Mode</span>
					</Link>
				</Button>
			</div> */}

			{/* Fullscreen TV-optimized dashboard */}
			<div className="fixed inset-0 bg-black">
				<MasterDashboard />
			</div>
		</>
	);
} 