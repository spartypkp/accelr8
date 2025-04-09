import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | Accelr8",
	description: "Manage your Accelr8 experience",
};

// Force dynamic rendering to avoid build errors when accessing user data
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {


	return (

		<DashboardShell>
			{children}
		</DashboardShell>

	);
} 