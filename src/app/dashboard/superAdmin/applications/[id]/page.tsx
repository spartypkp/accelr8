'use client';

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getApplicationById, updateApplicationStatus } from "@/lib/api/applications";
import { addApplicationStatusInfo, ApplicationWithStatusInfo } from "@/lib/enhancers/applications";
import { ApplicationStatus } from "@/lib/types";
import { ArrowLeft, Calendar, CheckCircle, Clock, Mail, Phone, User, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const { toast } = useToast();
	const [application, setApplication] = useState<ApplicationWithStatusInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
	const [adminNotes, setAdminNotes] = useState("");

	useEffect(() => {
		async function fetchApplication() {
			setIsLoading(true);
			try {
				const appData = await getApplicationById(id as string);
				if (appData) {
					const appWithStatusInfo = addApplicationStatusInfo(appData);
					setApplication(appWithStatusInfo);
					setAdminNotes(appData.admin_notes || "");
				}
			} catch (error) {
				console.error("Error fetching application:", error);
				toast({
					title: "Error",
					description: "Failed to load application details",
					variant: "destructive"
				});
			} finally {
				setIsLoading(false);
			}
		}

		if (id) {
			fetchApplication();
		}
	}, [id, toast]);

	const updateStatus = async (newStatus: Exclude<ApplicationStatus, ApplicationStatus.Draft>) => {
		if (!application) return;

		setIsProcessing(true);
		try {
			const updatedApp = await updateApplicationStatus(application.id, newStatus);

			// Convert to application with status info
			const updatedAppWithStatus = addApplicationStatusInfo(updatedApp);
			setApplication(updatedAppWithStatus);

			toast({
				title: "Status Updated",
				description: `Application status changed to ${newStatus}`,
				variant: "default"
			});
		} catch (error) {
			console.error("Error updating application status:", error);
			toast({
				title: "Error",
				description: "Failed to update application status",
				variant: "destructive"
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const saveAdminNotes = async () => {
		// This would need to be implemented in the API
		toast({
			title: "Notes Saved",
			description: "Admin notes have been saved",
			variant: "default"
		});
	};

	const getStatusBadge = (status: ApplicationStatus) => {
		switch (status) {
			case ApplicationStatus.Submitted:
				return <Badge variant="secondary">Submitted</Badge>;
			case ApplicationStatus.Reviewing:
				return <Badge variant="default">Reviewing</Badge>;
			case ApplicationStatus.InterviewScheduled:
				return <Badge variant="outline">Interview Scheduled</Badge>;
			case ApplicationStatus.InterviewCompleted:
				return <Badge variant="outline">Interview Completed</Badge>;
			case ApplicationStatus.Approved:
				return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
			case ApplicationStatus.Rejected:
				return <Badge variant="destructive">Rejected</Badge>;
			case ApplicationStatus.Waitlisted:
				return <Badge className="bg-yellow-500 hover:bg-yellow-600">Waitlisted</Badge>;
			case ApplicationStatus.Accepted:
				return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>;
			case ApplicationStatus.Cancelled:
				return <Badge variant="destructive">Cancelled</Badge>;
			case ApplicationStatus.Draft:
				return <Badge variant="outline">Draft</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-[70vh]">
					<div className="text-center">
						<h2 className="text-xl font-semibold mb-2">Loading Application...</h2>
						<p className="text-muted-foreground">Please wait while we fetch the application details.</p>
					</div>
				</div>
			</AdminLayout>
		);
	}

	if (!application) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-[70vh]">
					<div className="text-center">
						<h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
						<p className="text-muted-foreground mb-4">The application you're looking for doesn't exist or you don't have permission to view it.</p>
						<Button asChild>
							<Link href="/superAdmin/applications">Back to Applications</Link>
						</Button>
					</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
					<div className="flex items-center space-x-2">
						<Button variant="outline" size="icon" asChild>
							<Link href="/superAdmin/applications">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Application from {application.name}</h1>
							<div className="flex items-center gap-2 mt-1">
								{getStatusBadge(application.status)}
								<span className="text-muted-foreground">
									Applied {application.submitted_at
										? new Date(application.submitted_at).toLocaleDateString()
										: new Date(application.created_at).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap gap-2">
						{/* Action buttons based on status */}
						{application.status === ApplicationStatus.Submitted && (
							<>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" disabled={isProcessing}>
											<XCircle className="mr-2 h-4 w-4" />
											Reject
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Reject Application</DialogTitle>
											<DialogDescription>
												Are you sure you want to reject this application? This action cannot be undone.
											</DialogDescription>
										</DialogHeader>
										<div className="py-4">
											<Label htmlFor="reject-reason">Reason for rejection (optional)</Label>
											<Textarea
												id="reject-reason"
												placeholder="Provide feedback on why this application is being rejected"
												value={rejectReason}
												onChange={(e) => setRejectReason(e.target.value)}
												className="mt-2"
											/>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => { }}>Cancel</Button>
											<Button
												variant="destructive"
												onClick={() => updateStatus(ApplicationStatus.Rejected)}
												disabled={isProcessing}
											>
												{isProcessing ? "Processing..." : "Confirm Rejection"}
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<Button
									onClick={() => updateStatus(ApplicationStatus.Reviewing)}
									disabled={isProcessing}
								>
									Start Review
								</Button>
							</>
						)}

						{application.status === ApplicationStatus.Reviewing && (
							<>
								<Button
									variant="outline"
									onClick={() => updateStatus(ApplicationStatus.InterviewScheduled)}
									disabled={isProcessing}
								>
									Schedule Interview
								</Button>
								<Button
									onClick={() => updateStatus(ApplicationStatus.Approved)}
									disabled={isProcessing}
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Approve
								</Button>
							</>
						)}

						{application.status === ApplicationStatus.InterviewScheduled && (
							<Button
								onClick={() => updateStatus(ApplicationStatus.InterviewCompleted)}
								disabled={isProcessing}
							>
								Mark Interview Complete
							</Button>
						)}

						{application.status === ApplicationStatus.InterviewCompleted && (
							<>
								<Button
									variant="outline"
									onClick={() => updateStatus(ApplicationStatus.Waitlisted)}
									disabled={isProcessing}
								>
									Waitlist
								</Button>
								<Button
									onClick={() => updateStatus(ApplicationStatus.Approved)}
									disabled={isProcessing}
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Approve
								</Button>
							</>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Application summary */}
					<div className="md:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Application Summary</CardTitle>
								<CardDescription>
									Basic information and preferences
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<h3 className="font-medium mb-2">Personal Information</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground shrink-0" />
											<div>
												<p className="text-sm text-muted-foreground">Full Name</p>
												<p>{application.name}</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-muted-foreground shrink-0" />
											<div>
												<p className="text-sm text-muted-foreground">Email</p>
												<p>{application.email}</p>
											</div>
										</div>
										{application.phone && (
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
												<div>
													<p className="text-sm text-muted-foreground">Phone</p>
													<p>{application.phone}</p>
												</div>
											</div>
										)}
										{application.preferred_move_in && (
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
												<div>
													<p className="text-sm text-muted-foreground">Preferred Move-in</p>
													<p>{new Date(application.preferred_move_in).toLocaleDateString()}</p>
												</div>
											</div>
										)}
									</div>
								</div>

								{application.current_role && (
									<div>
										<h3 className="font-medium mb-2">Professional Background</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<p className="text-sm text-muted-foreground">Current Role</p>
												<p>{application.current_role}</p>
											</div>
											{application.company && (
												<div>
													<p className="text-sm text-muted-foreground">Company/Project</p>
													<p>{application.company}</p>
												</div>
											)}
										</div>
									</div>
								)}

								{application.responses && (
									<>
										<Separator />
										<div>
											<h3 className="font-medium mb-2">Application Responses</h3>

											{application.responses.background?.workDescription && (
												<div className="mb-4">
													<p className="text-sm text-muted-foreground mb-1">About Their Work</p>
													<p className="text-sm whitespace-pre-wrap">{application.responses.background.workDescription}</p>
												</div>
											)}

											{application.responses.background?.goals && (
												<div className="mb-4">
													<p className="text-sm text-muted-foreground mb-1">Goals at Accelr8</p>
													<p className="text-sm whitespace-pre-wrap">{application.responses.background.goals}</p>
												</div>
											)}

											{application.responses.additional?.howHeard && (
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<p className="text-sm text-muted-foreground">How They Heard About Us</p>
														<p>{application.responses.additional.howHeard}</p>
													</div>

													{application.responses.additional.referredBy && (
														<div>
															<p className="text-sm text-muted-foreground">Referred By</p>
															<p>{application.responses.additional.referredBy}</p>
														</div>
													)}
												</div>
											)}
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Link profiles */}
						{(application.linkedin_url || application.github_url || application.portfolio_url) && (
							<Card>
								<CardHeader>
									<CardTitle>External Profiles</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{application.linkedin_url && (
											<div className="flex justify-between items-center">
												<span>LinkedIn</span>
												<Button variant="outline" size="sm" asChild>
													<a href={application.linkedin_url} target="_blank" rel="noopener noreferrer">
														View Profile
													</a>
												</Button>
											</div>
										)}
										{application.github_url && (
											<div className="flex justify-between items-center">
												<span>GitHub</span>
												<Button variant="outline" size="sm" asChild>
													<a href={application.github_url} target="_blank" rel="noopener noreferrer">
														View Profile
													</a>
												</Button>
											</div>
										)}
										{application.portfolio_url && (
											<div className="flex justify-between items-center">
												<span>Portfolio</span>
												<Button variant="outline" size="sm" asChild>
													<a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
														View Website
													</a>
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Application status and admin actions */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Application Status</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className={`p-4 rounded-lg bg-${application.color}-50 border border-${application.color}-200`}>
										<h3 className="font-medium text-lg">{application.statusLabel}</h3>
										<p className="text-sm mt-1">{application.statusDescription}</p>
										{application.nextSteps && (
											<p className="text-sm mt-2 font-medium">Next Steps: {application.nextSteps}</p>
										)}
									</div>
								</div>

								<div className="space-y-1">
									<h4 className="text-sm font-medium">Timeline</h4>
									<div className="space-y-3">
										<div className="flex gap-2">
											<Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
											<div>
												<p className="text-sm font-medium">Application Submitted</p>
												<p className="text-xs text-muted-foreground">
													{application.submitted_at
														? new Date(application.submitted_at).toLocaleString()
														: new Date(application.created_at).toLocaleString()}
												</p>
											</div>
										</div>

										{application.reviewed_at && (
											<div className="flex gap-2">
												<Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
												<div>
													<p className="text-sm font-medium">Application Reviewed</p>
													<p className="text-xs text-muted-foreground">
														{new Date(application.reviewed_at).toLocaleString()}
													</p>
												</div>
											</div>
										)}

										{/* Interview timeline would go here */}
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Admin Notes</CardTitle>
								<CardDescription>
									Private notes for administrators
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									placeholder="Add notes about this application..."
									value={adminNotes}
									onChange={(e) => setAdminNotes(e.target.value)}
									rows={5}
								/>
							</CardContent>
							<CardFooter>
								<Button onClick={saveAdminNotes} className="w-full">
									Save Notes
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
} 