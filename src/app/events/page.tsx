import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowRight,
	Calendar,
	CalendarDays,
	Clock,
	Filter,
	MapPin,
	Search,
	Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Events | Accelr8",
	description: "Discover upcoming events, workshops, and gatherings at Accelr8 houses.",
};

// Mock data for events
const upcomingEvents = [
	{
		id: 1,
		title: "Founder Dinner Series",
		description: "Join us for our monthly dinner with founders and investors in the Bay Area tech ecosystem.",
		date: "2023-06-15",
		time: "7:00 PM - 9:30 PM",
		location: "San Francisco House",
		type: "Networking",
		attendees: 24,
		image: "/placeholder-event.jpg",
	},
	{
		id: 2,
		title: "AI Hackathon Weekend",
		description: "48-hour hackathon focused on building AI-powered applications with mentorship from industry experts.",
		date: "2023-06-24",
		time: "9:00 AM - 6:00 PM",
		location: "Seattle House",
		type: "Hackathon",
		attendees: 36,
		image: "/placeholder-event.jpg",
	},
	{
		id: 3,
		title: "Pitch Practice Workshop",
		description: "Practice your startup pitch and receive feedback from experienced founders and investors.",
		date: "2023-06-18",
		time: "6:00 PM - 8:00 PM",
		location: "San Francisco House",
		type: "Workshop",
		attendees: 15,
		image: "/placeholder-event.jpg",
	},
	{
		id: 4,
		title: "Product Design Masterclass",
		description: "Learn practical product design principles from a senior designer at a leading tech company.",
		date: "2023-06-29",
		time: "5:30 PM - 7:30 PM",
		location: "Austin House",
		type: "Workshop",
		attendees: 20,
		image: "/placeholder-event.jpg",
	},
];

const pastEvents = [
	{
		id: 5,
		title: "VC Office Hours",
		description: "One-on-one sessions with VCs from top firms to discuss your startup and fundraising strategy.",
		date: "2023-05-25",
		time: "1:00 PM - 5:00 PM",
		location: "San Francisco House",
		type: "Networking",
		attendees: 28,
		image: "/placeholder-event.jpg",
	},
	{
		id: 6,
		title: "Web3 Demo Day",
		description: "Showcase of projects built by Accelr8 residents working in the Web3 space.",
		date: "2023-05-12",
		time: "4:00 PM - 7:00 PM",
		location: "New York House",
		type: "Demo Day",
		attendees: 45,
		image: "/placeholder-event.jpg",
	},
	{
		id: 7,
		title: "Technical Co-Founder Mixer",
		description: "Networking event specifically for founders looking to meet technical co-founders.",
		date: "2023-05-05",
		time: "6:30 PM - 9:00 PM",
		location: "Seattle House",
		type: "Networking",
		attendees: 32,
		image: "/placeholder-event.jpg",
	},
];

export default function EventsPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Accelr8 <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Events</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Connect, learn, and grow with our community through workshops,
							hackathons, and networking opportunities.
						</p>
					</div>
				</div>
			</section>

			{/* Events Section */}
			<section className="py-16 bg-gray-950">
				<div className="container mx-auto px-4">
					{/* Filter Bar */}
					<div className="mb-10 p-4 bg-gray-900 rounded-lg border border-gray-800">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										placeholder="Search events..."
										className="pl-10 bg-gray-800 border-gray-700"
									/>
								</div>
							</div>
							<div className="flex gap-4">
								<Select defaultValue="all">
									<SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
										<SelectValue placeholder="Event type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Types</SelectItem>
										<SelectItem value="workshop">Workshops</SelectItem>
										<SelectItem value="hackathon">Hackathons</SelectItem>
										<SelectItem value="networking">Networking</SelectItem>
										<SelectItem value="demo">Demo Days</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="all">
									<SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
										<SelectValue placeholder="Location" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Locations</SelectItem>
										<SelectItem value="sf">San Francisco</SelectItem>
										<SelectItem value="nyc">New York</SelectItem>
										<SelectItem value="seattle">Seattle</SelectItem>
										<SelectItem value="austin">Austin</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon" className="bg-gray-800 border-gray-700">
									<Filter className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Events Tabs */}
					<Tabs defaultValue="upcoming" className="space-y-8">
						<TabsList className="bg-gray-900 border border-gray-800">
							<TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
							<TabsTrigger value="past">Past Events</TabsTrigger>
						</TabsList>

						{/* Upcoming Events */}
						<TabsContent value="upcoming" className="space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{upcomingEvents.map((event) => (
									<Card key={event.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:border-blue-600 transition-colors">
										<div className="h-48 bg-gray-800 relative">
											{/* Placeholder for event image */}
											<div className="absolute inset-0 flex items-center justify-center">
												<Calendar className="h-12 w-12 text-gray-700" />
											</div>
										</div>
										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="text-xl">{event.title}</CardTitle>
												<span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
													{event.type}
												</span>
											</div>
											<CardDescription className="text-gray-400">{event.description}</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex items-center text-gray-400">
													<CalendarDays className="h-4 w-4 mr-2" />
													<span>{event.date}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<Clock className="h-4 w-4 mr-2" />
													<span>{event.time}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<MapPin className="h-4 w-4 mr-2" />
													<span>{event.location}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<Users className="h-4 w-4 mr-2" />
													<span>{event.attendees} attendees</span>
												</div>
											</div>
										</CardContent>
										<CardFooter>
											<Button className="w-full">
												Register
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* Past Events */}
						<TabsContent value="past" className="space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{pastEvents.map((event) => (
									<Card key={event.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-colors">
										<div className="h-48 bg-gray-800 relative">
											{/* Placeholder for event image */}
											<div className="absolute inset-0 flex items-center justify-center">
												<Calendar className="h-12 w-12 text-gray-700" />
											</div>
										</div>
										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="text-xl">{event.title}</CardTitle>
												<span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded">
													{event.type}
												</span>
											</div>
											<CardDescription className="text-gray-400">{event.description}</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex items-center text-gray-400">
													<CalendarDays className="h-4 w-4 mr-2" />
													<span>{event.date}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<Clock className="h-4 w-4 mr-2" />
													<span>{event.time}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<MapPin className="h-4 w-4 mr-2" />
													<span>{event.location}</span>
												</div>
												<div className="flex items-center text-gray-400">
													<Users className="h-4 w-4 mr-2" />
													<span>{event.attendees} attendees</span>
												</div>
											</div>
										</CardContent>
										<CardFooter>
											<Button variant="outline" className="w-full">
												View Recap
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Host an Event CTA */}
			<section className="py-20 bg-gradient-to-b from-gray-950 to-black">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Have an idea for an event?</h2>
						<p className="text-xl text-gray-300 mb-8">
							Accelr8 residents can propose and host events for the community.
							Share your expertise or bring in speakers on topics you're passionate about.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/dashboard">
									Propose an Event
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<a href="mailto:hello@accelr8.io">
									Contact for Partnerships
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 