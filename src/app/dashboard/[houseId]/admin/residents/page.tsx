'use client';

import { InviteResidentModal } from '@/components/admin/residents/InviteResidentModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsersByHouse } from '@/lib/api/users';
import { UserProfile } from '@/lib/types';
import { Download, Filter, MoreHorizontal, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ResidentsManagement({ params }: { params: { houseId: string; }; }) {
	const [inviteModalOpen, setInviteModalOpen] = useState(false);
	const [residents, setResidents] = useState<UserProfile[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch residents when the component mounts
	useEffect(() => {
		async function fetchResidents() {
			try {
				setIsLoading(true);
				const houseResidents = await getUsersByHouse(params.houseId);
				setResidents(houseResidents);
			} catch (error) {
				console.error('Error fetching residents:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchResidents();
	}, [params.houseId]);

	// Function to refresh residents after successful invitation
	const refreshResidents = async () => {
		try {
			setIsLoading(true);
			const houseResidents = await getUsersByHouse(params.houseId);
			setResidents(houseResidents);
		} catch (error) {
			console.error('Error refreshing residents:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Residents Management</h1>
				<div className="flex gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Button onClick={() => setInviteModalOpen(true)}>
						<UserPlus className="mr-2 h-4 w-4" />
						Add Resident
					</Button>
				</div>
			</div>

			<Tabs defaultValue="current" className="space-y-4">
				<TabsList>
					<TabsTrigger value="current">Current Residents</TabsTrigger>
					<TabsTrigger value="pending">Pending Move-Ins</TabsTrigger>
					<TabsTrigger value="applications">Applications</TabsTrigger>
					<TabsTrigger value="alumni">Alumni</TabsTrigger>
				</TabsList>

				<TabsContent value="current">
					<Card>
						<CardHeader>
							<CardTitle>Current Residents</CardTitle>
							<CardDescription>
								Manage residents currently living in the house
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center py-4 gap-2">
								<Input
									placeholder="Search residents..."
									className="max-w-sm"
								/>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm">
											<Filter className="mr-2 h-4 w-4" />
											Filter
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-[200px]">
										<DropdownMenuLabel>Filter by</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Room Type</DropdownMenuItem>
										<DropdownMenuItem>Move-in Date</DropdownMenuItem>
										<DropdownMenuItem>Field</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Select>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Room Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Room Type</SelectLabel>
											<SelectItem value="all">All Rooms</SelectItem>
											<SelectItem value="single">Single</SelectItem>
											<SelectItem value="double">Double</SelectItem>
											<SelectItem value="suite">Suite</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Room</TableHead>
										<TableHead>Move-in Date</TableHead>
										<TableHead>Company/Project</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={7} className="text-center py-10">
												Loading residents...
											</TableCell>
										</TableRow>
									) : residents.length > 0 ? (
										residents.map((resident) => (
											<TableRow key={resident.id}>
												<TableCell className="font-medium">
													{resident.sanityPerson?.name || resident.email?.split('@')[0]}
												</TableCell>
												<TableCell>{resident.email}</TableCell>
												<TableCell>
													{/* Room will be managed separately in the future */}
													Not Assigned
												</TableCell>
												<TableCell>
													{resident.sanityPerson?.startDate ?
														new Date(resident.sanityPerson.startDate).toLocaleDateString() :
														"Not specified"}
												</TableCell>
												<TableCell>{resident.sanityPerson?.company || "Not specified"}</TableCell>
												<TableCell>
													<Badge variant="default" className="bg-green-500">Active</Badge>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" className="h-8 w-8 p-0">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem>View Profile</DropdownMenuItem>
															<DropdownMenuItem>Edit Details</DropdownMenuItem>
															<DropdownMenuItem>Change Room</DropdownMenuItem>
															<DropdownMenuItem>Process Move-out</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} className="text-center py-10">
												No residents found. Invite some residents to get started.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pending">
					<Card>
						<CardHeader>
							<CardTitle>Pending Move-Ins</CardTitle>
							<CardDescription>
								Manage residents who are approved but haven't moved in yet
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex h-[300px] items-center justify-center border rounded-md">
								<p className="text-sm text-muted-foreground">Coming soon</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="applications">
					<Card>
						<CardHeader>
							<CardTitle>Applications</CardTitle>
							<CardDescription>
								Review and process applicants
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex h-[300px] items-center justify-center border rounded-md">
								<p className="text-sm text-muted-foreground">Coming soon</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="alumni">
					<Card>
						<CardHeader>
							<CardTitle>Alumni</CardTitle>
							<CardDescription>
								Former residents who have moved out
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex h-[300px] items-center justify-center border rounded-md">
								<p className="text-sm text-muted-foreground">Coming soon</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Invite Resident Modal */}
			<InviteResidentModal
				open={inviteModalOpen}
				onOpenChange={setInviteModalOpen}
				houseId={params.houseId}
				onSuccess={refreshResidents}
			/>
		</div>
	);
} 