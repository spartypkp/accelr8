'use client';

import { ResidentsListCard } from "@/components/dashboard/cards/ResidentsListCard";
import { DashboardPanel, DashboardPanelSingle } from "@/components/dashboard/panels/DashboardPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Code,
	MessageSquare,
	Users
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Import other components as needed for community page tabs

export default function CommunityPage() {
	const params = useParams();
	const houseId = params?.houseId as string;

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Community</h1>
					<p className="text-muted-foreground">{houseName}</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<Button variant="outline" size="sm" asChild>
						<Link href={`/dashboard/${houseId}/community/projects`}>
							<Code className="h-4 w-4 mr-2" />
							View Projects
						</Link>
					</Button>
					<Button size="sm">
						<MessageSquare className="h-4 w-4 mr-2" />
						Message Board
					</Button>
				</div>
			</div>

			<Tabs defaultValue="residents" className="space-y-6">
				<TabsList>
					<TabsTrigger value="residents">Residents</TabsTrigger>
					<TabsTrigger value="topics">Topics & Channels</TabsTrigger>
					<TabsTrigger value="collaborate">Collaborate</TabsTrigger>
				</TabsList>

				{/* Residents Tab */}
				<TabsContent value="residents">
					<DashboardPanelSingle>
						<ResidentsListCard houseId={houseId} />
					</DashboardPanelSingle>
				</TabsContent>

				{/* Topics Tab */}
				<TabsContent value="topics">
					<DashboardPanel>
						{/* Will add topic cards here */}
						<TopicsPlaceholder />
					</DashboardPanel>
				</TabsContent>

				{/* Collaborate Tab */}
				<TabsContent value="collaborate">
					<DashboardPanel>
						{/* Will add collaboration opportunity cards here */}
						<CollaborationPlaceholder />
					</DashboardPanel>
				</TabsContent>
			</Tabs>
		</div>
	);
}

// Placeholder components until we implement the other cards
function TopicsPlaceholder() {
	return (
		<div className="col-span-3 flex items-center justify-center h-64 border rounded-lg border-dashed">
			<div className="text-center">
				<Users className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
				<h3 className="text-lg font-medium">Topics & Channels</h3>
				<p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
					This tab will display community interest topics and discussion channels.
				</p>
			</div>
		</div>
	);
}

function CollaborationPlaceholder() {
	return (
		<div className="col-span-3 flex items-center justify-center h-64 border rounded-lg border-dashed">
			<div className="text-center">
				<Code className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
				<h3 className="text-lg font-medium">Collaboration Opportunities</h3>
				<p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
					This tab will display opportunities to collaborate with other residents.
				</p>
			</div>
		</div>
	);
} 