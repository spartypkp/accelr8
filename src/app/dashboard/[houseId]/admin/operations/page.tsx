import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ClipboardCheck, MoreHorizontal, Plus, WrenchIcon } from 'lucide-react';

// Mock data
const MAINTENANCE_REQUESTS = [
	{
		id: '1',
		title: 'Kitchen sink leaking',
		description: 'Water is leaking under the sink in the main kitchen',
		location: 'Kitchen',
		reportedBy: 'Emma Thompson',
		reportedDate: '2023-08-15',
		status: 'open',
		priority: 'high',
	},
	{
		id: '2',
		title: 'Light bulb replacement',
		description: 'Bathroom light bulb needs to be replaced',
		location: '2nd Floor Bathroom',
		reportedBy: 'James Wilson',
		reportedDate: '2023-08-16',
		status: 'in_progress',
		priority: 'medium',
	},
	{
		id: '3',
		title: 'HVAC not cooling',
		description: 'AC is not cooling properly in the common area',
		location: 'Common Area',
		reportedBy: 'Sophia Garcia',
		reportedDate: '2023-08-14',
		status: 'completed',
		priority: 'high',
	},
	{
		id: '4',
		title: 'WiFi connectivity issues',
		description: 'WiFi signal is weak in the east wing bedrooms',
		location: 'East Wing',
		reportedBy: 'Michael Chen',
		reportedDate: '2023-08-10',
		status: 'open',
		priority: 'medium',
	},
];

const CLEANING_SCHEDULE = [
	{
		id: '1',
		area: 'Kitchen',
		frequency: 'Daily',
		assignedTo: 'Cleaning Service',
		lastCleaned: '2023-08-17',
		nextCleaning: '2023-08-18',
		status: 'scheduled',
	},
	{
		id: '2',
		area: 'Common Areas',
		frequency: 'Daily',
		assignedTo: 'Cleaning Service',
		lastCleaned: '2023-08-17',
		nextCleaning: '2023-08-18',
		status: 'scheduled',
	},
	{
		id: '3',
		area: 'Bathrooms',
		frequency: 'Daily',
		assignedTo: 'Cleaning Service',
		lastCleaned: '2023-08-17',
		nextCleaning: '2023-08-18',
		status: 'scheduled',
	},
	{
		id: '4',
		area: 'Hallways',
		frequency: 'Weekly',
		assignedTo: 'Cleaning Service',
		lastCleaned: '2023-08-14',
		nextCleaning: '2023-08-21',
		status: 'scheduled',
	},
];

const INVENTORY_ITEMS = [
	{
		id: '1',
		name: 'Toilet Paper',
		category: 'Bathroom Supplies',
		currentStock: 45,
		minStock: 20,
		reorderPoint: 30,
		lastRestocked: '2023-08-10',
	},
	{
		id: '2',
		name: 'Dish Soap',
		category: 'Kitchen Supplies',
		currentStock: 8,
		minStock: 5,
		reorderPoint: 10,
		lastRestocked: '2023-08-05',
	},
	{
		id: '3',
		name: 'Paper Towels',
		category: 'Kitchen Supplies',
		currentStock: 12,
		minStock: 10,
		reorderPoint: 15,
		lastRestocked: '2023-08-12',
	},
	{
		id: '4',
		name: 'Light Bulbs',
		category: 'Maintenance Supplies',
		currentStock: 6,
		minStock: 10,
		reorderPoint: 15,
		lastRestocked: '2023-07-28',
	},
];

export default function OperationsManagement({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Operations Management</h1>
				<div className="flex gap-2">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						New Request
					</Button>
				</div>
			</div>

			<Tabs defaultValue="maintenance" className="space-y-4">
				<TabsList>
					<TabsTrigger value="maintenance">Maintenance</TabsTrigger>
					<TabsTrigger value="cleaning">Cleaning Schedule</TabsTrigger>
					<TabsTrigger value="inventory">Inventory</TabsTrigger>
					<TabsTrigger value="vendors">Service Providers</TabsTrigger>
				</TabsList>

				<TabsContent value="maintenance">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Open Requests
								</CardTitle>
								<AlertTriangle className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{MAINTENANCE_REQUESTS.filter(r => r.status === 'open').length}
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									{MAINTENANCE_REQUESTS.filter(r => r.status === 'open' && r.priority === 'high').length} high priority
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									In Progress
								</CardTitle>
								<WrenchIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{MAINTENANCE_REQUESTS.filter(r => r.status === 'in_progress').length}
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									Updated 2 hours ago
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Completed This Week
								</CardTitle>
								<ClipboardCheck className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{MAINTENANCE_REQUESTS.filter(r => r.status === 'completed').length}
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									+2 since last week
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Resolution Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">85%</div>
								<Progress value={85} className="mt-2" />
								<p className="text-xs text-muted-foreground mt-2">
									+5% from last month
								</p>
							</CardContent>
						</Card>
					</div>

					<Card className="mt-4">
						<CardHeader>
							<CardTitle>Maintenance Requests</CardTitle>
							<CardDescription>
								View and manage all maintenance requests for the house
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Issue</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Reported By</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Priority</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{MAINTENANCE_REQUESTS.map((request) => (
										<TableRow key={request.id}>
											<TableCell className="font-medium">{request.title}</TableCell>
											<TableCell>{request.location}</TableCell>
											<TableCell>{request.reportedBy}</TableCell>
											<TableCell>{request.reportedDate}</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={
														request.priority === 'high'
															? 'border-red-500 text-red-500'
															: request.priority === 'medium'
																? 'border-yellow-500 text-yellow-500'
																: 'border-green-500 text-green-500'
													}
												>
													{request.priority === 'high' ? 'High' : request.priority === 'medium' ? 'Medium' : 'Low'}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={request.status === 'completed' ? 'default' : 'secondary'}
													className={
														request.status === 'completed'
															? 'bg-green-500'
															: request.status === 'in_progress'
																? 'bg-blue-500'
																: ''
													}
												>
													{request.status === 'completed'
														? 'Completed'
														: request.status === 'in_progress'
															? 'In Progress'
															: 'Open'
													}
												</Badge>
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
														<DropdownMenuItem>View Details</DropdownMenuItem>
														<DropdownMenuItem>Update Status</DropdownMenuItem>
														<DropdownMenuItem>Assign Vendor</DropdownMenuItem>
														<DropdownMenuItem>Mark as Completed</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Previous</Button>
							<Button variant="outline">Next</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="cleaning">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Cleaning Schedule</CardTitle>
								<CardDescription>
									View and manage cleaning schedules for different areas
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Area</TableHead>
											<TableHead>Frequency</TableHead>
											<TableHead>Assigned To</TableHead>
											<TableHead>Last Cleaned</TableHead>
											<TableHead>Next Cleaning</TableHead>
											<TableHead>Status</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{CLEANING_SCHEDULE.map((item) => (
											<TableRow key={item.id}>
												<TableCell className="font-medium">{item.area}</TableCell>
												<TableCell>{item.frequency}</TableCell>
												<TableCell>{item.assignedTo}</TableCell>
												<TableCell>{item.lastCleaned}</TableCell>
												<TableCell>{item.nextCleaning}</TableCell>
												<TableCell>
													<Badge variant="outline">Scheduled</Badge>
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
															<DropdownMenuItem>Mark as Cleaned</DropdownMenuItem>
															<DropdownMenuItem>Reschedule</DropdownMenuItem>
															<DropdownMenuItem>Change Frequency</DropdownMenuItem>
															<DropdownMenuItem>Reassign</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter>
								<Button>
									<Plus className="mr-2 h-4 w-4" />
									Add Schedule
								</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Cleaning Calendar</CardTitle>
								<CardDescription>
									View scheduled cleanings by date
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex justify-center">
									<Calendar
										mode="single"
										selected={new Date()}
										className="rounded-md border"
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="inventory">
					<Card>
						<CardHeader>
							<CardTitle>Inventory Management</CardTitle>
							<CardDescription>
								Track supplies and manage reordering
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Current Stock</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Last Restocked</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{INVENTORY_ITEMS.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium">{item.name}</TableCell>
											<TableCell>{item.category}</TableCell>
											<TableCell>{item.currentStock}</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={
														item.currentStock < item.minStock
															? 'border-red-500 text-red-500'
															: item.currentStock < item.reorderPoint
																? 'border-yellow-500 text-yellow-500'
																: 'border-green-500 text-green-500'
													}
												>
													{item.currentStock < item.minStock
														? 'Low Stock'
														: item.currentStock < item.reorderPoint
															? 'Reorder Soon'
															: 'In Stock'
													}
												</Badge>
											</TableCell>
											<TableCell>{item.lastRestocked}</TableCell>
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
														<DropdownMenuItem>Update Stock</DropdownMenuItem>
														<DropdownMenuItem>Order More</DropdownMenuItem>
														<DropdownMenuItem>Edit Details</DropdownMenuItem>
														<DropdownMenuItem>Archive Item</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Add Inventory Item
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="vendors">
					<Card>
						<CardHeader>
							<CardTitle>Service Providers</CardTitle>
							<CardDescription>
								Manage contractors and service companies
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex h-[300px] items-center justify-center border rounded-md">
								<p className="text-sm text-muted-foreground">No service providers added yet</p>
							</div>
						</CardContent>
						<CardFooter>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Add Service Provider
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 