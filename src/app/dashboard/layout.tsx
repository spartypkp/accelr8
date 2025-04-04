import DashboardShell from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Resident Dashboard | Accelr8",
	description: "Manage your Accelr8 house experience",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Get the user from server
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	// Auth checks are now performed in middleware 
	// Only render dashboard if user is here (middleware handles redirects)
	if (!user) {
		return null; // Will never render - middleware will redirect
	}

	return (
		<DashboardShell
			user={{
				id: user.id,
				email: user.email || "",
				name: user.user_metadata?.name,
				role: user.user_metadata?.role || "resident",
				profile: user.user_metadata?.profile
			}}
		>
			{children}
		</DashboardShell>
	);
} 