import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ArrowDownRight,
	ArrowUpRight,
	Calendar,
	Download,
	Home,
	Sparkles,
	Users
} from 'lucide-react';

// Mock data component for where charts would go
const ChartPlaceholder = ({ title }: { title: string; }) => (
	<div className="w-full h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
		<div className="text-center">
			<p className="text-sm font-medium">{title}</p>
			<p className="text-xs text-muted-foreground">Chart visualization would go here</p>
		</div>
	</div>
);

export default function AnalyticsDashboard({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Export Report
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
						<Home className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">92%</div>
						<Progress value={92} className="mt-2" />
						<div className="flex items-center pt-1">
							<ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
							<span className="text-xs text-green-500 font-medium">+5%</span>
							<span className="text-xs text-muted-foreground ml-1">from last month</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Resident Satisfaction</CardTitle>
						<Sparkles className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">87%</div>
						<Progress value={87} className="mt-2" />
						<div className="flex items-center pt-1">
							<ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
							<span className="text-xs text-green-500 font-medium">+2%</span>
							<span className="text-xs text-muted-foreground ml-1">from last quarter</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Event Participation</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">72%</div>
						<Progress value={72} className="mt-2" />
						<div className="flex items-center pt-1">
							<ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
							<span className="text-xs text-red-500 font-medium">-3%</span>
							<span className="text-xs text-muted-foreground ml-1">from last month</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">93%</div>
						<Progress value={93} className="mt-2" />
						<div className="flex items-center pt-1">
							<ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
							<span className="text-xs text-green-500 font-medium">+7%</span>
							<span className="text-xs text-muted-foreground ml-1">from last month</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="occupancy">Occupancy</TabsTrigger>
					<TabsTrigger value="events">Events</TabsTrigger>
					<TabsTrigger value="community">Community</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Occupancy Trends</CardTitle>
								<CardDescription>6-month occupancy rate history</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Occupancy Rate Over Time" />
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Resident Retention</CardTitle>
								<CardDescription>Average stay duration and retention rate</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">Average Stay Duration</span>
											<span className="text-sm font-medium">8.5 months</span>
										</div>
										<Progress value={85} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>Target: 10 months</span>
											<span>+1.2 months YoY</span>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">6-Month Retention Rate</span>
											<span className="text-sm font-medium">78%</span>
										</div>
										<Progress value={78} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>Target: 80%</span>
											<span>+5% YoY</span>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">12-Month Retention Rate</span>
											<span className="text-sm font-medium">42%</span>
										</div>
										<Progress value={42} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>Target: 50%</span>
											<span>+8% YoY</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Founder Success Metrics</CardTitle>
								<CardDescription>Startup metrics for house residents</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Funding Raised</p>
											<p className="text-xs text-muted-foreground">by current residents</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">$3.2M</p>
											<p className="text-xs text-green-500">+$1.1M this quarter</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Active Startups</p>
											<p className="text-xs text-muted-foreground">among current residents</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">8</p>
											<p className="text-xs text-green-500">+2 this quarter</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Co-founder Matches</p>
											<p className="text-xs text-muted-foreground">within the house</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">3</p>
											<p className="text-xs text-green-500">+1 this quarter</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Event Analytics</CardTitle>
								<CardDescription>Event participation by type</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Event Participation by Type" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Resident Demographics</CardTitle>
								<CardDescription>Breakdown by industry and focus</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Resident Industry Breakdown" />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="occupancy" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-1 md:col-span-2">
							<CardHeader>
								<CardTitle>Occupancy Rate Over Time</CardTitle>
								<CardDescription>Historical occupancy trends with forecasting</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Monthly Occupancy Rate with 3-Month Forecast" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Room Type Occupancy</CardTitle>
								<CardDescription>Occupancy rates by room type</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">Single Rooms</span>
											<span className="text-sm font-medium">100%</span>
										</div>
										<Progress value={100} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>8/8 rooms</span>
											<span>Waitlist: 3</span>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">Double Rooms</span>
											<span className="text-sm font-medium">83%</span>
										</div>
										<Progress value={83} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>5/6 rooms</span>
											<span>Available: 1</span>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">Premium Suites</span>
											<span className="text-sm font-medium">100%</span>
										</div>
										<Progress value={100} className="h-2 mt-2" />
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>1/1 suite</span>
											<span>Waitlist: 2</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Seasonal Occupancy</CardTitle>
								<CardDescription>Occupancy patterns by month</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Occupancy by Month (Last 12 Months)" />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="events" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card className="col-span-full">
							<CardHeader>
								<CardTitle>Event Attendance Over Time</CardTitle>
								<CardDescription>Participation rates for the last 6 months</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Monthly Event Attendance Trends" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Event Popularity</CardTitle>
								<CardDescription>By attendance rate</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center">
										<div className="w-full mr-4">
											<div className="flex items-center justify-between">
												<span className="text-sm">Founder Dinner</span>
												<span className="text-sm font-medium">92%</span>
											</div>
											<Progress value={92} className="h-2 mt-1" />
										</div>
									</div>

									<div className="flex items-center">
										<div className="w-full mr-4">
											<div className="flex items-center justify-between">
												<span className="text-sm">Game Night</span>
												<span className="text-sm font-medium">87%</span>
											</div>
											<Progress value={87} className="h-2 mt-1" />
										</div>
									</div>

									<div className="flex items-center">
										<div className="w-full mr-4">
											<div className="flex items-center justify-between">
												<span className="text-sm">Hackathons</span>
												<span className="text-sm font-medium">78%</span>
											</div>
											<Progress value={78} className="h-2 mt-1" />
										</div>
									</div>

									<div className="flex items-center">
										<div className="w-full mr-4">
											<div className="flex items-center justify-between">
												<span className="text-sm">Workshops</span>
												<span className="text-sm font-medium">65%</span>
											</div>
											<Progress value={65} className="h-2 mt-1" />
										</div>
									</div>

									<div className="flex items-center">
										<div className="w-full mr-4">
											<div className="flex items-center justify-between">
												<span className="text-sm">Office Hours</span>
												<span className="text-sm font-medium">58%</span>
											</div>
											<Progress value={58} className="h-2 mt-1" />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Event Frequency</CardTitle>
								<CardDescription>Number of events by type</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Event Type Distribution" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Resident Feedback</CardTitle>
								<CardDescription>Average ratings by event category</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Event Satisfaction Ratings" />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="community" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-full">
							<CardHeader>
								<CardTitle>Community Health Index</CardTitle>
								<CardDescription>Overall community metrics over time</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Community Health Trend" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Collaboration Metrics</CardTitle>
								<CardDescription>Inter-resident collaboration activity</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Active Collaborations</p>
											<p className="text-xs text-muted-foreground">between residents</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">7</p>
											<p className="text-xs text-green-500">+2 this month</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Skill Sharing Sessions</p>
											<p className="text-xs text-muted-foreground">resident-led</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">12</p>
											<p className="text-xs text-green-500">+3 this month</p>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium">Resources Shared</p>
											<p className="text-xs text-muted-foreground">introductions, tools, etc.</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">35</p>
											<p className="text-xs text-green-500">+8 this month</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Resident Network</CardTitle>
								<CardDescription>Visualize resident connections</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Resident Connection Map" />
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
} 