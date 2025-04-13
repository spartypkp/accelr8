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
	variant: "default" | "ghost" | "outline";
	roles?: string[];
	section?: string;
}

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();
	const { user, userProfile, isAdmin, isSuperAdmin, isResident, isApplicant, signOut } = useUser();

	// Extract route information
	const pathParts = pathname.split("/");

	// Check for houseId in the path
	const hasHouseId = pathParts.length > 2 && pathParts[2] !== 'profile' &&
		pathParts[2] !== 'settings' && pathParts[2] !== 'superAdmin' &&
		pathParts[2] !== 'applications';
	const houseId = hasHouseId ? pathParts[2] : null;

	const isAdminRoute = pathname.includes('/admin');
	const isResidentRoute = pathname.includes('/resident');
	const isSuperAdminRoute = pathname.includes('/superAdmin');

	// Determine current section for active state
	const currentSection = isSuperAdminRoute ? 'superAdmin' : isAdminRoute ? 'admin' : isResidentRoute ? 'resident' : 'dashboard';

	// Get role from both sources
	const authMetadataRole = user?.user_metadata?.role;
	const profileRole = userProfile?.role;
	const effectiveRole = profileRole || authMetadataRole;

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
		}
	], [dashboardPath, pathname]);

	// User profile and settings items (moved to the bottom)
	const profileNavItems = useMemo<NavItem[]>(() => [
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
		if (isApplicant || effectiveRole === 'applicant') {
			items.push({
				title: "My Applications",
				href: `${dashboardPath}/applications`,
				icon: FileText,
				variant: pathname.includes('/applications') ? "default" : "ghost",
				section: 'applicant'
			});
		}

		// Only show house-specific navigation items when we have a houseId in the URL
		// or we're not in the superAdmin section
		if (hasHouseId && !isSuperAdminRoute) {
			// If the user is on the admin route but has resident access, show a link to resident view
			if (isAdminRoute && (isResident || effectiveRole === 'resident' || isAdmin || isSuperAdmin ||
				['resident', 'admin', 'super_admin'].includes(effectiveRole || ''))) {
				items.push({
					title: "View as Resident",
					href: residentPath,
					icon: Home,
					variant: "outline",
					section: 'switch'
				});
			}

			// If the user is on the resident route but has admin access, show a link to admin view
			if (isResidentRoute && (isAdmin || isSuperAdmin || ['admin', 'super_admin'].includes(effectiveRole || ''))) {
				items.push({
					title: "Switch to Admin",
					href: adminPath,
					icon: UserCog,
					variant: "outline",
					section: 'switch'
				});
			}

			// Resident routes - show a simplified version if on admin route
			if (isResident || effectiveRole === 'resident' || isAdmin || isSuperAdmin ||
				['resident', 'admin', 'super_admin'].includes(effectiveRole || '')) {

				// Only show full resident navigation when on resident routes
				if (!isAdminRoute) {
					items.push({
						title: "Resident Dashboard",
						href: residentPath,
						icon: Home,
						variant: pathname === residentPath ? "default" : "ghost",
						section: 'resident'
					});

					if (isResidentRoute || pathname === residentPath) {
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
			}

			// Admin routes
			if (isAdmin || isSuperAdmin || ['admin', 'super_admin'].includes(effectiveRole || '')) {
				// Only add the Admin Dashboard link when not on admin routes
				if (!isResidentRoute) {
					items.push({
						title: "Admin Dashboard",
						href: adminPath,
						icon: UserCog,
						variant: pathname === adminPath ? "default" : "ghost",
						section: 'admin'
					});
				}

				if (isAdminRoute || pathname === adminPath) {
					// Group admin items by functional areas
					// House details
					items.push(
						{
							title: "House Details",
							href: `${adminPath}/house-details`,
							icon: Building,
							variant: pathname.includes('/admin/house-details') ? "default" : "ghost",
							section: 'admin'
						}
					);

					// People management
					items.push(
						{
							title: "Residents",
							href: `${adminPath}/residents`,
							icon: Users,
							variant: pathname.includes('/admin/residents') ? "default" : "ghost",
							section: 'admin'
						}
					);

					// House operations
					items.push(
						{
							title: "Operations",
							href: `${adminPath}/operations`,
							icon: Wrench,
							variant: pathname.includes('/admin/operations') ? "default" : "ghost",
							section: 'admin'
						}
					);

					// Programming and events
					items.push(
						{
							title: "Events",
							href: `${adminPath}/events`,
							icon: Calendar,
							variant: pathname.includes('/admin/events') ? "default" : "ghost",
							section: 'admin'
						}
					);

					// Growth and business
					items.push(
						{
							title: "Applications",
							href: `${adminPath}/applications`,
							icon: FileText,
							variant: pathname.includes('/admin/applications') ? "default" : "ghost",
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
		}

		// Super Admin routes - always show if the user has permission
		if (isSuperAdmin || effectiveRole === 'super_admin') {
			items.push({
				title: "Organization",
				href: superAdminPath,
				icon: Building,
				variant: pathname === superAdminPath ? "default" : "ghost",
				section: 'superAdmin'
			});

			if (isSuperAdminRoute) {
				items.push(
					{
						title: "Properties",
						href: `${superAdminPath}/houses`,
						icon: Building,
						variant: pathname.includes('/superAdmin/houses') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "People",
						href: `${superAdminPath}/users`,
						icon: Users,
						variant: pathname.includes('/superAdmin/users') ? "default" : "ghost",
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
						title: "Analytics",
						href: `${superAdminPath}/analytics`,
						icon: BarChart3,
						variant: pathname.includes('/superAdmin/analytics') ? "default" : "ghost",
						section: 'superAdmin'
					},
					{
						title: "Expansion",
						href: `${superAdminPath}/expansion`,
						icon: CreditCard,
						variant: pathname.includes('/superAdmin/expansion') ? "default" : "ghost",
						section: 'superAdmin'
					}
				);
			}
		}

		return items;
	}, [
		isApplicant, isResident, isAdmin, isSuperAdmin,
		effectiveRole, hasHouseId,
		dashboardPath,
		residentPath,
		adminPath,
		superAdminPath,
		pathname,
		isResidentRoute,
		isAdminRoute,
		isSuperAdminRoute
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
						<span className="font-bold text-xl">Accelr8</span>
					</Link>
				</div>

				<div className="px-3 flex-1 overflow-auto">
					{/* Main Dashboard */}
					<div className="space-y-1 mb-6">
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
							{/* Group nav items by section */}
							{['switch', 'applicant', 'resident', 'admin', 'superAdmin'].map(section => {
								const sectionItems = roleNavItems.filter(
									item => !item.section || item.section === section
								);

								if (sectionItems.length === 0) return null;

								return (
									<div key={section} className="space-y-1 mb-6">
										{section !== 'switch' && (
											<p className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wider">
												{section === 'applicant'
													? 'Applications'
													: section === 'resident'
														? 'Resident'
														: section === 'admin'
															? 'Admin'
															: 'Super Admin'}
											</p>
										)}
										{sectionItems.map((item) => (
											<Link key={item.href} href={item.href} className="block">
												<Button
													variant={item.variant}
													size="sm"
													className="w-full justify-start rounded-md"
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

				{/* Debug section for route information */}
				{/* {process.env.NODE_ENV === 'development' && (
					<div className="px-3 border-t pt-4 mb-4">
						<div className="bg-muted rounded-md p-2 text-xs text-muted-foreground">
							<p className="font-semibold">Route Debug:</p>
							<p>Path: {pathname}</p>
							<p>Parts: {pathParts.join(', ')}</p>
							<p>Has House ID: {hasHouseId.toString()}</p>
							<p>House ID: {houseId || 'None'}</p>
							<p>Section: {currentSection}</p>
							<p>Auth metadata role: {JSON.stringify(user?.user_metadata) || 'None'}</p>
							<p>Profile role: {userProfile?.role || 'None'}</p>
							<p>Effective role: {effectiveRole || 'None'}</p>
							<p>isAdmin: {isAdmin.toString()}</p>
							<p>isSuperAdmin: {isSuperAdmin.toString()}</p>
							<p>isResident: {isResident.toString()}</p>
							<p>isApplicant: {isApplicant.toString()}</p>
						</div>
					</div>
				)} */}

				{/* Profile and Settings at bottom */}
				<div className={cn("px-3 border-t pt-4 space-y-1", process.env.NODE_ENV === 'development' ? "" : "mt-auto")}>
					{profileNavItems.map((item) => (
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

					<Button
						variant="ghost"
						className="w-full justify-start mt-2"
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