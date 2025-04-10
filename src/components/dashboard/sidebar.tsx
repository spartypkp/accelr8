"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/UserContext";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	Building,
	Calendar,
	CreditCard,
	FileText,
	Home,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	ShieldCheck,
	User,
	UserCog,
	Users,
	Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface NavItem {
	title: string;
	href: string;
	icon: React.ElementType;
	variant: "default" | "ghost";
	roles?: string[];
	section?: string;
}

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();
	const { user, signOut } = useUser();

	// Extract route information
	const pathParts = pathname.split("/");
	const houseId = pathParts.includes("[houseId]") ? pathParts[pathParts.indexOf("[houseId]") + 1] : null;
	const isAdmin = pathname.includes('/admin');
	const isResident = pathname.includes('/resident');
	const isSuperAdmin = pathname.includes('/superAdmin');

	// Determine current section for active state
	const currentSection = isSuperAdmin ? 'superAdmin' : isAdmin ? 'admin' : isResident ? 'resident' : 'dashboard';

	// Generate proper base paths
	const dashboardPath = "/dashboard";
	const residentPath = houseId ? `/dashboard/${houseId}/resident` : "/dashboard";
	const adminPath = houseId ? `/dashboard/${houseId}/admin` : "/dashboard";
	const superAdminPath = "/dashboard/superAdmin";

	// Main navigation items - available to all users
	const mainNavItems = useMemo<NavItem[]>(() => [
		{
			title: "Dashboard",
			href: dashboardPath,
			icon: LayoutDashboard,
			variant: pathname === dashboardPath ? "default" : "ghost",
		},
		{
			title: "Profile",
			href: `${dashboardPath}/profile`,
			icon: User,
			variant: pathname.includes(`/profile`) ? "default" : "ghost",
		},
		{
			title: "Settings",
			href: `${dashboardPath}/settings`,
			icon: Settings,
			variant: pathname.includes(`/settings`) ? "default" : "ghost",
		}
	], [dashboardPath, pathname]);

	// User specific navigation based on role
	const roleNavItems = useMemo<NavItem[]>(() => {
		const items: NavItem[] = [];

		// Applicant routes
		if (user?.role === 'applicant') {
			items.push({
				title: "My Applications",
				href: `${dashboardPath}/applications`,
				icon: FileText,
				variant: pathname.includes('/applications') ? "default" : "ghost",
				section: 'applicant'
			});
		}

		// Resident routes
		if (['resident', 'admin', 'super_admin'].includes(user?.role || '')) {
			items.push({
				title: "Resident Dashboard",
				href: residentPath,
				icon: Home,
				variant: pathname === residentPath ? "default" : "ghost",
				section: 'resident'
			});

			if (isResident || pathname === residentPath) {
				items.push(
					{
						title: "Community",
						href: `${residentPath}/community`,
						icon: Users,
						variant: pathname.includes('/community') ? "default" : "ghost",
						section: 'resident'
					},
					{
						title: "Events",
						href: `${residentPath}/events`,
						icon: Calendar,
						variant: pathname.includes('/events') ? "default" : "ghost",
						section: 'resident'
					},
					{
						title: "Maintenance",
						href: `${residentPath}/maintenance`,
						icon: Wrench,
						variant: pathname.includes('/maintenance') ? "default" : "ghost",
						section: 'resident'
					},
					{
						title: "Billing",
						href: `${residentPath}/billing`,
						icon: CreditCard,
						variant: pathname.includes('/billing') ? "default" : "ghost",
						section: 'resident'
					}
				);
			}
		}

		// Admin routes
		if (['admin', 'super_admin'].includes(user?.role || '')) {
			items.push({
				title: "Admin Dashboard",
				href: adminPath,
				icon: UserCog,
				variant: pathname === adminPath ? "default" : "ghost",
				section: 'admin'
			});

			if (isAdmin || pathname === adminPath) {
				items.push(
					{
						title: "Residents",
						href: `${adminPath}/residents`,
						icon: Users,
						variant: pathname.includes('/admin/residents') ? "default" : "ghost",
						section: 'admin'
					},
					{
						title: "Operations",
						href: `${adminPath}/operations`,
						icon: Wrench,
						variant: pathname.includes('/admin/operations') ? "default" : "ghost",
						section: 'admin'
					},
					{
						title: "Events",
						href: `${adminPath}/events`,
						icon: Calendar,
						variant: pathname.includes('/admin/events') ? "default" : "ghost",
						section: 'admin'
					},
					{
						title: "Analytics",
						href: `${adminPath}/analytics`,
						icon: BarChart3,
						variant: pathname.includes('/admin/analytics') ? "default" : "ghost",
						section: 'admin'
					},
					{
						title: "Finances",
						href: `${adminPath}/finances`,
						icon: CreditCard,
						variant: pathname.includes('/admin/finances') ? "default" : "ghost",
						section: 'admin'
					}
				);
			}
		}

		// Super Admin routes
		if (user?.role === 'super_admin') {
			items.push({
				title: "Super Admin",
				href: superAdminPath,
				icon: ShieldCheck,
				variant: pathname.includes('/superAdmin') ? "default" : "ghost",
				section: 'superAdmin'
			});

			if (isSuperAdmin) {
				items.push(
					{
						title: "Houses",
						href: `${superAdminPath}/houses`,
						icon: Building,
						variant: pathname.includes('/superAdmin/houses') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "New House",
						href: `${superAdminPath}/expansion`,
						icon: Building,
						variant: pathname.includes('/superAdmin/expansion') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "Applications",
						href: `${superAdminPath}/applications`,
						icon: FileText,
						variant: pathname.includes('/superAdmin/applications') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "Users",
						href: `${superAdminPath}/users`,
						icon: Users,
						variant: pathname.includes('/superAdmin/users') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "Settings",
						href: `${superAdminPath}/settings`,
						icon: Settings,
						variant: pathname.includes('/superAdmin/settings') ? "default" : "ghost",
						section: 'superAdmin'
					}
				);
			}
		}

		return items;
	}, [
		user?.role,
		dashboardPath,
		residentPath,
		adminPath,
		superAdminPath,
		pathname,
		isResident,
		isAdmin,
		isSuperAdmin
	]);

	// Handle sign out
	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/login";
	};

	return (
		<div className={cn("pb-12 h-full", className)}>
			<div className="space-y-4 py-4 h-full flex flex-col">
				<div className="px-4 py-2 flex items-center gap-2 border-b pb-4 mb-4">
					<Link href="/dashboard" className="flex items-center gap-2">
						<span className="font-bold">Accelr8</span>
					</Link>
				</div>

				<div className="px-3 flex-1 overflow-auto">
					<div className="space-y-1">
						{mainNavItems.map((item) => (
							<Link key={item.href} href={item.href} className="block">
								<Button
									variant={item.variant}
									size="sm"
									className="w-full justify-start"
								>
									<item.icon className="mr-2 h-4 w-4" />
									{item.title}
								</Button>
							</Link>
						))}
					</div>

					{roleNavItems.length > 0 && (
						<>
							<div className="py-2">
								<div className="h-px bg-border" />
							</div>

							{/* Group nav items by section */}
							{['applicant', 'resident', 'admin', 'superAdmin'].map(section => {
								const sectionItems = roleNavItems.filter(
									item => !item.section || item.section === section
								);

								if (sectionItems.length === 0) return null;

								return (
									<div key={section} className="space-y-1 mb-6">
										<p className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase">
											{section === 'applicant'
												? 'Applications'
												: section === 'resident'
													? 'Resident'
													: section === 'admin'
														? 'Admin'
														: 'Super Admin'}
										</p>
										{sectionItems.map((item) => (
											<Link key={item.href} href={item.href} className="block">
												<Button
													variant={item.variant}
													size="sm"
													className="w-full justify-start"
												>
													<item.icon className="mr-2 h-4 w-4" />
													{item.title}
												</Button>
											</Link>
										))}
									</div>
								);
							})}
						</>
					)}
				</div>

				{/* Sign out button at bottom */}
				<div className="mt-auto px-3 border-t pt-4">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={handleSignOut}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sign out
					</Button>
				</div>
			</div>
		</div>
	);
}

export function MobileSidebar({ className }: SidebarProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className={className}>
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0 w-72">
				<ScrollArea className="h-full">
					<Sidebar />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}

export default Sidebar; 