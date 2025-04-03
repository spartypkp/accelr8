"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	Calendar,
	Edit,
	Filter,
	Mail,
	MoreHorizontal,
	Search,
	Trash,
	UserPlus
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock resident data
const RESIDENTS = [
	{
		id: "1",
		name: "Alex Johnson",
		email: "alex@example.com",
		moveInDate: "2023-01-15",
		moveOutDate: "2023-07-15",
		status: "active",
		roomNumber: "101",
		rentStatus: "paid"
	},
	{
		id: "2",
		name: "Jamie Smith",
		email: "jamie@example.com",
		moveInDate: "2023-02-01",
		moveOutDate: null,
		status: "active",
		roomNumber: "102",
		rentStatus: "paid"
	},
	{
		id: "3",
		name: "Taylor Williams",
		email: "taylor@example.com",
		moveInDate: "2023-03-10",
		moveOutDate: null,
		status: "active",
		roomNumber: "103",
		rentStatus: "overdue"
	},
	{
		id: "4",
		name: "Morgan Davis",
		email: "morgan@example.com",
		moveInDate: "2022-11-01",
		moveOutDate: "2023-05-01",
		status: "former",
		roomNumber: "104",
		rentStatus: "paid"
	},
	{
		id: "5",
		name: "Riley Garcia",
		email: "riley@example.com",
		moveInDate: "2023-06-01",
		moveOutDate: null,
		status: "active",
		roomNumber: "105",
		rentStatus: "pending"
	},
	{
		id: "6",
		name: "Jordan Miller",
		email: "jordan@example.com",
		moveInDate: "2023-07-15",
		moveOutDate: null,
		status: "upcoming",
		roomNumber: "106",
		rentStatus: "pending"
	}
];

export default function ResidentManagementPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	// Filter residents based on search query and status
	const filteredResidents = RESIDENTS.filter(resident => {
		const matchesSearch =
			resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resident.roomNumber.includes(searchQuery);

		const matchesStatus =
			statusFilter === "all" ||
			resident.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Resident Management</h1>
						<p className="text-muted-foreground">
							Manage residents for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>

					<div className="flex gap-2">
						<Dialog>
							<DialogTrigger asChild>
								<Button>
									<UserPlus className="mr-2 h-4 w-4" />
									Add Resident
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Resident</DialogTitle>
									<DialogDescription>
										Create a new resident profile for this house.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label htmlFor="name" className="text-sm font-medium">
												Full Name
											</label>
											<Input id="name" placeholder="Enter name" />
										</div>
										<div className="space-y-2">
											<label htmlFor="email" className="text-sm font-medium">
												Email
											</label>
											<Input id="email" type="email" placeholder="Enter email" />
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label htmlFor="moveInDate" className="text-sm font-medium">
												Move-in Date
											</label>
											<Input id="moveInDate" type="date" />
										</div>
										<div className="space-y-2">
											<label htmlFor="roomNumber" className="text-sm font-medium">
												Room Number
											</label>
											<Input id="roomNumber" placeholder="Room #" />
										</div>
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit">Add Resident</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Residents</CardTitle>
						<CardDescription>
							View and manage all residents of the house.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<div className="relative flex-1">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search by name, email, or room..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<Filter className="mr-2 h-4 w-4" />
										Filter: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-[200px]">
									<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => setStatusFilter("all")}>
										All Residents
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("active")}>
										Active
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>
										Upcoming
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("former")}>
										Former
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Room</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Move-in Date</TableHead>
										<TableHead>Rent Status</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredResidents.length > 0 ? (
										filteredResidents.map((resident) => (
											<TableRow key={resident.id}>
												<TableCell>
													<div className="font-medium">{resident.name}</div>
													<div className="text-sm text-muted-foreground">{resident.email}</div>
												</TableCell>
												<TableCell>{resident.roomNumber}</TableCell>
												<TableCell>
													<Badge
														variant={
															resident.status === "active"
																? "default"
																: resident.status === "upcoming"
																	? "secondary"
																	: "outline"
														}
													>
														{resident.status}
													</Badge>
												</TableCell>
												<TableCell>{new Date(resident.moveInDate).toLocaleDateString()}</TableCell>
												<TableCell>
													<Badge
														variant={
															resident.rentStatus === "paid"
																? "success"
																: resident.rentStatus === "pending"
																	? "secondary"
																	: "destructive"
														}
													>
														{resident.rentStatus}
													</Badge>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
																<span className="sr-only">Open menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem>
																<Edit className="mr-2 h-4 w-4" />
																Edit Profile
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Mail className="mr-2 h-4 w-4" />
																Send Message
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Calendar className="mr-2 h-4 w-4" />
																Manage Stay
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																<Trash className="mr-2 h-4 w-4" />
																Remove Resident
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-6">
												No residents found matching your filters.
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
							<CardTitle>Upcoming Moves</CardTitle>
							<CardDescription>
								Scheduled move-ins and move-outs
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium mb-2">Move-ins (Next 30 days)</h3>
									{RESIDENTS.filter(r => r.status === 'upcoming').length > 0 ? (
										RESIDENTS.filter(r => r.status === 'upcoming').map(resident => (
											<div key={resident.id} className="flex justify-between items-center py-2 border-b last:border-0">
												<div>
													<p className="font-medium">{resident.name}</p>
													<p className="text-sm text-muted-foreground">Room {resident.roomNumber}</p>
												</div>
												<div className="text-sm">
													{new Date(resident.moveInDate).toLocaleDateString()}
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No upcoming move-ins.</p>
									)}
								</div>

								<div>
									<h3 className="text-sm font-medium mb-2">Move-outs (Next 30 days)</h3>
									{RESIDENTS.filter(r => r.status === 'active' && r.moveOutDate !== null).length > 0 ? (
										RESIDENTS.filter(r => r.status === 'active' && r.moveOutDate !== null).map(resident => (
											<div key={resident.id} className="flex justify-between items-center py-2 border-b last:border-0">
												<div>
													<p className="font-medium">{resident.name}</p>
													<p className="text-sm text-muted-foreground">Room {resident.roomNumber}</p>
												</div>
												<div className="text-sm">
													{resident.moveOutDate ? new Date(resident.moveOutDate).toLocaleDateString() : 'N/A'}
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No upcoming move-outs.</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Resident Alerts</CardTitle>
							<CardDescription>
								Issues requiring attention
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{RESIDENTS.filter(r => r.rentStatus === 'overdue').length > 0 ? (
									RESIDENTS.filter(r => r.rentStatus === 'overdue').map(resident => (
										<div key={resident.id} className="flex items-center justify-between border-b pb-3 last:border-0">
											<div>
												<div className="font-medium">{resident.name}</div>
												<div className="text-sm text-muted-foreground">Room {resident.roomNumber}</div>
											</div>
											<Badge variant="destructive">Rent Overdue</Badge>
										</div>
									))
								) : (
									<p className="text-sm text-muted-foreground">No urgent alerts.</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
} 