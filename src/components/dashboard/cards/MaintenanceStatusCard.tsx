import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, CheckCircle2, Clock, MessageSquare, Timer, Wrench } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface MaintenanceRequest {
	id: string;
	sanity_house_id: string;
	room_id?: string;
	requested_by: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high' | 'emergency';
	status: 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
	location?: string;
	room_details?: string;
	assigned_to?: string;
	resolution_notes?: string;
	estimated_completion?: string;
	actual_completion?: string;
	created_at?: string;
	updated_at?: string;
}

interface MaintenanceComment {
	id: string;
	maintenance_request_id: string;
	user_id: string;
	user_name?: string;
	comment: string;
	is_internal: boolean;
	created_at?: string;
}

interface MaintenanceStatusCardProps {
	requestId: string;
	houseId: string;
	onUpdateStatus?: (status: MaintenanceRequest['status']) => void;
	onAddComment?: (comment: string) => void;
	className?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, requestId, houseId] = url.split('/').slice(-3);

	// In a real implementation, this would fetch from Supabase
	// For now, return mock data
	const mockRequest: MaintenanceRequest = {
		id: requestId,
		sanity_house_id: houseId,
		requested_by: "user123",
		title: "Broken light fixture in kitchen",
		description: "The overhead light in the kitchen area is flickering and sometimes doesn't turn on at all. It started happening yesterday evening.",
		priority: "medium",
		status: "in_progress",
		location: "Kitchen",
		room_details: "Common Area",
		assigned_to: "maintenance@accelr8.com",
		resolution_notes: "Technician will arrive on Thursday between 2-4pm with replacement parts.",
		estimated_completion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
		created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
		updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
	};

	// Mock comments
	const mockComments: MaintenanceComment[] = [
		{
			id: "comment1",
			maintenance_request_id: requestId,
			user_id: "user123",
			user_name: "Jamie Smith",
			comment: "The light is completely out now, not just flickering.",
			is_internal: false,
			created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
		},
		{
			id: "comment2",
			maintenance_request_id: requestId,
			user_id: "admin456",
			user_name: "Maintenance Team",
			comment: "We've scheduled a technician to come replace the fixture on Thursday.",
			is_internal: false,
			created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
		}
	];

	return { request: mockRequest, comments: mockComments };
};

export function MaintenanceStatusCard({ requestId, houseId, onUpdateStatus, onAddComment, className }: MaintenanceStatusCardProps) {
	const { data, error, isLoading, mutate } = useSWR(
		`/api/maintenance/${requestId}/${houseId}`,
		fetcher
	);
	const [newComment, setNewComment] = useState("");
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);

	const getStatusIcon = (status: MaintenanceRequest['status']) => {
		switch (status) {
			case 'open':
				return <AlertCircle className="h-5 w-5 text-red-500" />;
			case 'assigned':
				return <Calendar className="h-5 w-5 text-blue-500" />;
			case 'in_progress':
				return <Wrench className="h-5 w-5 text-amber-500" />;
			case 'waiting_parts':
				return <Timer className="h-5 w-5 text-purple-500" />;
			case 'completed':
				return <CheckCircle2 className="h-5 w-5 text-green-500" />;
			default:
				return <Clock className="h-5 w-5 text-gray-500" />;
		}
	};

	const getStatusText = (status: MaintenanceRequest['status']) => {
		switch (status) {
			case 'open':
				return "Open - Awaiting review";
			case 'assigned':
				return "Scheduled for service";
			case 'in_progress':
				return "In progress";
			case 'waiting_parts':
				return "Waiting for parts";
			case 'completed':
				return "Completed";
			case 'cancelled':
				return "Cancelled";
			default:
				return (status as string).replace(/_/g, ' ');
		}
	};

	const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
		switch (priority) {
			case 'low':
				return "bg-green-100 text-green-800 border-green-200";
			case 'medium':
				return "bg-amber-100 text-amber-800 border-amber-200";
			case 'high':
				return "bg-red-100 text-red-800 border-red-200";
			case 'emergency':
				return "bg-red-100 text-red-800 border-red-200 animate-pulse";
			default:
				return "bg-slate-100 text-slate-800 border-slate-200";
		}
	};

	const handleSubmitComment = async () => {
		if (!newComment.trim() || !data) return;

		setIsSubmittingComment(true);
		try {
			// In a real implementation, this would call an API
			// For now, just simulate adding a comment
			const newCommentObj: MaintenanceComment = {
				id: `comment${Date.now()}`,
				maintenance_request_id: requestId,
				user_id: "current_user", // This would be the actual user ID
				user_name: "You",
				comment: newComment,
				is_internal: false,
				created_at: new Date().toISOString()
			};

			// Update the local data
			await mutate({
				request: data.request,
				comments: [...data.comments, newCommentObj]
			}, false);

			// Call the callback if provided
			if (onAddComment) {
				onAddComment(newComment);
			}

			// Clear the input
			setNewComment("");
		} finally {
			setIsSubmittingComment(false);
		}
	};

	const handleUpdateStatus = (newStatus: MaintenanceRequest['status']) => {
		if (!data) return;

		// In a real implementation, this would call an API
		// For now, just simulate updating the status
		mutate({
			request: { ...data.request, status: newStatus },
			comments: data.comments
		}, false);

		if (onUpdateStatus) {
			onUpdateStatus(newStatus);
		}
	};

	return (
		<DashboardCard
			title="Maintenance Request Status"
			titleIcon={<Wrench className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			className={className}
			fullHeight
		>
			{data && (
				<div className="space-y-4">
					{/* Request Header */}
					<div className={cn("px-4 py-3 -mx-4 -mt-2 bg-muted/50",
						data.request.priority === "high" || data.request.priority === "emergency" ? "border-l-4 border-red-500" : "")}>
						<div className="flex justify-between items-start">
							<h3 className="text-lg font-semibold">{data.request.title}</h3>
							<Badge className={getPriorityColor(data.request.priority)}>
								{data.request.priority.charAt(0).toUpperCase() + data.request.priority.slice(1)} Priority
							</Badge>
						</div>
						<div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
							<div className="flex items-center">
								<Clock className="h-4 w-4 mr-1.5" />
								<span>Submitted {new Date(data.request.created_at || '').toLocaleDateString()}</span>
							</div>
							<div className="flex items-center">
								<Wrench className="h-4 w-4 mr-1.5" />
								<span>{data.request.location} {data.request.room_details && `• ${data.request.room_details}`}</span>
							</div>
						</div>
					</div>

					{/* Request Description */}
					<div>
						<h4 className="text-sm font-medium mb-1">Description</h4>
						<p className="text-sm">{data.request.description}</p>
					</div>

					{/* Current Status */}
					<div className="bg-muted/30 rounded-md p-3">
						<div className="flex items-center">
							{getStatusIcon(data.request.status)}
							<div className="ml-3">
								<h4 className="text-sm font-medium">Current Status: {getStatusText(data.request.status)}</h4>
								{data.request.status === "assigned" && data.request.estimated_completion && (
									<p className="text-sm text-muted-foreground">
										Scheduled for {new Date(data.request.estimated_completion).toLocaleDateString()} at {
											new Date(data.request.estimated_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
										}
									</p>
								)}
								{data.request.status === "in_progress" && data.request.assigned_to && (
									<p className="text-sm text-muted-foreground">
										Being handled by {data.request.assigned_to}
									</p>
								)}
								{data.request.status === "completed" && data.request.actual_completion && (
									<p className="text-sm text-muted-foreground">
										Completed on {new Date(data.request.actual_completion).toLocaleDateString()}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Comments Section */}
					<div>
						<h4 className="text-sm font-medium mb-2">Updates & Comments</h4>
						<div className="space-y-3 max-h-[200px] overflow-y-auto mb-3">
							{data.comments.map((comment) => (
								<div key={comment.id} className="bg-muted/20 rounded-md p-3">
									<div className="flex items-start">
										<Avatar className="h-7 w-7 mr-2">
											<AvatarImage src={`/placeholder-user-${comment.user_id}.jpg`} alt={comment.user_name || ""} />
											<AvatarFallback>{comment.user_name?.[0] || "U"}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex justify-between">
												<p className="text-sm font-medium">{comment.user_name || "User"}</p>
												<p className="text-xs text-muted-foreground">
													{new Date(comment.created_at || '').toLocaleDateString()}
												</p>
											</div>
											<p className="text-sm">{comment.comment}</p>
										</div>
									</div>
								</div>
							))}
							{data.comments.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
							)}
						</div>

						{/* Add Comment */}
						{data.request.status !== "completed" && data.request.status !== "cancelled" && (
							<div className="mt-4 flex items-end gap-2">
								<div className="flex-1">
									<label htmlFor="new-comment" className="text-xs font-medium mb-1 block">
										Add a comment
									</label>
									<textarea
										id="new-comment"
										rows={2}
										placeholder="Add additional details or questions..."
										className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
									></textarea>
								</div>
								<Button
									size="sm"
									onClick={handleSubmitComment}
									disabled={!newComment.trim() || isSubmittingComment}
								>
									<MessageSquare className="h-4 w-4 mr-2" />
									Send
								</Button>
							</div>
						)}
					</div>

					{/* Actions */}
					{data.request.status !== "completed" && data.request.status !== "cancelled" && (
						<div className="pt-2 mt-4 border-t">
							<h4 className="text-sm font-medium mb-2">Update Status</h4>
							<div className="flex flex-wrap gap-2">
								{(data.request.status as MaintenanceRequest['status']) !== "cancelled" && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleUpdateStatus("cancelled")}
									>
										Cancel Request
									</Button>
								)}
								{(data.request.status as MaintenanceRequest['status']) !== "completed" && (
									<Button
										variant="default"
										size="sm"
										onClick={() => handleUpdateStatus("completed")}
									>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										Mark as Completed
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</DashboardCard>
	);
} 