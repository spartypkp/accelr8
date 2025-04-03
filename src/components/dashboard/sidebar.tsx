"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
	Calendar,
	CreditCard,
	FileText,
	Home,
	LayoutGrid,
	LogOut,
	Settings,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WithUserProps } from "./types";

export default function DashboardSidebar({ user }: WithUserProps) {
	const pathname = usePathname();
	const houseId = pathname.split("/")[2]; // Get houseId from path if present

	// Define sidebar links based on user's role and current page
	const links = [
		{
			title: "Dashboard",
			href: houseId ? `/dashboard/${houseId}` : "/dashboard",
			icon: Home,
			active: pathname === "/dashboard" || pathname === `/dashboard/${houseId}`,
		},
		{
			title: "Community",
			href: houseId ? `/dashboard/${houseId}/community` : "/dashboard/community",
			icon: Users,
			active: pathname.includes("/community"),
		},
		{
			title: "Events",
			href: houseId ? `/dashboard/${houseId}/events` : "/dashboard/events",
			icon: Calendar,
			active: pathname.includes("/events"),
		},
		{
			title: "Resources",
			href: houseId ? `/dashboard/${houseId}/resources` : "/dashboard/resources",
			icon: LayoutGrid,
			active: pathname.includes("/resources"),
		},
		{
			title: "Maintenance",
			href: houseId ? `/dashboard/${houseId}/maintenance` : "/dashboard/maintenance",
			icon: Wrench,
			active: pathname.includes("/maintenance"),
		},
		{
			title: "House Info",
			href: houseId ? `/dashboard/${houseId}/info` : "/dashboard/info",
			icon: FileText,
			active: pathname.includes("/info"),
		},
		{
			title: "Billing",
			href: houseId ? `/dashboard/${houseId}/billing` : "/dashboard/billing",
			icon: CreditCard,
			active: pathname.includes("/billing"),
		},
	];

	// Admin links are only shown to admins and super admins
	const adminLinks = [
		{
			title: "Admin Dashboard",
			href: houseId ? `/admin/${houseId}` : "/admin",
			icon: Settings,
			active: pathname.startsWith("/admin"),
		},
	];

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
					{links.map((link) => (
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

					{(user?.role === "admin" || user?.role === "super_admin") && (
						<>
							<div className="my-2 h-px bg-muted-foreground/20" />
							{adminLinks.map((link) => (
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
						</>
					)}
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