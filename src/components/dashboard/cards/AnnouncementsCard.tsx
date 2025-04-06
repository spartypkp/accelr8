'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AlertCircle, BellIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface Announcement {
	id: string;
	title: string;
	content: string;
	priority: "low" | "medium" | "high";
	created_at: string;
	created_by: string;
	sanity_house_id: string;
	expires_at: string | null;
}

interface AnnouncementsCardProps {
	houseId: string;
	limit?: number;
	showAllLink?: boolean;
	className?: string;
}

const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId, limit] = url.split('/').slice(-3);

	const { data, error } = await supabase
		.from("announcements")
		.select("*")
		.eq("sanity_house_id", houseId)
		.is("expires_at", null)
		.order("created_at", { ascending: false })
		.order("priority", { ascending: false })
		.limit(parseInt(limit));

	if (error) throw error;
	return data;
};

export function AnnouncementsCard({
	houseId,
	limit = 3,
	showAllLink = true,
	className
}: AnnouncementsCardProps) {
	const { data, error, isLoading } = useSWR<Announcement[]>(
		`/api/announcements/${houseId}/${limit}`,
		fetcher
	);

	// Priority colors mapping
	const getPriorityColor = (priority: Announcement['priority']) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-600';
			case 'medium':
				return 'bg-amber-100 text-amber-600';
			case 'low':
			default:
				return 'bg-blue-100 text-blue-600';
		}
	};

	return (
		<DashboardCard
			title="Announcements"
			titleIcon={<BellIcon className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			fullHeight
			className={className}
		>
			{data && data.length > 0 ? (
				<div className="space-y-4">
					{data.map((announcement) => (
						<div
							key={announcement.id}
							className={cn(
								"p-3 rounded-lg",
								announcement.priority === 'high' ? 'bg-red-50' :
									announcement.priority === 'medium' ? 'bg-amber-50' :
										'bg-blue-50'
							)}
						>
							<div className="flex items-start gap-3">
								<div className={cn(
									"p-1.5 rounded-md mt-0.5",
									getPriorityColor(announcement.priority)
								)}>
									<AlertCircle className="h-4 w-4" />
								</div>
								<div className="space-y-1">
									<h3 className="font-medium text-sm">
										{announcement.title}
									</h3>
									<p className="text-xs text-muted-foreground line-clamp-2">
										{announcement.content}
									</p>
									<p className="text-xs text-muted-foreground">
										Posted on {new Date(announcement.created_at).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>
					))}

					{showAllLink && (
						<Button variant="outline" size="sm" className="w-full" asChild>
							<Link href={`/dashboard/${houseId}/announcements`}>
								View All Announcements
							</Link>
						</Button>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-40 text-center">
					<BellIcon className="h-10 w-10 text-muted-foreground/60 mb-2" />
					<p className="text-sm text-muted-foreground">No announcements</p>
					{showAllLink && (
						<Button variant="outline" size="sm" className="mt-4" asChild>
							<Link href={`/dashboard/${houseId}/announcements`}>
								View All Announcements
							</Link>
						</Button>
					)}
				</div>
			)}
		</DashboardCard>
	);
} 