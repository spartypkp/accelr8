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
import { Download, Filter, MoreHorizontal, UserPlus } from 'lucide-react';

// Mock data
const RESIDENTS = [
	{
		id: '1',
		name: 'Emma Thompson',
		email: 'emma@example.com',
		room: '101',
		moveInDate: '2023-05-15',
		status: 'active',
		company: 'AI Startup Co.',
		field: 'AI',
	},
	{
		id: '2',
		name: 'James Wilson',
		email: 'james@example.com',
		room: '102',
		moveInDate: '2023-06-01',
		status: 'active',
		company: 'Web3 Solutions',
		field: 'Web3',
	},
	{
		id: '3',
		name: 'Sophia Garcia',
		email: 'sophia@example.com',
		room: '203',
		moveInDate: '2023-04-10',
		status: 'active',
		company: 'Blockchain Ventures',
		field: 'Web3',
	},
	{
		id: '4',
		name: 'Michael Chen',
		email: 'michael@example.com',
		room: '205',
		moveInDate: '2023-07-05',
		status: 'active',
		company: 'Neural Networks Inc.',
		field: 'AI',
	},
	{
		id: '5',
		name: 'Lisa Johnson',
		email: 'lisa@example.com',
		room: null,
		moveInDate: '2023-09-01',
		status: 'pending',
		company: 'DeFi Protocol',
		field: 'Web3',
	},
];

const APPLICANTS = [
	{
		id: '10',
		name: 'Alex Rodriguez',
		email: 'alex@example.com',
		preferredRoom: 'Any',
		applicationDate: '2023-08-10',
		status: 'interview',
		company: 'GenAI Studio',
		field: 'AI',
	},
	{
		id: '11',
		name: 'Taylor Kim',
		email: 'taylor@example.com',
		preferredRoom: 'Single',
		applicationDate: '2023-08-15',
		status: 'review',
		company: 'Smart Contract Labs',
		field: 'Web3',
	},
];

export default function ResidentsManagement({ params }: { params: { houseId: string; }; }) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Residents Management</h1>
				<div className="flex gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Button>
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
										<TableHead>Room</TableHead>
										<TableHead>Move-in Date</TableHead>
										<TableHead>Company/Project</TableHead>
										<TableHead>Field</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{RESIDENTS.filter(r => r.status === 'active').map((resident) => (
										<TableRow key={resident.id}>
											<TableCell className="font-medium">{resident.name}</TableCell>
											<TableCell>{resident.room}</TableCell>
											<TableCell>{resident.moveInDate}</TableCell>
											<TableCell>{resident.company}</TableCell>
											<TableCell>{resident.field}</TableCell>
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
									))}
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
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Assigned Room</TableHead>
										<TableHead>Expected Move-in</TableHead>
										<TableHead>Company/Project</TableHead>
										<TableHead>Field</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{RESIDENTS.filter(r => r.status === 'pending').map((resident) => (
										<TableRow key={resident.id}>
											<TableCell className="font-medium">{resident.name}</TableCell>
											<TableCell>{resident.room || "Not Assigned"}</TableCell>
											<TableCell>{resident.moveInDate}</TableCell>
											<TableCell>{resident.company}</TableCell>
											<TableCell>{resident.field}</TableCell>
											<TableCell>
												<Badge variant="outline">Pending</Badge>
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
														<DropdownMenuItem>Assign Room</DropdownMenuItem>
														<DropdownMenuItem>Process Check-in</DropdownMenuItem>
														<DropdownMenuItem>Edit Details</DropdownMenuItem>
														<DropdownMenuItem>Send Welcome Email</DropdownMenuItem>
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

				<TabsContent value="applications">
					<Card>
						<CardHeader>
							<CardTitle>Applications</CardTitle>
							<CardDescription>
								Review and process applicants
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Preferred Room</TableHead>
										<TableHead>Application Date</TableHead>
										<TableHead>Company/Project</TableHead>
										<TableHead>Field</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{APPLICANTS.map((applicant) => (
										<TableRow key={applicant.id}>
											<TableCell className="font-medium">{applicant.name}</TableCell>
											<TableCell>{applicant.preferredRoom}</TableCell>
											<TableCell>{applicant.applicationDate}</TableCell>
											<TableCell>{applicant.company}</TableCell>
											<TableCell>{applicant.field}</TableCell>
											<TableCell>
												<Badge
													variant={applicant.status === 'interview' ? 'default' : 'secondary'}
													className={applicant.status === 'interview' ? 'bg-blue-500' : ''}
												>
													{applicant.status === 'interview' ? 'Interview Scheduled' : 'Under Review'}
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
														<DropdownMenuItem>View Application</DropdownMenuItem>
														<DropdownMenuItem>Schedule Interview</DropdownMenuItem>
														<DropdownMenuItem>Approve</DropdownMenuItem>
														<DropdownMenuItem>Reject</DropdownMenuItem>
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
								<p className="text-sm text-muted-foreground">No alumni data available yet</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 