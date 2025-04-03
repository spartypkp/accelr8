import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Resident Dashboard | Accelr8",
	description: "Manage your Accelr8 house experience",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Ensure user is authenticated
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	// If we're on the root dashboard page, check if we need to redirect
	if (user.role === 'resident') {
		// Get the user's current residency
		const supabase = await import("@/lib/supabase/client").then(
			(mod) => mod.createClient()
		);

		const { data: residency } = await supabase
			.from("residencies")
			.select("sanity_house_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		// If user has an active residency and we're on the root dashboard page,
		// redirect to their house dashboard
		if (residency && residency.sanity_house_id &&
			typeof window === 'undefined' && // Server-side check
			residency.sanity_house_id !== 'dashboard') {
			redirect(`/dashboard/${residency.sanity_house_id}`);
		}
	}

	return <DashboardShell user={user}>{children}</DashboardShell>;
} 