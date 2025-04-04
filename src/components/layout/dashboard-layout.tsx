'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent
} from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';
import {
	Bell,
	Building,
	Calendar,
	CreditCard,
	Home,
	Info,
	LogOut,
	Menu,
	Settings,
	User,
	Users,
	Wrench,
	X
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();
	const params = useParams();
	const houseId = params?.houseId as string;
	const { user, signOut } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Mock data - will be replaced with actual data from API
	const houseName = houseId === "sf" ? "San Francisco House" :
		houseId === "nyc" ? "New York House" :
			houseId === "seattle" ? "Seattle House" : "Accelr8 House";

	const navItems = [
		{ name: 'Dashboard', href: `/dashboard/${houseId}`, icon: <Home className="h-5 w-5" /> },
		{ name: 'Community', href: `/dashboard/${houseId}/community`, icon: <Users className="h-5 w-5" /> },
		{ name: 'Events', href: `/dashboard/${houseId}/events`, icon: <Calendar className="h-5 w-5" /> },
		{ name: 'Resources', href: `/dashboard/${houseId}/resources`, icon: <Building className="h-5 w-5" /> },
		{ name: 'Maintenance', href: `/dashboard/${houseId}/maintenance`, icon: <Wrench className="h-5 w-5" /> },
		{ name: 'House Info', href: `/dashboard/${houseId}/info`, icon: <Info className="h-5 w-5" /> },
		{ name: 'Billing', href: `/dashboard/${houseId}/billing`, icon: <CreditCard className="h-5 w-5" /> },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Top navigation */}
			<header className="bg-background border-b border-border shadow-sm fixed top-0 inset-x-0 z-30">
				<div className="flex items-center justify-between h-16 px-4">
					{/* Left side - Logo and Menu */}
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden mr-2"
							onClick={() => setSidebarOpen(true)}
						>
							<Menu className="h-6 w-6" />
							<span className="sr-only">Open sidebar</span>
						</Button>

						<Link href={`/dashboard/${houseId}`} className="flex items-center">
							<span className="text-xl font-bold bg-gradient-primary text-transparent bg-clip-text">
								Accelr8
							</span>
						</Link>
					</div>

					{/* Center - House selector */}
					<div className="hidden md:flex items-center justify-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="inline-flex items-center">
									<Building className="h-4 w-4 mr-2" />
									{houseName}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/sf">San Francisco House</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/nyc">New York House</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/seattle">Seattle House</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Right side - Notifications and User menu */}
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="h-5 w-5" />
							<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
						</Button>

						<Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
							<Link href="/">
								<Home className="h-4 w-4 mr-2" />
								View Site
							</Link>
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="relative h-8 w-8 rounded-full">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder-user.jpg" alt="User" />
										<AvatarFallback>
											{user?.email?.charAt(0).toUpperCase() || 'U'}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user?.email?.split('@')[0] || 'Resident'}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user?.email || 'resident@accelr8.io'}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href={`/dashboard/${houseId}/profile`}>
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href={`/dashboard/${houseId}/settings`}>
											<Settings className="mr-2 h-4 w-4" />
											<span>Settings</span>
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => signOut && signOut()}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Sidebar - desktop version */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col z-20">
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border pt-16">
					<nav className="flex flex-1 flex-col px-2 py-4">
						<ul className="space-y-1">
							{navItems.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className={cn(
											"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
											pathname === item.href || (item.href !== `/dashboard/${houseId}` && pathname?.startsWith(item.href))
												? "bg-muted text-primary"
												: "text-foreground hover:bg-muted/50"
										)}
									>
										<div className={cn(
											"mr-3",
											pathname === item.href || (item.href !== `/dashboard/${houseId}` && pathname?.startsWith(item.href))
												? "text-primary"
												: "text-muted-foreground group-hover:text-foreground"
										)}>
											{item.icon}
										</div>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="px-3 py-4 border-t border-border">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<Avatar className="h-8 w-8">
									<AvatarImage src="/placeholder-user.jpg" alt="User" />
									<AvatarFallback>
										{user?.email?.charAt(0).toUpperCase() || 'U'}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-foreground">
									{user?.email?.split('@')[0] || 'Resident'}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{user?.email || 'resident@accelr8.io'}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile sidebar */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="w-60 p-0">
					<div className="flex h-full flex-col">
						<div className="flex items-center justify-between border-b border-border h-16 px-4">
							<Link href={`/dashboard/${houseId}`} className="flex items-center" onClick={() => setSidebarOpen(false)}>
								<span className="text-xl font-bold bg-gradient-primary text-transparent bg-clip-text">
									Accelr8
								</span>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSidebarOpen(false)}
							>
								<X className="h-5 w-5" />
								<span className="sr-only">Close sidebar</span>
							</Button>
						</div>

						{/* House selector - mobile */}
						<div className="px-4 py-2 border-b border-border">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="w-full justify-start">
										<Building className="h-4 w-4 mr-2" />
										{houseName}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/sf" onClick={() => setSidebarOpen(false)}>
											San Francisco House
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/nyc" onClick={() => setSidebarOpen(false)}>
											New York House
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/seattle" onClick={() => setSidebarOpen(false)}>
											Seattle House
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<nav className="flex flex-1 flex-col px-2 py-4">
							<ul className="space-y-1">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={cn(
												"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
												pathname === item.href || (item.href !== `/dashboard/${houseId}` && pathname?.startsWith(item.href))
													? "bg-muted text-primary"
													: "text-foreground hover:bg-muted/50"
											)}
											onClick={() => setSidebarOpen(false)}
										>
											<div className={cn(
												"mr-3",
												pathname === item.href || (item.href !== `/dashboard/${houseId}` && pathname?.startsWith(item.href))
													? "text-primary"
													: "text-muted-foreground group-hover:text-foreground"
											)}>
												{item.icon}
											</div>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className="px-3 py-4 border-t border-border">
							<Button variant="outline" size="sm" className="w-full" onClick={() => signOut && signOut()}>
								<LogOut className="h-4 w-4 mr-2" />
								Log out
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<main className="md:pl-60 pt-16">
				{children}
			</main>
		</div>
	);
} 