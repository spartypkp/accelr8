import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Dialog,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowUpDown,
	Calendar,
	Check,
	DownloadCloud,
	Edit,
	ExternalLink,
	Eye,
	FileText,
	MoreHorizontal,
	Plus,
	RefreshCw,
	Save,
	Settings,
	Trash2,
	User
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "House Admin | Accelr8",
	description: "Manage house details, residents, and applications",
};

// Mock data - would be fetched from backend in production
const getHouseData = (houseId: string) => {
	return {
		id: 'sf-nob-hill',
		name: 'San Francisco - Nob Hill',
		location: 'San Francisco, CA',
		address: '1551 Larkin Street, San Francisco, CA 94109',
		description: 'Our flagship location in the heart of San Francisco with stunning city views and easy access to the tech ecosystem.',
		available: true,
		capacity: 20,
		occupied: 18,
		openApplications: 12,
		pendingTours: 3,
		totalRooms: 15,
		availableRooms: 2,
		roomTypes: [
			{ type: 'Private Room', total: 8, available: 1, price: '$2,200' },
			{ type: 'Premium Private', total: 4, available: 0, price: '$2,800' },
			{ type: 'Shared Room', total: 3, available: 1, price: '$1,400' },
		],
	};
};

const getResidents = () => {
	return [
		{
			id: '1',
			name: 'Sarah Johnson',
			email: 'sarah@example.com',
			room: 'Private Room 101',
			moveInDate: '2023-06-15',
			moveOutDate: '2023-12-15',
			status: 'active',
			rent: '$2,200',
			balance: '$0',
			lastPayment: '2023-11-01',
		},
		{
			id: '2',
			name: 'Michael Chen',
			email: 'michael@example.com',
			room: 'Premium Private 201',
			moveInDate: '2023-04-01',
			moveOutDate: '2024-04-01',
			status: 'active',
			rent: '$2,800',
			balance: '$0',
			lastPayment: '2023-11-02',
		},
		{
			id: '3',
			name: 'Jessica Liu',
			email: 'jessica@example.com',
			room: 'Shared Room 301',
			moveInDate: '2023-09-01',
			moveOutDate: '2024-03-01',
			status: 'active',
			rent: '$1,400',
			balance: '$1,400',
			lastPayment: '2023-10-01',
		},
		{
			id: '4',
			name: 'Alex Thompson',
			email: 'alex@example.com',
			room: 'Private Room 102',
			moveInDate: '2023-01-15',
			moveOutDate: '2023-11-30',
			status: 'leaving',
			rent: '$2,200',
			balance: '$0',
			lastPayment: '2023-11-01',
		},
	];
};

const getApplications = () => {
	return [
		{
			id: 'app-001',
			name: 'David Kim',
			email: 'david@example.com',
			appliedDate: '2023-11-01',
			preferredMoveIn: '2023-12-15',
			roomPreference: 'Private Room',
			status: 'Under Review',
			notes: 'YC W23 founder, referred by current resident',
		},
		{
			id: 'app-002',
			name: 'Priya Patel',
			email: 'priya@example.com',
			appliedDate: '2023-11-03',
			preferredMoveIn: '2024-01-01',
			roomPreference: 'Premium Private',
			status: 'Interview Scheduled',
			notes: 'Interview on Nov 10th',
		},
		{
			id: 'app-003',
			name: 'Thomas Rivera',
			email: 'thomas@example.com',
			appliedDate: '2023-10-28',
			preferredMoveIn: '2023-12-01',
			roomPreference: 'Shared Room',
			status: 'Approved',
			notes: 'Deposit pending',
		},
		{
			id: 'app-004',
			name: 'Emma Wilson',
			email: 'emma@example.com',
			appliedDate: '2023-11-05',
			preferredMoveIn: '2024-01-15',
			roomPreference: 'Private Room',
			status: 'Tour Scheduled',
			notes: 'Tour on Nov 12th',
		},
	];
};

export default function HouseAdminPage({ params }: { params: { houseId: string; }; }) {
	const house = getHouseData(params.houseId);
	const residents = getResidents();
	const applications = getApplications();

	return (
		<AdminLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<h1 className="text-2xl font-bold">{house.name}</h1>
						<p className="text-gray-400">{house.address}</p>
					</div>

					<div className="flex items-center space-x-2">
						<Button variant="outline" size="sm">
							<Eye className="mr-2 h-4 w-4" />
							View Public Page
						</Button>
						<Button variant="outline" size="sm">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</Button>
					</div>
				</div>

				{/* House Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">Occupancy</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{house.occupied}/{house.capacity}</div>
							<p className="text-sm text-gray-400">{house.occupied / house.capacity * 100}% occupied</p>
							<div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
								<div
									className="bg-blue-600 h-2.5 rounded-full"
									style={{ width: `${(house.occupied / house.capacity) * 100}%` }}
								></div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">Available Rooms</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{house.availableRooms}</div>
							<p className="text-sm text-gray-400">Out of {house.totalRooms} total rooms</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">Open Applications</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{house.openApplications}</div>
							<p className="text-sm text-gray-400">{house.pendingTours} tours scheduled</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-gray-400">Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center">
								<div className={`h-3 w-3 rounded-full mr-2 ${house.available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
								<span className="text-lg font-medium">{house.available ? 'Active' : 'Coming Soon'}</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Tabs */}
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="w-full mb-8 grid grid-cols-4 bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="details">House Details</TabsTrigger>
						<TabsTrigger value="residents">Residents</TabsTrigger>
						<TabsTrigger value="applications">Applications</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>

					{/* House Details Tab */}
					<TabsContent value="details">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>House Information</CardTitle>
										<CardDescription>Update the basic information about this house</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="house-name">House Name</Label>
												<Input id="house-name" defaultValue={house.name} />
											</div>
											<div className="space-y-2">
												<Label htmlFor="house-location">Location</Label>
												<Input id="house-location" defaultValue={house.location} />
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="house-address">Address</Label>
											<Input id="house-address" defaultValue={house.address} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="house-description">Description</Label>
											<Textarea
												id="house-description"
												defaultValue={house.description}
												rows={4}
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="house-capacity">Total Capacity</Label>
												<Input
													id="house-capacity"
													type="number"
													defaultValue={house.capacity.toString()}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="house-rooms">Total Rooms</Label>
												<Input
													id="house-rooms"
													type="number"
													defaultValue={house.totalRooms.toString()}
												/>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="house-available" defaultChecked={house.available} />
											<Label htmlFor="house-available">House is Available for Applications</Label>
										</div>
									</CardContent>
									<CardFooter>
										<Button>
											<Save className="mr-2 h-4 w-4" />
											Save Changes
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Room Types</CardTitle>
										<CardDescription>Manage the different room types available in this house</CardDescription>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Room Type</TableHead>
													<TableHead>Total</TableHead>
													<TableHead>Available</TableHead>
													<TableHead>Price</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{house.roomTypes.map((room, index) => (
													<TableRow key={index}>
														<TableCell className="font-medium">{room.type}</TableCell>
														<TableCell>{room.total}</TableCell>
														<TableCell>
															<Badge variant={room.available > 0 ? "default" : "secondary"}>
																{room.available}
															</Badge>
														</TableCell>
														<TableCell>{room.price}</TableCell>
														<TableCell>
															<Button variant="ghost" size="icon">
																<Edit className="h-4 w-4" />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</CardContent>
									<CardFooter>
										<Button variant="outline">
											<Plus className="mr-2 h-4 w-4" />
											Add Room Type
										</Button>
									</CardFooter>
								</Card>
							</div>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>House Status</CardTitle>
										<CardDescription>Toggle house visibility and availability</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex flex-col space-y-1.5">
											<div className="flex items-center justify-between">
												<Label htmlFor="status-public">Public Visibility</Label>
												<Switch id="status-public" defaultChecked={true} />
											</div>
											<p className="text-xs text-gray-400">
												When enabled, the house is visible on the public website.
											</p>
										</div>
										<div className="flex flex-col space-y-1.5">
											<div className="flex items-center justify-between">
												<Label htmlFor="status-applications">Accept Applications</Label>
												<Switch id="status-applications" defaultChecked={house.available} />
											</div>
											<p className="text-xs text-gray-400">
												When enabled, users can submit applications for this house.
											</p>
										</div>
										<div className="flex flex-col space-y-1.5">
											<div className="flex items-center justify-between">
												<Label htmlFor="status-tours">Accept Tour Requests</Label>
												<Switch id="status-tours" defaultChecked={true} />
											</div>
											<p className="text-xs text-gray-400">
												When enabled, users can schedule house tours.
											</p>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Quick Actions</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<Button variant="outline" className="w-full justify-start">
											<Calendar className="mr-2 h-4 w-4" />
											View Upcoming Events
										</Button>
										<Button variant="outline" className="w-full justify-start">
											<FileText className="mr-2 h-4 w-4" />
											House Documents
										</Button>
										<Button variant="outline" className="w-full justify-start">
											<DownloadCloud className="mr-2 h-4 w-4" />
											Export House Data
										</Button>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Residents Tab */}
					<TabsContent value="residents">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Current Residents</CardTitle>
									<CardDescription>Manage all residents in this house</CardDescription>
								</div>
								<div className="flex items-center space-x-2">
									<Button variant="outline" size="sm">
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>
									<Button size="sm">
										<Plus className="mr-2 h-4 w-4" />
										Add Resident
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[200px]">Name</TableHead>
											<TableHead>Room</TableHead>
											<TableHead>
												<div className="flex items-center">
													Move-in Date
													<ArrowUpDown className="ml-2 h-4 w-4" />
												</div>
											</TableHead>
											<TableHead>Move-out Date</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Rent</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{residents.map((resident) => (
											<TableRow key={resident.id}>
												<TableCell className="font-medium">
													<div className="flex items-center space-x-2">
														<div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
															<User className="h-4 w-4 text-gray-500" />
														</div>
														<div>
															<div>{resident.name}</div>
															<div className="text-xs text-gray-400">{resident.email}</div>
														</div>
													</div>
												</TableCell>
												<TableCell>{resident.room}</TableCell>
												<TableCell>{resident.moveInDate}</TableCell>
												<TableCell>{resident.moveOutDate}</TableCell>
												<TableCell>
													<Badge
														variant={resident.status === 'active' ? "default" : "secondary"}
														className={resident.status === 'leaving' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""}
													>
														{resident.status === 'active' ? 'Active' : 'Leaving Soon'}
													</Badge>
												</TableCell>
												<TableCell>
													<div>{resident.rent}</div>
													{resident.balance !== '$0' && (
														<div className="text-xs text-red-500">Balance due: {resident.balance}</div>
													)}
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>View Details</DropdownMenuItem>
															<DropdownMenuItem>Edit Resident</DropdownMenuItem>
															<DropdownMenuItem>Payment History</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem>Extend Stay</DropdownMenuItem>
															<DropdownMenuItem>Schedule Move-out</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Applications Tab */}
					<TabsContent value="applications">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Applications</CardTitle>
									<CardDescription>Review and process applications for this house</CardDescription>
								</div>
								<div className="flex items-center space-x-2">
									<Button variant="outline" size="sm">
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>
									<Button variant="outline" size="sm">
										<FileText className="mr-2 h-4 w-4" />
										Export
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[200px]">Applicant</TableHead>
											<TableHead>
												<div className="flex items-center">
													Applied Date
													<ArrowUpDown className="ml-2 h-4 w-4" />
												</div>
											</TableHead>
											<TableHead>Preferred Move-in</TableHead>
											<TableHead>Room Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Notes</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{applications.map((application) => (
											<TableRow key={application.id}>
												<TableCell className="font-medium">
													<div>
														<div>{application.name}</div>
														<div className="text-xs text-gray-400">{application.email}</div>
													</div>
												</TableCell>
												<TableCell>{application.appliedDate}</TableCell>
												<TableCell>{application.preferredMoveIn}</TableCell>
												<TableCell>{application.roomPreference}</TableCell>
												<TableCell>
													<Badge
														variant={
															application.status === 'Approved' ? "default" :
																application.status === 'Under Review' ? "secondary" :
																	"outline"
														}
														className={
															application.status === 'Approved' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
																application.status === 'Under Review' ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
																	""
														}
													>
														{application.status}
													</Badge>
												</TableCell>
												<TableCell className="max-w-[200px] truncate" title={application.notes}>
													{application.notes}
												</TableCell>
												<TableCell className="text-right">
													<Dialog>
														<DialogTrigger asChild>
															<Button variant="ghost" size="icon">
																<Eye className="h-4 w-4" />
															</Button>
														</DialogTrigger>
														<DialogContent className="sm:max-w-[425px]">
															<DialogHeader>
																<DialogTitle>Application Details</DialogTitle>
																<DialogDescription>
																	View and manage application from {application.name}
																</DialogDescription>
															</DialogHeader>
															<div className="py-4">
																<div className="space-y-4">
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Name:</Label>
																		<div className="col-span-3">{application.name}</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Email:</Label>
																		<div className="col-span-3">{application.email}</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Applied:</Label>
																		<div className="col-span-3">{application.appliedDate}</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Move-in:</Label>
																		<div className="col-span-3">{application.preferredMoveIn}</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Room:</Label>
																		<div className="col-span-3">{application.roomPreference}</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Status:</Label>
																		<div className="col-span-3">
																			<Badge>{application.status}</Badge>
																		</div>
																	</div>
																	<div className="grid grid-cols-4 items-center gap-2">
																		<Label className="text-right">Notes:</Label>
																		<div className="col-span-3">{application.notes}</div>
																	</div>
																</div>
															</div>
															<DialogFooter className="flex justify-between">
																<div className="flex items-center space-x-2">
																	<Button variant="outline">Resume</Button>
																	<Button variant="destructive">
																		<Trash2 className="mr-2 h-4 w-4" />
																		Reject
																	</Button>
																</div>
																<Button>
																	<Check className="mr-2 h-4 w-4" />
																	Approve
																</Button>
															</DialogFooter>
														</DialogContent>
													</Dialog>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>
																<ExternalLink className="mr-2 h-4 w-4" />
																View Full Application
															</DropdownMenuItem>
															<DropdownMenuItem>Schedule Interview</DropdownMenuItem>
															<DropdownMenuItem>Schedule Tour</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem>
																<Check className="mr-2 h-4 w-4" />
																Approve
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Trash2 className="mr-2 h-4 w-4" />
																Reject
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Settings Tab */}
					<TabsContent value="settings">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<Card>
								<CardHeader>
									<CardTitle>House Settings</CardTitle>
									<CardDescription>Configure settings for this house</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="house-timezone">Timezone</Label>
										<Input id="house-timezone" defaultValue="America/Los_Angeles" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="house-currency">Currency</Label>
										<Input id="house-currency" defaultValue="USD" />
									</div>
									<div className="space-y-2">
										<Label>Notifications</Label>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label htmlFor="notify-applications" className="flex-1">New Applications</Label>
												<Switch id="notify-applications" defaultChecked={true} />
											</div>
											<div className="flex items-center justify-between">
												<Label htmlFor="notify-tours" className="flex-1">Tour Requests</Label>
												<Switch id="notify-tours" defaultChecked={true} />
											</div>
											<div className="flex items-center justify-between">
												<Label htmlFor="notify-moveouts" className="flex-1">Move-out Notices</Label>
												<Switch id="notify-moveouts" defaultChecked={true} />
											</div>
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Button>Save Settings</Button>
								</CardFooter>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Danger Zone</CardTitle>
									<CardDescription>Irreversible actions for this house</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
										<h3 className="font-medium text-red-600 dark:text-red-400">Archive House</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
											Archiving will hide this house from public view and prevent new applications.
											Current residents will still have access.
										</p>
										<Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
											Archive House
										</Button>
									</div>

									<div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
										<h3 className="font-medium text-red-600 dark:text-red-400">Delete House</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
											Permanently delete this house and all associated data. This action cannot be undone.
											Only possible when the house has no active residents.
										</p>
										<Button
											variant="destructive"
											disabled={house.occupied > 0}
										>
											Delete House
										</Button>
										{house.occupied > 0 && (
											<p className="text-xs text-red-500 mt-2">
												House has {house.occupied} active residents and cannot be deleted.
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
}
