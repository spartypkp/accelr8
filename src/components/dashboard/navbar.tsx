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
import { signOut } from "@/lib/auth-utils";
import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";
import { WithUserProps } from "./types";

export default function DashboardNavbar({ user }: WithUserProps) {
	// Create initials from name or email
	const firstInitial = user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase();
	const lastInitial = user.name ? (user.name.includes(" ") ? user.name.split(" ").pop()?.charAt(0) || "" : "") : "";
	const initials = firstInitial + lastInitial;

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/login";
	};

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<MobileSidebar user={user} />

			<div className="mr-4 hidden md:flex">
				<Link href="/" className="mr-6 flex items-center gap-2">
					<span className="font-bold">Accelr8</span>
				</Link>
				<nav className="flex items-center gap-6 text-sm">
					<Link
						href="/dashboard"
						className="transition-colors hover:text-foreground/80 text-foreground/60"
					>
						Dashboard
					</Link>
					<Link
						href="/dashboard/community"
						className="transition-colors hover:text-foreground/80 text-foreground/60"
					>
						Community
					</Link>
					<Link
						href="/dashboard/events"
						className="transition-colors hover:text-foreground/80 text-foreground/60"
					>
						Events
					</Link>
					<Link
						href="/dashboard/resources"
						className="transition-colors hover:text-foreground/80 text-foreground/60"
					>
						Resources
					</Link>
				</nav>
			</div>

			<div className="flex-1"></div>

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
						<Link href="/dashboard/profile">
							<User className="w-4 h-4 mr-2" />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings">
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