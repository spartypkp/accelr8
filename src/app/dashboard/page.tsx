import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardHomePage() {
	// Redirect should happen in the layout, but we'll handle it here as well
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	// Handle different user roles
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

		// If user has an active residency, redirect to their house dashboard
		if (residency && residency.sanity_house_id) {
			redirect(`/dashboard/${residency.sanity_house_id}`);
		} else {
			// If no active residency, show them houses
			redirect("/houses");
		}
	} else if (user.role === 'admin') {
		// For admins, get their managed houses
		const supabase = await import("@/lib/supabase/client").then(
			(mod) => mod.createClient()
		);

		const { data: houses } = await supabase
			.from("house_admins")
			.select("sanity_house_id")
			.eq("user_id", user.id)
			.limit(1);

		// If admin manages a house, redirect to that house's admin page
		if (houses && houses.length > 0) {
			redirect(`/admin/${houses[0].sanity_house_id}`);
		} else {
			// Fallback to admin overview
			redirect("/admin");
		}
	} else if (user.role === 'super_admin') {
		// Super admins see the global admin dashboard
		redirect("/admin");
	}

	// Fallback for any other case
	redirect("/houses");
} 