"use client";

import { MobileSidebar, Sidebar } from "./sidebar";
import { UserNav } from "./user-nav";

interface DashboardShellProps {
	children: React.ReactNode;
	title?: string;
}

export default function DashboardShell({ children, title }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					<MobileSidebar className="md:hidden" />
					{title && (
						<h1 className="font-semibold text-lg ml-4 md:ml-0">{title}</h1>
					)}
					<div className="ml-auto flex items-center space-x-4">
						<UserNav />
					</div>
				</div>
			</div>
			<div className="flex flex-1">
				<div className="hidden md:block">
					<Sidebar className="w-64 h-[calc(100vh-4rem)] border-r" />
				</div>
				<main className="flex-1 p-6 md:p-8 pt-8 overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	);
} 