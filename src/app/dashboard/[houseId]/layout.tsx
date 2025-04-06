import DashboardShell from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "House Dashboard | Accelr8",
	description: "Manage your coliving experience at Accelr8",
};

export default async function HouseLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { houseId: string; };
}) {
	const supabase = await createClient();

	// Get current user and role
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect("/login");
	}

	// Get user role and check house access
	const { data: userData } = await supabase
		.from('accelr8_users')
		.select('role, name, email')
		.eq('id', user.id)
		.single();

	if (!userData) {
		redirect("/login");
	}

	const userRole = userData?.role || 'resident';
	const isAdmin = userRole === 'admin' || userRole === 'super_admin';

	// Check if the user has access to this house
	let hasAccess = false;

	if (userRole === 'super_admin') {
		hasAccess = true; // Super admins have access to all houses
	} else if (userRole === 'admin') {
		// Check if the user is an admin for this house
		const { data: adminAccess } = await supabase
			.from('house_admins')
			.select('id')
			.eq('user_id', user.id)
			.eq('sanity_house_id', params.houseId)
			.maybeSingle();

		hasAccess = !!adminAccess;
	} else {
		// Check if the user is a resident of this house
		const { data: residency } = await supabase
			.from('residencies')
			.select('id')
			.eq('user_id', user.id)
			.eq('sanity_house_id', params.houseId)
			.eq('status', 'active')
			.maybeSingle();

		hasAccess = !!residency;
	}

	if (!hasAccess) {
		redirect("/dashboard");
	}

	// Create a user object to pass to dashboard components
	const dashboardUser = {
		id: user.id,
		email: userData.email,
		name: userData.name,
		role: userRole
	};

	return (
		<DashboardShell user={dashboardUser}>
			{children}
		</DashboardShell>
	);
} 