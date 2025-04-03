import { requirePermission } from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getAdminManagedHouses, getUserActiveResidency } from "@/lib/supabase/queries";
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
	// Ensure user is authenticated and has view_house permission
	const user = await requirePermission('view_house');

	// Handle different user roles and their redirection logic - server-side only
	if (typeof window === 'undefined') {
		// Handle resident role
		if (user.role === 'resident') {
			// Get the user's current residency using the abstracted query
			const residency = await getUserActiveResidency(user.id);

			// If user has an active residency, redirect to their house dashboard
			if (residency?.sanity_house_id) {
				redirect(`/dashboard/${residency.sanity_house_id}`);
			} else {
				// Resident without active house - redirect to houses page with message
				redirect("/houses?status=no_active_house");
			}
		}

		// Handle admin role
		else if (user.role === 'admin') {
			// Get houses the admin manages using the abstracted query
			const houses = await getAdminManagedHouses(user.id);

			// If admin manages a house, redirect to that house's admin page
			if (houses && houses.length > 0) {
				redirect(`/admin/${houses[0].sanity_house_id}`);
			} else {
				// Fallback to admin overview
				redirect("/admin");
			}
		}

		// Handle super_admin role
		else if (user.role === 'super_admin') {
			// Super admins see the global admin dashboard
			redirect("/admin");
		}
	}

	return <DashboardShell user={user}>{children}</DashboardShell>;
} 