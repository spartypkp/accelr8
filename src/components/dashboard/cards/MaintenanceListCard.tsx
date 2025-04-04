import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Clock, FilePlus, Plus, Search, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

export interface MaintenanceRequest {
	id: string;
	title: string;
	description: string;
	status: 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'scheduled' | 'completed' | 'cancelled';
	priority: 'low' | 'medium' | 'high' | 'emergency';
	created_at: string;
	updated_at: string;
	category: string;
	assigned_to?: string;
	assigned_name?: string;
	scheduled_date?: string;
	location: string;
	room_details?: string;
}

export interface MaintenanceListCardProps {
	limit?: number;
	showFilters?: boolean;
	showAddButton?: boolean;
	className?: string;
	onCreateClick?: () => void;
}

async function fetcher(houseId: string, limit = 25) {
	// In a real implementation, this would fetch from Supabase
	const supabase = createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// Mock data for demonstration
	const mockData: MaintenanceRequest[] = [
		{
			id: "1",
			title: "Broken kitchen faucet",
			description: "The kitchen faucet is leaking and needs repair",
			status: "open",
			priority: "medium",
			created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
			updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
			category: "plumbing",
			location: "Kitchen",
		},
		{
			id: "2",
			title: "Flickering lights in hallway",
			description: "The lights in the main hallway are flickering and need to be replaced",
			status: "assigned",
			priority: "medium",
			created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
			updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
			category: "electrical",
			assigned_to: "tech1",
			assigned_name: "John Technician",
			location: "Hallway",
		},
		{
			id: "3",
			title: "AC not cooling properly",
			description: "The air conditioning in my room is not cooling properly",
			status: "in_progress",
			priority: "high",
			created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
			updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
			category: "hvac",
			assigned_to: "tech2",
			assigned_name: "Alice Repair",
			location: "Bedroom",
			room_details: "Room 3"
		},
		{
			id: "4",
			title: "Cracked window",
			description: "There's a crack in my bedroom window that needs to be fixed",
			status: "scheduled",
			priority: "medium",
			created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
			updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
			category: "other",
			assigned_to: "tech3",
			assigned_name: "Bob Builder",
			scheduled_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
			location: "Bedroom",
			room_details: "Room 5"
		},
		{
			id: "5",
			title: "Dishwasher not draining",
			description: "The dishwasher isn't draining properly after cycles",
			status: "waiting_parts",
			priority: "medium",
			created_at: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
			updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
			category: "appliance",
			assigned_to: "tech1",
			assigned_name: "John Technician",
			location: "Kitchen",
		},
		{
			id: "6",
			title: "Broken chair in common area",
			description: "One of the chairs in the common area has a broken leg",
			status: "completed",
			priority: "low",
			created_at: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
			updated_at: new Date(Date.now() - 86400000 * 18).toISOString(),
			category: "furniture",
			location: "Common Area",
		},
	];

	return mockData.slice(0, limit);
}

export function MaintenanceListCard({
	limit = 10,
	showFilters = true,
	showAddButton = true,
	className,
	onCreateClick
}: MaintenanceListCardProps) {
	const params = useParams();
	const router = useRouter();
	const houseId = params.houseId as string;

	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState<string>('all');

	const { data: requests, error, isLoading } = useSWR(
		['maintenanceRequests', houseId, limit],
		() => fetcher(houseId, limit),
		{ refreshInterval: 30000 } // Refresh every 30 seconds
	);

	// Filter requests based on search query and active tab
	const filteredRequests = requests?.filter(request => {
		// Text search filter
		const matchesSearch = searchQuery === '' ||
			request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(request.room_details?.toLowerCase().includes(searchQuery.toLowerCase()));

		// Status tab filter
		let matchesTab = true;
		if (activeTab === 'active') {
			matchesTab = ['open', 'assigned', 'in_progress', 'waiting_parts', 'scheduled'].includes(request.status);
		} else if (activeTab === 'completed') {
			matchesTab = request.status === 'completed';
		} else if (activeTab === 'cancelled') {
			matchesTab = request.status === 'cancelled';
		}

		return matchesSearch && matchesTab;
	});

	const handleCreateRequest = () => {
		if (onCreateClick) {
			onCreateClick();
		} else {
			router.push(`/dashboard/${houseId}/maintenance/new`);
		}
	};

	// Status badge colors
	const getStatusColor = (status: MaintenanceRequest['status']) => {
		switch (status) {
			case 'open': return 'bg-red-500';
			case 'assigned': return 'bg-orange-500';
			case 'in_progress': return 'bg-blue-500';
			case 'waiting_parts': return 'bg-purple-500';
			case 'scheduled': return 'bg-yellow-500';
			case 'completed': return 'bg-green-500';
			case 'cancelled': return 'bg-gray-500';
			default: return 'bg-gray-500';
		}
	};

	// Priority badge colors
	const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
		switch (priority) {
			case 'low': return 'bg-gray-500';
			case 'medium': return 'bg-blue-500';
			case 'high': return 'bg-red-500';
			case 'emergency': return 'bg-red-800';
			default: return 'bg-gray-500';
		}
	};

	// Format status for display
	const formatStatus = (status: MaintenanceRequest['status']) => {
		return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
	};

	return (
		<DashboardCard
			title="Maintenance Requests"
			titleIcon={<Wrench className="h-4 w-4" />}
			className={className}
			headerAction={
				showAddButton ? (
					<Button size="sm" onClick={handleCreateRequest}>
						<Plus className="h-4 w-4 mr-1" />
						New Request
					</Button>
				) : undefined
			}
		>
			{showFilters && (
				<div className="mb-4 space-y-3">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search maintenance requests..."
							className="pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="active">Active</TabsTrigger>
							<TabsTrigger value="completed">Completed</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			)}

			{isLoading ? (
				<div className="flex justify-center items-center py-8">
					<div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
				</div>
			) : error ? (
				<div className="text-center py-8 text-destructive">
					<p>Error loading maintenance requests</p>
					<Button variant="outline" size="sm" className="mt-2" onClick={() => router.refresh()}>
						Try Again
					</Button>
				</div>
			) : filteredRequests && filteredRequests.length > 0 ? (
				<div className="space-y-3">
					{filteredRequests.map((request) => (
						<Link
							key={request.id}
							href={`/dashboard/${houseId}/maintenance/${request.id}`}
							className="block"
						>
							<Card className="hover:bg-muted/50 transition-colors">
								<CardHeader className="pb-2 pt-3 px-3">
									<div className="flex justify-between">
										<Badge className={cn("capitalize", getStatusColor(request.status))}>
											{formatStatus(request.status)}
										</Badge>
										<Badge className={cn(getPriorityColor(request.priority), "capitalize")}>
											{request.priority}
										</Badge>
									</div>
									<CardTitle className="text-base font-medium mt-1">{request.title}</CardTitle>
								</CardHeader>
								<CardContent className="px-3 pb-3">
									<div className="text-sm text-muted-foreground">
										<div className="flex justify-between mb-1">
											<span className="font-medium text-xs text-foreground">Location:</span>
											<span>{request.location} {request.room_details && `(${request.room_details})`}</span>
										</div>

										{request.status === 'scheduled' && request.scheduled_date && (
											<div className="flex justify-between mb-1">
												<span className="font-medium text-xs text-foreground">Scheduled:</span>
												<span className="flex items-center">
													<Clock className="h-3 w-3 mr-1" />
													{new Date(request.scheduled_date).toLocaleDateString()}
												</span>
											</div>
										)}

										{(request.status === 'assigned' || request.status === 'in_progress' || request.status === 'waiting_parts') && request.assigned_name && (
											<div className="flex justify-between mb-1">
												<span className="font-medium text-xs text-foreground">Assigned to:</span>
												<span>{request.assigned_name}</span>
											</div>
										)}

										<div className="flex justify-between text-xs text-muted-foreground">
											<span>#{request.id.substring(0, 6)}</span>
											<span>{formatDistanceToNow(new Date(request.created_at))} ago</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}

					{(limit < 10 || filteredRequests.length === limit) && (
						<div className="pt-2 text-center">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.push(`/dashboard/${houseId}/maintenance`)}
							>
								View All Maintenance Requests
							</Button>
						</div>
					)}
				</div>
			) : (
				<div className="text-center py-8">
					<FilePlus className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
					<h3 className="text-lg font-medium mb-1">No maintenance requests</h3>
					<p className="text-sm text-muted-foreground mb-4">
						{searchQuery ? 'No requests match your search criteria' : 'You have no active maintenance requests'}
					</p>
					<Button onClick={handleCreateRequest}>
						<Plus className="h-4 w-4 mr-2" />
						Submit a Request
					</Button>
				</div>
			)}
		</DashboardCard>
	);
} 