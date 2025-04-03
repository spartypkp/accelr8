"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	MoreHorizontal,
	Plus,
	Search,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock maintenance request data
const MAINTENANCE_REQUESTS = [
	{
		id: "1",
		title: "Broken AC in Room 203",
		description: "The air conditioning unit in room 203 is not cooling properly.",
		status: "open",
		priority: "high",
		resident: "Morgan Davis",
		dateSubmitted: "2023-08-30",
		assignedTo: null,
		room: "203"
	},
	{
		id: "2",
		title: "Leaking faucet in kitchen",
		description: "The main kitchen sink has a slow leak from the faucet.",
		status: "in_progress",
		priority: "medium",
		resident: "Admin",
		dateSubmitted: "2023-08-28",
		assignedTo: "Maintenance Staff",
		room: "Kitchen"
	},
	{
		id: "3",
		title: "Light bulb replacement in hallway",
		description: "Two light bulbs need replacement in the first floor hallway.",
		status: "in_progress",
		priority: "low",
		resident: "Jamie Smith",
		dateSubmitted: "2023-08-25",
		assignedTo: "Maintenance Staff",
		room: "First Floor Hallway"
	},
	{
		id: "4",
		title: "WiFi signal weak in basement",
		description: "The WiFi signal is very weak in the basement area.",
		status: "open",
		priority: "medium",
		resident: "Taylor Williams",
		dateSubmitted: "2023-08-29",
		assignedTo: null,
		room: "Basement"
	},
	{
		id: "5",
		title: "Shower drain clogged",
		description: "The shower in bathroom 2 is draining very slowly.",
		status: "completed",
		priority: "high",
		resident: "Riley Garcia",
		dateSubmitted: "2023-08-20",
		assignedTo: "Plumber",
		room: "Bathroom 2",
		dateResolved: "2023-08-22"
	},
	{
		id: "6",
		title: "Front door lock sticking",
		description: "The front door lock is difficult to turn and sometimes gets stuck.",
		status: "completed",
		priority: "medium",
		resident: "Admin",
		dateSubmitted: "2023-08-15",
		assignedTo: "Locksmith",
		room: "Front Entrance",
		dateResolved: "2023-08-17"
	}
];

export default function OperationsManagementPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	const [searchQuery, setSearchQuery] = useState("");

	// Filter maintenance requests based on search query
	const filteredRequests = MAINTENANCE_REQUESTS.filter(request =>
		request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.resident.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Count requests by status
	const openRequests = MAINTENANCE_REQUESTS.filter(r => r.status === "open").length;
	const inProgressRequests = MAINTENANCE_REQUESTS.filter(r => r.status === "in_progress").length;
	const completedRequests = MAINTENANCE_REQUESTS.filter(r => r.status === "completed").length;

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Operations Management</h1>
						<p className="text-muted-foreground">
							Manage maintenance and operations for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Open Requests</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{openRequests}</div>
							<p className="text-xs text-muted-foreground">
								{openRequests > 0 ? "Needs attention" : "All clear"}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">In Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{inProgressRequests}</div>
							<p className="text-xs text-muted-foreground">
								Currently being addressed
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Completed (30 days)</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{completedRequests}</div>
							<p className="text-xs text-muted-foreground">
								Successfully resolved
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className="pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
						<div>
							<CardTitle>Maintenance Requests</CardTitle>
							<CardDescription>
								Track and manage all maintenance issues
							</CardDescription>
						</div>
						<Button className="mt-2 md:mt-0">
							<Plus className="mr-2 h-4 w-4" />
							New Request
						</Button>
					</CardHeader>
					<CardContent>
						<div className="mb-4 relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search maintenance requests..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Request</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Priority</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Submitted</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRequests.length > 0 ? (
										filteredRequests.map((request) => (
											<TableRow key={request.id}>
												<TableCell>
													<div className="font-medium">{request.title}</div>
													<div className="text-sm text-muted-foreground">
														By: {request.resident}
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															request.status === "open"
																? "destructive"
																: request.status === "in_progress"
																	? "default"
																	: "outline"
														}
													>
														{request.status === "open"
															? "Open"
															: request.status === "in_progress"
																? "In Progress"
																: "Completed"}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={
															request.priority === "high"
																? "text-red-500 border-red-200 bg-red-100/20"
																: request.priority === "medium"
																	? "text-yellow-500 border-yellow-200 bg-yellow-100/20"
																	: "text-green-500 border-green-200 bg-green-100/20"
														}
													>
														{request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
													</Badge>
												</TableCell>
												<TableCell>{request.room}</TableCell>
												<TableCell>
													{new Date(request.dateSubmitted).toLocaleDateString()}
												</TableCell>
												<TableCell>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">Open menu</span>
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-6">
												No maintenance requests found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Priority Maintenance</CardTitle>
							<CardDescription>
								High priority issues requiring attention
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{MAINTENANCE_REQUESTS
									.filter(r => r.priority === "high" && r.status !== "completed")
									.map(request => (
										<div key={request.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
											<div className="rounded-full p-1.5 bg-red-100">
												<AlertTriangle className="h-4 w-4 text-red-500" />
											</div>
											<div className="space-y-1">
												<p className="font-medium">{request.title}</p>
												<p className="text-sm text-muted-foreground">{request.room}</p>
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="mr-1 h-3 w-3" />
													<span>Submitted {new Date(request.dateSubmitted).toLocaleDateString()}</span>
												</div>
											</div>
										</div>
									))}
								{MAINTENANCE_REQUESTS.filter(r => r.priority === "high" && r.status !== "completed").length === 0 && (
									<p className="text-sm text-muted-foreground py-2">No high-priority issues at this time.</p>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recently Completed</CardTitle>
							<CardDescription>
								Maintenance issues resolved in the last 30 days
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{MAINTENANCE_REQUESTS
									.filter(r => r.status === "completed")
									.map(request => (
										<div key={request.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
											<div className="rounded-full p-1.5 bg-green-100">
												<CheckCircle2 className="h-4 w-4 text-green-500" />
											</div>
											<div className="space-y-1">
												<p className="font-medium">{request.title}</p>
												<p className="text-sm text-muted-foreground">{request.room}</p>
												<div className="flex items-center text-sm text-muted-foreground">
													<span>Resolved {request.dateResolved}</span>
												</div>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
} 