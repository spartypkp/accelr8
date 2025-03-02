"use client";

import { DashboardLayout } from '@/components/dashboard/layout';
import { AdminDashboard } from '@/components/dashboard/screens/admin-dashboard';
import { CompetitiveStatsDashboard } from '@/components/dashboard/screens/competitive-stats-dashboard';
import { HouseStatsDashboard } from '@/components/dashboard/screens/house-stats-dashboard';
import { ResidentStatsDashboard } from '@/components/dashboard/screens/resident-stats-dashboard';

export default function Home() {
	// Get all dashboard screens including resident groups
	const residentDashboards = <ResidentStatsDashboard />;

	// Ensure we're rendering all dashboard screens
	return (
		<DashboardLayout autoRotate={true} rotationInterval={15000}>
			<AdminDashboard />
			<CompetitiveStatsDashboard />
			<HouseStatsDashboard />
			{/* ResidentStatsDashboard now returns multiple screens */}
			{residentDashboards}
		</DashboardLayout>
	);
}
