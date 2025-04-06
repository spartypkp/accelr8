"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";
import {
	Calendar,
	CreditCard,
	Home,
	LogOut,
	Settings,
	Users,
	Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WithUserProps } from "./types";

export default function DashboardSidebar({ user }: WithUserProps) {
	const pathname = usePathname();

	// Parse current path to extract houseId and section (resident or admin)
	const pathParts = pathname.split("/");
	const houseId = pathParts.length > 2 ? pathParts[2] : null;
	const isAdmin = pathname.includes('/admin');
	const section = isAdmin ? 'admin' : 'resident';

	// Define base path for links
	const basePath = houseId ? `/dashboard/${houseId}/${section}` : '/dashboard';

	// Define sidebar links for resident section
	const residentLinks = [
		{
			title: "Dashboard",
			href: houseId ? `/dashboard/${houseId}/resident` : "/dashboard",
			icon: Home,
			active: pathname === `/dashboard/${houseId}/resident` || pathname === "/dashboard",
		},
		{
			title: "Community",
			href: houseId ? `/dashboard/${houseId}/resident/community` : "/dashboard",
			icon: Users,
			active: pathname.includes("/resident/community"),
		},
		{
			title: "Events",
			href: houseId ? `/dashboard/${houseId}/resident/events` : "/dashboard",
			icon: Calendar,
			active: pathname.includes("/resident/events"),
		},
		{
			title: "Maintenance",
			href: houseId ? `/dashboard/${houseId}/resident/maintenance` : "/dashboard",
			icon: Wrench,
			active: pathname.includes("/resident/maintenance"),
		},
		{
			title: "Billing",
			href: houseId ? `/dashboard/${houseId}/resident/billing` : "/dashboard",
			icon: CreditCard,
			active: pathname.includes("/resident/billing"),
		},
	];

	// Admin links to show in the admin section
	const adminLinks = [
		{
			title: "Admin Dashboard",
			href: houseId ? `/dashboard/${houseId}/admin` : "/dashboard",
			icon: Home,
			active: pathname === `/dashboard/${houseId}/admin`,
		},
		{
			title: "Residents",
			href: houseId ? `/dashboard/${houseId}/admin/residents` : "/dashboard",
			icon: Users,
			active: pathname.includes("/admin/residents"),
		},
		{
			title: "Operations",
			href: houseId ? `/dashboard/${houseId}/admin/operations` : "/dashboard",
			icon: Wrench,
			active: pathname.includes("/admin/operations"),
		},
		{
			title: "Events",
			href: houseId ? `/dashboard/${houseId}/admin/events` : "/dashboard",
			icon: Calendar,
			active: pathname.includes("/admin/events"),
		},
		{
			title: "Analytics",
			href: houseId ? `/dashboard/${houseId}/admin/analytics` : "/dashboard",
			icon: Settings,
			active: pathname.includes("/admin/analytics"),
		},
		{
			title: "Finances",
			href: houseId ? `/dashboard/${houseId}/admin/finances` : "/dashboard",
			icon: CreditCard,
			active: pathname.includes("/admin/finances"),
		},
	];

	// Determine which links to display based on current section
	const currentLinks = isAdmin ? adminLinks : residentLinks;

	// View toggle link - allows switching between admin and resident views for admins
	const toggleViewLink = {
		title: isAdmin ? "Resident View" : "Admin View",
		href: houseId
			? `/dashboard/${houseId}/${isAdmin ? 'resident' : 'admin'}`
			: "/dashboard",
		icon: Settings,
	};

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/login";
	};

	return (
		<div className="flex h-full flex-col border-r bg-muted/40 p-4">
			<div className="flex h-14 items-center px-4 py-2 border-b mb-4">
				<Link href="/dashboard" className="flex items-center gap-2">
					<span className="font-bold">Accelr8</span>
				</Link>
			</div>
			<div className="flex-1 overflow-auto py-2">
				<nav className="grid items-start px-2 gap-2">
					{currentLinks.map((link) => (
						<Link key={link.href} href={link.href}>
							<Button
								variant={link.active ? "secondary" : "ghost"}
								className={cn(
									"w-full justify-start gap-2",
									link.active ? "font-medium" : "font-normal"
								)}
							>
								<link.icon className="h-4 w-4" />
								{link.title}
							</Button>
						</Link>
					))}

					{/* View toggle for admins and super_admins */}
					{(user?.role === "admin" || user?.role === "super_admin") && houseId && (
						<>
							<div className="my-2 h-px bg-muted-foreground/20" />
							<Link href={toggleViewLink.href}>
								<Button
									variant="ghost"
									className="w-full justify-start gap-2"
								>
									<toggleViewLink.icon className="h-4 w-4" />
									{toggleViewLink.title}
								</Button>
							</Link>
						</>
					)}

					{/* Houses link to return to house selection */}
					<div className="my-2 h-px bg-muted-foreground/20" />
					<Link href="/dashboard">
						<Button
							variant="ghost"
							className="w-full justify-start gap-2"
						>
							<Home className="h-4 w-4" />
							All Houses
						</Button>
					</Link>
				</nav>
			</div>
			<div className="mt-auto border-t pt-4">
				<Button
					variant="ghost"
					className="w-full justify-start gap-2"
					onClick={handleSignOut}
				>
					<LogOut className="h-4 w-4" />
					Sign out
				</Button>
			</div>
		</div>
	);
} 