"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/UserContext";
import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";
import { WithUserProps } from "./types";
export default function DashboardNavbar({ user }: WithUserProps) {
	const pathname = usePathname();
	const pathParts = pathname.split("/");

	// Extract houseId and section from URL
	const houseId = pathParts.length > 2 ? pathParts[2] : undefined;
	const isAdmin = pathname.includes('/admin');
	const section = isAdmin ? 'admin' : 'resident';
	const basePath = houseId ? `/dashboard/${houseId}/${section}` : '/dashboard';

	// Create initials from name or email
	const firstInitial = user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase();
	const lastInitial = user.name ? (user.name.includes(" ") ? user.name.split(" ").pop()?.charAt(0) || "" : "") : "";
	const initials = firstInitial + lastInitial;
	const { signOut } = useUser();

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/login";
	};

	// Define navbar links based on current section
	const navLinks = isAdmin
		? [
			{ title: "Dashboard", href: `${basePath}` },
			{ title: "Residents", href: `${basePath}/residents` },
			{ title: "Operations", href: `${basePath}/operations` },
			{ title: "Events", href: `${basePath}/events` },
		]
		: [
			{ title: "Dashboard", href: `${basePath}` },
			{ title: "Community", href: `${basePath}/community` },
			{ title: "Events", href: `${basePath}/events` },
			{ title: "Resources", href: `${basePath}/resources` },
		];

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<MobileSidebar user={user} />

			<div className="mr-4 hidden md:flex">
				<Link href="/dashboard" className="mr-6 flex items-center gap-2">
					<span className="font-bold">Accelr8</span>
				</Link>
				<nav className="flex items-center gap-6 text-sm">
					{houseId && navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`transition-colors hover:text-foreground/80 ${pathname === link.href ? 'text-foreground font-medium' : 'text-foreground/60'
								}`}
						>
							{link.title}
						</Link>
					))}
				</nav>
			</div>

			<div className="flex-1"></div>

			{/* View toggle button for admins */}
			{houseId && (user?.role === "admin" || user?.role === "super_admin") && (
				<Button variant="outline" asChild className="mr-2">
					<Link
						href={`/dashboard/${houseId}/${isAdmin ? 'resident' : 'admin'}`}
					>
						Switch to {isAdmin ? 'Resident' : 'Admin'} View
					</Link>
				</Button>
			)}

			<Button variant="outline" size="icon" className="relative">
				<Bell className="h-5 w-5" />
				<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600"></span>
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-9 w-9 rounded-full"
						size="icon"
					>
						<Avatar className="h-9 w-9">
							<AvatarImage
								src={user?.profile?.image?.url || ""}
								alt={user.name || user.email}
							/>
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<div className="flex items-center justify-start gap-2 p-2">
						<div className="flex flex-col space-y-0.5 leading-none">
							<p className="font-medium text-sm">{user.name || user.email}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={houseId ? `${basePath}/profile` : "/dashboard/profile"}>
							<User className="w-4 h-4 mr-2" />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={houseId ? `${basePath}/settings` : "/dashboard/settings"}>
							<Settings className="w-4 h-4 mr-2" />
							Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleSignOut}>
						<LogOut className="w-4 h-4 mr-2" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
} 