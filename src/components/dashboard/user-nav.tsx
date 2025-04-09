"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/UserContext";
import { urlFor } from "@/lib/sanity/client";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
export function UserNav() {
	const { user, userProfile, signOut } = useUser();

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/login";
	};

	// Get initials for avatar fallback
	const getInitials = () => {
		if (!userProfile?.sanityPerson?.name) return "AC";

		const nameParts = userProfile.sanityPerson.name.split(' ');
		if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
		return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
	};

	// Get avatar image URL safely
	const getAvatarUrl = () => {
		if (!userProfile?.sanityPerson?.profileImage) return "";
		return urlFor(userProfile.sanityPerson.profileImage).height(100).width(100).url();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={getAvatarUrl()} alt={userProfile?.sanityPerson?.name || "User"} />
						<AvatarFallback>{getInitials()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{userProfile?.sanityPerson?.name || 'User'}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email || ''}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/profile">
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
} 