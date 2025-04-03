import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ArrowRight,
	Building,
	Filter,
	MapPin,
	Search,
	Users,
	Wifi
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Our Houses | Accelr8",
	description: "Explore our network of Accelr8 hacker houses designed for founders and innovators.",
};

// Mock house data - would be fetched from API in production
const houses = [
	{
		id: 'sf-nob-hill',
		name: 'San Francisco - Nob Hill',
		location: 'San Francisco, CA',
		description: 'Our flagship location in the heart of San Francisco with stunning city views and easy access to the tech ecosystem.',
		features: ['20 Residents', 'Gigabit Internet', 'Coworking Space', 'Event Space'],
		amenities: ['Roof Deck', 'Common Kitchen', 'Game Room', 'Monthly Events'],
		tags: ['Startup Focused', 'Great Location', 'Tech Hub'],
		available: true,
		capacity: 20,
		occupied: 18,
	},
	{
		id: 'nyc-williamsburg',
		name: 'New York - Williamsburg',
		location: 'Brooklyn, NY',
		description: 'Located in vibrant Williamsburg, our New York house connects founders to the East Coast startup scene and investor network.',
		features: ['18 Residents', 'Gigabit Internet', 'Dedicated Workspaces', 'Conference Room'],
		amenities: ['Outdoor Patio', 'Communal Kitchen', 'Lounge Areas', 'Networking Events'],
		tags: ['Creative Hub', 'Investor Access', 'Tech Community'],
		available: true,
		capacity: 18,
		occupied: 15,
	},
	{
		id: 'austin-downtown',
		name: 'Austin - Downtown',
		location: 'Austin, TX',
		description: 'In the heart of Austin\'s thriving tech scene, this house offers a perfect blend of Southern hospitality and innovation culture.',
		features: ['16 Residents', 'Gigabit Internet', 'Open Workspace', 'Podcast Studio'],
		amenities: ['Swimming Pool', 'BBQ Area', 'Music Room', 'Weekly Meetups'],
		tags: ['Growing Tech Scene', 'Affordable', 'Work-Life Balance'],
		available: true,
		capacity: 16,
		occupied: 12,
	},
	{
		id: 'seattle-capitol-hill',
		name: 'Seattle - Capitol Hill',
		location: 'Seattle, WA',
		description: 'Nestled in Seattle\'s vibrant Capitol Hill neighborhood, connect with founders while being close to Amazon, Microsoft, and other tech giants.',
		features: ['14 Residents', 'Gigabit Internet', 'Dedicated Desks', 'Meeting Rooms'],
		amenities: ['Rooftop Lounge', 'Coffee Bar', 'Bike Storage', 'Tech Meetups'],
		tags: ['Tech Industry', 'Cloud Startups', 'Enterprise Focus'],
		available: false, // Coming soon
		capacity: 14,
		occupied: 0,
	},
];

export default function HousesPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Our <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Houses</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Explore our network of coliving spaces designed specifically for founders,
							builders, and innovators across the United States.
						</p>
					</div>
				</div>
			</section>

			{/* Search and Filter Section */}
			<section className="py-12 bg-gray-950 border-b border-gray-800">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						{/* Search Bar */}
						<div className="relative w-full max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
							<Input
								placeholder="Search houses..."
								className="pl-10 bg-gray-900 border-gray-800"
							/>
						</div>

						{/* Filter Button */}
						<Button variant="outline" className="gap-2">
							<Filter className="h-4 w-4" />
							Filter Options
						</Button>
					</div>

					{/* Filter Tags (simplified) */}
					<div className="flex flex-wrap gap-2 mt-4">
						{['All Locations', 'Available Now', 'San Francisco', 'New York', 'Austin', 'Seattle'].map((tag, index) => (
							<Button
								key={index}
								variant={index === 0 ? "default" : "outline"}
								size="sm"
								className={index === 0 ? "" : "bg-gray-900 border-gray-800"}
							>
								{tag}
							</Button>
						))}
					</div>
				</div>
			</section>

			{/* Houses Grid */}
			<section className="py-20 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{houses.map((house) => (
							<div
								key={house.id}
								className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-lg transition-all hover:shadow-xl hover:border-blue-800/50"
							>
								{/* House Image (Placeholder) */}
								<div className="h-48 relative">
									<div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 mix-blend-overlay z-10"></div>
									{/* Placeholder for actual image */}
									<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
										<Building className="h-12 w-12 text-gray-700" />
									</div>

									{/* Availability Badge */}
									{house.available ? (
										<div className="absolute top-4 right-4 bg-green-900/80 text-green-400 text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
											Available
										</div>
									) : (
										<div className="absolute top-4 right-4 bg-yellow-900/80 text-yellow-400 text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
											Coming Soon
										</div>
									)}
								</div>

								{/* House Content */}
								<div className="p-6">
									<div className="flex items-start justify-between mb-3">
										<h3 className="text-xl font-bold">{house.name}</h3>
									</div>

									<div className="flex items-center mb-4 text-sm text-gray-400">
										<MapPin className="h-4 w-4 mr-1" />
										<span>{house.location}</span>
									</div>

									<p className="text-gray-400 mb-4 line-clamp-3">
										{house.description}
									</p>

									{/* Key Features */}
									<div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
										<div className="flex items-center text-sm">
											<Users className="h-4 w-4 text-blue-400 mr-2" />
											<span>{house.capacity} Residents</span>
										</div>
										<div className="flex items-center text-sm">
											<Wifi className="h-4 w-4 text-blue-400 mr-2" />
											<span>Gigabit Internet</span>
										</div>
										{house.available && (
											<div className="flex items-center text-sm col-span-2">
												<div className="w-full bg-gray-800 rounded-full h-2.5 mr-2">
													<div
														className="bg-blue-600 h-2.5 rounded-full"
														style={{ width: `${(house.occupied / house.capacity) * 100}%` }}
													></div>
												</div>
												<span className="text-xs text-gray-400">{house.occupied}/{house.capacity} Filled</span>
											</div>
										)}
									</div>

									{/* Tags */}
									<div className="flex flex-wrap gap-2 mb-4">
										{house.tags.map((tag, index) => (
											<span key={index} className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded">
												{tag}
											</span>
										))}
									</div>

									{/* Actions */}
									<div className="flex gap-3 mt-4">
										<Button asChild variant="outline" className="flex-1">
											<Link href={`/houses/${house.id}`}>
												View Details
											</Link>
										</Button>
										<Button asChild className={`flex-1 ${!house.available && 'opacity-70'}`} disabled={!house.available}>
											<Link href={house.available ? "/apply" : "#"}>
												{house.available ? "Apply Now" : "Coming Soon"}
												{house.available && <ArrowRight className="ml-2 h-4 w-4" />}
											</Link>
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Map Overview (Placeholder) */}
			<section className="py-20 bg-black">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Locations</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">
							Accelr8 houses are strategically located in tech hubs across the United States,
							with plans to expand globally in the coming years.
						</p>
					</div>

					{/* Map Placeholder */}
					<div className="bg-gray-900 h-[500px] rounded-lg border border-gray-800 flex items-center justify-center">
						<div className="text-center">
							<MapPin className="h-16 w-16 text-gray-700 mx-auto mb-4" />
							<p className="text-gray-400 max-w-md mx-auto">
								Interactive map showing all Accelr8 house locations will be displayed here.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-gradient-to-b from-black to-blue-950">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Find Your Perfect Hacker House
						</h2>
						<p className="text-xl text-gray-300 mb-8">
							Ready to join a community of founders and innovators? Apply today to secure your spot in one of our houses.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/apply">
									Apply Now
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/contact">
									Contact Us
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
}
