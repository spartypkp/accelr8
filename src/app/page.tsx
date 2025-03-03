"use client";

import { DashboardLayout } from '@/components/dashboard/layout';
import { AdminDashboard } from '@/components/dashboard/screens/admin-dashboard';
import { CompetitiveStatsDashboard } from '@/components/dashboard/screens/competitive-stats-dashboard';
import { HouseStatsDashboard } from '@/components/dashboard/screens/house-stats-dashboard';
import { ResidentStatsDashboard } from '@/components/dashboard/screens/resident-stats-dashboard';
import { Button } from '@/components/ui/button';
import { Tv } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	// Get all dashboard screens including resident groups
	const residentDashboards = <ResidentStatsDashboard />;

	return (
		<>
			{/* TV Dashboard Link */}
			<div className="fixed top-4 right-4 z-80">
				<Button asChild variant="outline" className="bg-black/40 backdrop-blur-sm border-gray-700 hover:bg-black/60">
					<Link href="/tv" className="flex items-center gap-2">
						<Tv className="h-4 w-4" />
						<span>TV Mode</span>
					</Link>
				</Button>
			</div>

			{/* Existing Dashboard Layout with improved settings */}
			<DashboardLayout
				autoRotate={false}
				rotationInterval={15000}
				minimal={false}
				showHeader={true}
				showAddress={true}
				background="default"
			>
				<AdminDashboard />
				<CompetitiveStatsDashboard />
				<HouseStatsDashboard />
				{/* ResidentStatsDashboard now returns multiple screens */}
				{residentDashboards}
			</DashboardLayout>
		</>
	);
}
