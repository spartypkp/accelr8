"use client";

import DashboardNavbar from "./navbar";
import DashboardSidebar from "./sidebar";
import { DashboardUser } from "./types";

interface DashboardShellProps {
	user: DashboardUser;
	children: React.ReactNode;
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<DashboardNavbar user={user} />
			<div className="flex flex-1">
				<div className="hidden md:block">
					<DashboardSidebar user={user} />
				</div>
				<main className="flex-1 p-6 md:p-8 pt-8">
					{children}
				</main>
			</div>
		</div>
	);
} 