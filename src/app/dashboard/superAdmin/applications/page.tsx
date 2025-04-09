'use client';

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApplications } from "@/lib/api/applications";
import { EnhancedApplication } from "@/lib/enhancers/applications";
import { ApplicationStatus } from "@/lib/types";
import { ArrowRight, Calendar, Check, Clock, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [applications, setApplications] = useState<EnhancedApplication[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
	const [status, setStatus] = useState<ApplicationStatus | 'all'>(
		(searchParams.get('status') as ApplicationStatus | 'all') || 'all'
	);

	// Get applications with filters
	useEffect(() => {
		async function fetchApplications() {
			setIsLoading(true);
			try {
				// Build query options based on filters
				const options: {
					status?: ApplicationStatus | 'all';
					search?: string;
				} = {};

				if (status && status !== 'all') {
					options.status = status;
				}

				if (searchTerm) {
					options.search = searchTerm;
				}

				const applicationsData = await getApplications(options);
				setApplications(applicationsData);
			} catch (error) {
				console.error("Error fetching applications:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchApplications();
	}, [status, searchTerm]);

	// Handle search submit
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Update URL with search params without full page refresh
		const params = new URLSearchParams(searchParams);
		if (searchTerm) {
			params.set('search', searchTerm);
		} else {
			params.delete('search');
		}
		router.push(`/superAdmin/applications?${params.toString()}`);
	};

	// Handle status change
	const handleStatusChange = (value: ApplicationStatus | 'all') => {
		setStatus(value);
		// Update URL with status param
		const params = new URLSearchParams(searchParams);
		if (value && value !== 'all') {
			params.set('status', value);
		} else {
			params.delete('status');
		}
		router.push(`/superAdmin/applications?${params.toString()}`);
	};

	// Get status badge color
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
				return <Badge variant="success">Approved</Badge>;
			case ApplicationStatus.Rejected:
				return <Badge variant="destructive">Rejected</Badge>;
			case ApplicationStatus.Waitlisted:
				return <Badge variant="secondary">Waitlisted</Badge>;
			case ApplicationStatus.Accepted:
				return <Badge variant="success">Accepted</Badge>;
			case ApplicationStatus.Cancelled:
				return <Badge variant="destructive">Cancelled</Badge>;
			case ApplicationStatus.Draft:
				return <Badge variant="outline">Draft</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Applications</h1>
						<p className="text-muted-foreground">
							Review and manage applicants for Accelr8 houses
						</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					{/* Search and filters */}
					<Card className="w-full md:w-64 shrink-0">
						<CardHeader>
							<CardTitle>Filters</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<form onSubmit={handleSearch}>
								<div className="space-y-2">
									<Label htmlFor="search">Search</Label>
									<div className="flex gap-2">
										<Input
											id="search"
											placeholder="Name or email"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
										<Button type="submit" size="icon" variant="outline">
											<Search className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</form>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select value={status} onValueChange={handleStatusChange}>
									<SelectTrigger id="status">
										<SelectValue placeholder="All Statuses" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										<SelectItem value={ApplicationStatus.Submitted}>Submitted</SelectItem>
										<SelectItem value={ApplicationStatus.Reviewing}>Reviewing</SelectItem>
										<SelectItem value={ApplicationStatus.InterviewScheduled}>Interview Scheduled</SelectItem>
										<SelectItem value={ApplicationStatus.InterviewCompleted}>Interview Completed</SelectItem>
										<SelectItem value={ApplicationStatus.Approved}>Approved</SelectItem>
										<SelectItem value={ApplicationStatus.Rejected}>Rejected</SelectItem>
										<SelectItem value={ApplicationStatus.Waitlisted}>Waitlisted</SelectItem>
										<SelectItem value={ApplicationStatus.Accepted}>Accepted</SelectItem>
										<SelectItem value={ApplicationStatus.Draft}>Draft</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Applications list */}
					<div className="flex-1">
						<Tabs defaultValue="all" className="w-full">
							<TabsList>
								<TabsTrigger value="all">All Applications</TabsTrigger>
								<TabsTrigger value="pending">Pending Review</TabsTrigger>
								<TabsTrigger value="interview">Interviews</TabsTrigger>
								<TabsTrigger value="approved">Approved</TabsTrigger>
							</TabsList>

							<TabsContent value="all" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>All Applications</CardTitle>
										<CardDescription>
											Showing {applications.length} applications
										</CardDescription>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="py-20 text-center text-muted-foreground">
												Loading applications...
											</div>
										) : applications.length === 0 ? (
											<div className="py-20 text-center text-muted-foreground">
												No applications found matching your criteria.
											</div>
										) : (
											<div className="space-y-4">
												{applications.map((application) => (
													<div
														key={application.id}
														className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
													>
														<div className="space-y-1 mb-2 sm:mb-0">
															<div className="flex items-center gap-2">
																<h3 className="font-medium">{application.name}</h3>
																{getStatusBadge(application.status)}
															</div>
															<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
																<div className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	<span>
																		Applied: {application.submitted_at
																			? new Date(application.submitted_at).toLocaleDateString()
																			: new Date(application.created_at).toLocaleDateString()}
																	</span>
																</div>
																{application.preferred_move_in && (
																	<div className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" />
																		<span>
																			Move-in: {new Date(application.preferred_move_in).toLocaleDateString()}
																		</span>
																	</div>
																)}
															</div>
														</div>
														<Button asChild variant="outline" size="sm">
															<Link href={`/superAdmin/applications/${application.id}`}>
																Review <ArrowRight className="ml-2 h-4 w-4" />
															</Link>
														</Button>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="pending" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Pending Review</CardTitle>
										<CardDescription>
											Applications awaiting initial review
										</CardDescription>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="py-6 text-center text-muted-foreground">Loading...</div>
										) : (
											<div className="space-y-4">
												{applications
													.filter(app => app.status === ApplicationStatus.Submitted)
													.map((application) => (
														<div
															key={application.id}
															className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
														>
															<div className="space-y-1 mb-2 sm:mb-0">
																<div className="flex items-center gap-2">
																	<h3 className="font-medium">{application.name}</h3>
																	<Badge variant="secondary">Submitted</Badge>
																</div>
																<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
																	<div className="flex items-center gap-1">
																		<Clock className="h-3 w-3" />
																		<span>
																			Applied: {application.submitted_at
																				? new Date(application.submitted_at).toLocaleDateString()
																				: new Date(application.created_at).toLocaleDateString()}
																		</span>
																	</div>
																	{application.preferred_move_in && (
																		<div className="flex items-center gap-1">
																			<Calendar className="h-3 w-3" />
																			<span>
																				Move-in: {new Date(application.preferred_move_in).toLocaleDateString()}
																			</span>
																		</div>
																	)}
																</div>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	className="w-full sm:w-auto"
																	onClick={() => {
																		// Quick reject without review
																		// This would need to be implemented
																	}}
																>
																	<X className="mr-2 h-4 w-4" />
																	Reject
																</Button>
																<Button asChild size="sm" className="w-full sm:w-auto">
																	<Link href={`/superAdmin/applications/${application.id}`}>
																		<Check className="mr-2 h-4 w-4" />
																		Review
																	</Link>
																</Button>
															</div>
														</div>
													))}

												{applications.filter(app => app.status === ApplicationStatus.Submitted).length === 0 && (
													<div className="py-10 text-center text-muted-foreground">
														No pending applications at this time.
													</div>
												)}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="interview" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Interviews</CardTitle>
										<CardDescription>
											Applications with scheduled or completed interviews
										</CardDescription>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="py-6 text-center text-muted-foreground">Loading...</div>
										) : (
											<div className="space-y-4">
												{applications
													.filter(app => app.status === ApplicationStatus.InterviewScheduled || app.status === ApplicationStatus.InterviewCompleted)
													.map((application) => (
														<div
															key={application.id}
															className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
														>
															<div className="space-y-1 mb-2 sm:mb-0">
																<div className="flex items-center gap-2">
																	<h3 className="font-medium">{application.name}</h3>
																	{application.status === ApplicationStatus.InterviewScheduled ? (
																		<Badge variant="outline">Interview Scheduled</Badge>
																	) : (
																		<Badge variant="outline">Interview Completed</Badge>
																	)}
																</div>
																<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
																	{application.interviews && application.interviews[0] && (
																		<div className="flex items-center gap-1">
																			<Calendar className="h-3 w-3" />
																			<span>
																				Interview: {new Date(application.interviews[0].scheduled_time).toLocaleString()}
																			</span>
																		</div>
																	)}
																</div>
															</div>
															<Button asChild variant="outline" size="sm">
																<Link href={`/superAdmin/applications/${application.id}`}>
																	Review <ArrowRight className="ml-2 h-4 w-4" />
																</Link>
															</Button>
														</div>
													))}

												{applications.filter(app =>
													app.status === ApplicationStatus.InterviewScheduled || app.status === ApplicationStatus.InterviewCompleted
												).length === 0 && (
														<div className="py-10 text-center text-muted-foreground">
															No applications in interview stage.
														</div>
													)}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="approved" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Approved Applications</CardTitle>
										<CardDescription>
											Applications that have been approved
										</CardDescription>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="py-6 text-center text-muted-foreground">Loading...</div>
										) : (
											<div className="space-y-4">
												{applications
													.filter(app => app.status === ApplicationStatus.Approved || app.status === ApplicationStatus.Accepted)
													.map((application) => (
														<div
															key={application.id}
															className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
														>
															<div className="space-y-1 mb-2 sm:mb-0">
																<div className="flex items-center gap-2">
																	<h3 className="font-medium">{application.name}</h3>
																	{application.status === ApplicationStatus.Approved ? (
																		<Badge variant="success">Approved</Badge>
																	) : (
																		<Badge variant="success">Accepted</Badge>
																	)}
																</div>
																<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
																	{application.preferred_move_in && (
																		<div className="flex items-center gap-1">
																			<Calendar className="h-3 w-3" />
																			<span>
																				Move-in: {new Date(application.preferred_move_in).toLocaleDateString()}
																			</span>
																		</div>
																	)}
																</div>
															</div>
															<Button asChild variant="outline" size="sm">
																<Link href={`/superAdmin/applications/${application.id}`}>
																	View <ArrowRight className="ml-2 h-4 w-4" />
																</Link>
															</Button>
														</div>
													))}

												{applications.filter(app =>
													app.status === ApplicationStatus.Approved || app.status === ApplicationStatus.Accepted
												).length === 0 && (
														<div className="py-10 text-center text-muted-foreground">
															No approved applications.
														</div>
													)}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
} 