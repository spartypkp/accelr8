"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import DashboardSidebar from "./sidebar";
import { WithUserProps } from "./types";

export function MobileSidebar({ user }: WithUserProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<div className="h-full">
					<DashboardSidebar user={user} />
				</div>
			</SheetContent>
		</Sheet>
	);
} 