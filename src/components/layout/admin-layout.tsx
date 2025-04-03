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
	BarChart3,
	Building,
	Calendar,
	Home,
	LogOut,
	Menu,
	Settings,
	User,
	Users,
	X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminLayoutProps {
	children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const pathname = usePathname();
	const { user, signOut } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navItems = [
		{ name: 'Dashboard', href: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
		{ name: 'Houses', href: '/admin/houses', icon: <Building className="h-5 w-5" /> },
		{ name: 'Residents', href: '/admin/residents', icon: <Users className="h-5 w-5" /> },
		{ name: 'Applications', href: '/admin/applications', icon: <User className="h-5 w-5" /> },
		{ name: 'Events', href: '/admin/events', icon: <Calendar className="h-5 w-5" /> },
		{ name: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
	];

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			{/* Top navigation */}
			<header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 inset-x-0 z-30">
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

						<Link href="/admin" className="flex items-center">
							<span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Accelr8 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Admin</span>
							</span>
						</Link>
					</div>

					{/* Right side - User menu */}
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" asChild>
							<Link href="/" className="hidden sm:flex">
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
											{user?.email?.charAt(0).toUpperCase() || 'A'}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user?.email?.split('@')[0] || 'Admin User'}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user?.email || 'admin@accelr8.io'}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href="/admin/profile">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/admin/settings">
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
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16">
					<nav className="flex flex-1 flex-col px-2 py-4">
						<ul className="space-y-1">
							{navItems.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className={cn(
											"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
											pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
												? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
												: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
										)}
									>
										<div className={cn(
											"mr-3",
											pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
												? "text-blue-600 dark:text-blue-400"
												: "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
										)}>
											{item.icon}
										</div>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<Avatar className="h-8 w-8">
									<AvatarImage src="/placeholder-user.jpg" alt="User" />
									<AvatarFallback>
										{user?.email?.charAt(0).toUpperCase() || 'A'}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{user?.email?.split('@')[0] || 'Admin User'}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{user?.email || 'admin@accelr8.io'}
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
						<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 h-16 px-4">
							<Link href="/admin" className="flex items-center" onClick={() => setSidebarOpen(false)}>
								<span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
									Accelr8 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Admin</span>
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

						<nav className="flex flex-1 flex-col px-2 py-4">
							<ul className="space-y-1">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={cn(
												"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
												pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
													? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
													: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
											)}
											onClick={() => setSidebarOpen(false)}
										>
											<div className={cn(
												"mr-3",
												pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
													? "text-blue-600 dark:text-blue-400"
													: "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
											)}>
												{item.icon}
											</div>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
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