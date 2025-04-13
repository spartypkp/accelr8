import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
	AlertTriangle,
	Bell,
	Building,
	Calendar,
	ClipboardList,
	DollarSign,
	HomeIcon,
	LineChart,
	Settings,
	Users,
} from 'lucide-react';
import Link from 'next/link';

export default function HouseAdminDashboard({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">House Admin Dashboard</h1>
				<Button variant="default">
					<Bell className="mr-2 h-4 w-4" /> Send Announcement
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Occupancy Rate
						</CardTitle>
						<HomeIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">92%</div>
						<Progress value={92} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							12/15 rooms occupied
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Maintenance
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">3</div>
						<p className="text-xs text-muted-foreground mt-2">
							1 high priority
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Upcoming Events
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground mt-2">
							Next: Founder Dinner (Tomorrow)
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Applications
						</CardTitle>
						<ClipboardList className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">7</div>
						<p className="text-xs text-muted-foreground mt-2">
							3 need review
						</p>
					</CardContent>
				</Card>
			</div>


			<div className="grid gap-4 md:grid-cols-2">
				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest events and actions in your house
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
									<Users className="h-4 w-4" />
								</div>
								<div>
									<p className="font-medium">New resident check-in</p>
									<p className="text-sm text-muted-foreground">Sarah Johnson moved in to Room 204</p>
									<p className="text-xs text-muted-foreground">2 hours ago</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
									<AlertTriangle className="h-4 w-4" />
								</div>
								<div>
									<p className="font-medium">Maintenance request submitted</p>
									<p className="text-sm text-muted-foreground">Kitchen sink leaking - high priority</p>
									<p className="text-xs text-muted-foreground">5 hours ago</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
									<Calendar className="h-4 w-4" />
								</div>
								<div>
									<p className="font-medium">New event created</p>
									<p className="text-sm text-muted-foreground">AI Hackathon scheduled for next weekend</p>
									<p className="text-xs text-muted-foreground">Yesterday</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>
							Common management tasks
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<Link href={`/dashboard/${houseId}/admin/house-details`} className="no-underline">
								<Button variant="outline" className="w-full justify-start text-primary border-primary">
									<Settings className="mr-2 h-4 w-4" />
									House Details
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/residents`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<Users className="mr-2 h-4 w-4" />
									Manage Residents
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/operations`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<Building className="mr-2 h-4 w-4" />
									Operations
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/events`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<Calendar className="mr-2 h-4 w-4" />
									Events
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/analytics`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<LineChart className="mr-2 h-4 w-4" />
									Analytics
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/finances`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<DollarSign className="mr-2 h-4 w-4" />
									Finances
								</Button>
							</Link>

							<Link href={`/dashboard/${houseId}/admin/applications`} className="no-underline">
								<Button variant="outline" className="w-full justify-start">
									<ClipboardList className="mr-2 h-4 w-4" />
									Applications
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>


		</div>
	);
}
