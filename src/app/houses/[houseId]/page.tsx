import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowRight,
	ArrowUpRight,
	Bed,
	Building,
	CalendarDays,
	ChefHat,
	Clock,
	Coffee,
	Dumbbell,
	Gamepad2,
	GraduationCap,
	MapPin,
	Monitor,
	Users,
	Wifi,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

// This would be replaced with data fetching from the API/database
const getHouseData = (houseId: string) => {
	// Mock house data - would be fetched from database in production
	const houses = {
		'sf-nob-hill': {
			id: 'sf-nob-hill',
			name: 'San Francisco - Nob Hill',
			location: 'San Francisco, CA',
			address: '1551 Larkin Street, San Francisco, CA 94109',
			description: 'Our flagship location in the heart of San Francisco with stunning city views and easy access to the tech ecosystem. Residents enjoy a modern coliving experience in one of the city\'s most iconic neighborhoods.',
			longDescription: 'Nestled in the historic Nob Hill neighborhood, this house brings together founders and builders in the heart of San Francisco. With panoramic views of the city skyline and nearby landmarks, residents enjoy both inspiration and practical access to the SF tech scene. The house features multiple common areas designed for both focused work and casual collaboration, creating an environment where spontaneous interactions frequently lead to new ideas and partnerships. Weekly dinners, tech talks, and social events help foster a strong sense of community among residents.',
			features: [
				{ name: '20 Residents', icon: <Users className="h-5 w-5 text-blue-400" /> },
				{ name: 'Gigabit Internet', icon: <Wifi className="h-5 w-5 text-blue-400" /> },
				{ name: 'Private & Shared Rooms', icon: <Bed className="h-5 w-5 text-blue-400" /> },
				{ name: 'Full Kitchen', icon: <ChefHat className="h-5 w-5 text-blue-400" /> },
				{ name: 'Weekly Events', icon: <CalendarDays className="h-5 w-5 text-blue-400" /> },
				{ name: '24/7 Access', icon: <Clock className="h-5 w-5 text-blue-400" /> },
			],
			amenities: [
				{ name: 'Dedicated Workspaces', icon: <Monitor className="h-5 w-5" /> },
				{ name: 'Conference Room', icon: <Users className="h-5 w-5" /> },
				{ name: 'Rooftop Deck', icon: <Building className="h-5 w-5" /> },
				{ name: 'Cafe Area', icon: <Coffee className="h-5 w-5" /> },
				{ name: 'Gym Access', icon: <Dumbbell className="h-5 w-5" /> },
				{ name: 'Game Room', icon: <Gamepad2 className="h-5 w-5" /> },
				{ name: 'Learning Library', icon: <GraduationCap className="h-5 w-5" /> },
			],
			roomTypes: [
				{
					name: 'Private Room',
					description: 'Your own private bedroom with a shared bathroom and all house amenities.',
					price: '$2,200/month',
					availability: 'Limited Availability',
				},
				{
					name: 'Premium Private',
					description: 'Larger private room with extra space and a dedicated workspace area.',
					price: '$2,800/month',
					availability: 'Waitlist Only',
				},
				{
					name: 'Shared Room (2-3 people)',
					description: 'Shared bedroom with 1-2 roommates, perfect for those prioritizing affordability.',
					price: '$1,400/month',
					availability: 'Available Now',
				}
			],
			events: [
				{
					name: 'Weekly Founder Dinner',
					description: 'Community dinner every Thursday with occasional guest speakers.',
				},
				{
					name: 'Demo Day Prep',
					description: 'Monthly practice sessions for founders preparing for investor pitches.',
				},
				{
					name: 'Hackathons',
					description: 'Quarterly weekend-long building sessions focused on specific themes.',
				}
			],
			nearby: [
				{ name: 'Tech Companies', distance: 'Multiple within 2 miles' },
				{ name: 'Cafes & Restaurants', distance: '5+ within walking distance' },
				{ name: 'Public Transportation', distance: '0.3 miles to MUNI' },
				{ name: 'Grocery Stores', distance: '2 within 0.5 miles' },
			],
			testimonials: [
				{
					quote: "Living at Accelr8 was transformative for my startup. The connections I made led to our first angel investment.",
					author: "Sarah J., Founder of TechLift",
				},
				{
					quote: "The perfect environment to build. I've lived in three different hacker houses and this one has the best community by far.",
					author: "Michael T., Software Engineer",
				}
			],
			community: {
				residentCount: 20,
				occupancy: 18,
				backgrounds: ['Software Engineers', 'Founders', 'Product Designers', 'ML/AI Specialists'],
				companies: ['YC Alumni', 'Early-stage startups', 'Big Tech veterans']
			},
			tags: ['Startup Focused', 'Great Location', 'Tech Hub'],
			available: true,
			capacity: 20,
			occupied: 18,
		},
		// Additional houses would be added here
	};

	return houses[houseId as keyof typeof houses];
};

// This is used to generate static metadata for each house page
export async function generateMetadata({ params }: { params: { houseId: string; }; }): Promise<Metadata> {
	const house = getHouseData(params.houseId);

	if (!house) {
		return {
			title: 'House Not Found | Accelr8',
		};
	}

	return {
		title: `${house.name} | Accelr8 Houses`,
		description: house.description,
	};
}

export default function HouseDetailsPage({ params }: { params: { houseId: string; }; }) {
	const house = getHouseData(params.houseId);

	if (!house) {
		return (
			<PublicLayout>
				<div className="container mx-auto px-4 py-32">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-4">House Not Found</h1>
						<p className="text-gray-400 mb-8">The house you're looking for doesn't exist or has been moved.</p>
						<Button asChild>
							<Link href="/houses">
								View All Houses
							</Link>
						</Button>
					</div>
				</div>
			</PublicLayout>
		);
	}

	return (
		<PublicLayout>
			{/* Hero Section with House Image */}
			<section className="relative pt-32 overflow-hidden">
				<div className="h-[300px] md:h-[500px] w-full relative">
					<div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950/90 z-10"></div>

					{/* Placeholder for actual house image */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-overlay"></div>
					<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
						<Building className="h-20 w-20 text-gray-700" />
					</div>

					{/* House name and location overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
						<div className="container mx-auto">
							<div className="max-w-4xl">
								<div className="flex flex-wrap gap-2 mb-3">
									{house.tags.map((tag, index) => (
										<Badge key={index} variant="secondary" className="bg-blue-900/50 text-blue-300 border-blue-800">
											{tag}
										</Badge>
									))}

									{house.available ? (
										<Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-800">
											Available
										</Badge>
									) : (
										<Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300 border-yellow-800">
											Coming Soon
										</Badge>
									)}
								</div>

								<h1 className="text-3xl md:text-5xl font-bold mb-2">{house.name}</h1>

								<div className="flex items-center text-gray-300 mb-4">
									<MapPin className="h-5 w-5 mr-2" />
									<span>{house.address}</span>
								</div>

								<p className="text-xl text-gray-300 max-w-2xl">
									{house.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-12 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column - Main Content */}
						<div className="lg:col-span-2">
							{/* Tabbed Content */}
							<Tabs defaultValue="overview" className="w-full mb-8">
								<TabsList className="w-full mb-8 bg-gray-900">
									<TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
									<TabsTrigger value="rooms" className="flex-1">Room Types</TabsTrigger>
									<TabsTrigger value="community" className="flex-1">Community</TabsTrigger>
									<TabsTrigger value="neighborhood" className="flex-1">Neighborhood</TabsTrigger>
								</TabsList>

								{/* Overview Tab */}
								<TabsContent value="overview" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">About This House</h2>
										<p className="text-gray-300 mb-4">{house.longDescription}</p>
									</div>

									{/* Features Grid */}
									<div>
										<h3 className="text-xl font-bold mb-4">Key Features</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{house.features.map((feature, index) => (
												<div key={index} className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
													{feature.icon}
													<span className="ml-3">{feature.name}</span>
												</div>
											))}
										</div>
									</div>

									{/* Amenities */}
									<div>
										<h3 className="text-xl font-bold mb-4">Amenities</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											{house.amenities.map((amenity, index) => (
												<div key={index} className="flex flex-col items-center p-3 text-center bg-gray-900 rounded-lg border border-gray-800">
													<div className="mb-2 bg-blue-900/20 p-2 rounded-full">
														{amenity.icon}
													</div>
													<span className="text-sm">{amenity.name}</span>
												</div>
											))}
										</div>
									</div>

									{/* Events & Programming */}
									<div>
										<h3 className="text-xl font-bold mb-4">Events & Programming</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											{house.events.map((event, index) => (
												<div key={index} className="p-4 bg-gray-900 rounded-lg border border-gray-800">
													<h4 className="font-semibold mb-2">{event.name}</h4>
													<p className="text-sm text-gray-400">{event.description}</p>
												</div>
											))}
										</div>
									</div>

									{/* Testimonials */}
									<div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6">
										<h3 className="text-xl font-bold mb-6">What Residents Say</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{house.testimonials.map((testimonial, index) => (
												<div key={index} className="bg-gray-900/60 p-4 rounded-lg border border-gray-800">
													<p className="italic text-gray-300 mb-3">"{testimonial.quote}"</p>
													<p className="text-sm text-blue-400">— {testimonial.author}</p>
												</div>
											))}
										</div>
									</div>
								</TabsContent>

								{/* Rooms Tab */}
								<TabsContent value="rooms" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-6">Room Options</h2>
										<p className="text-gray-300 mb-6">
											We offer different room types to accommodate various preferences and budgets.
											All rooms include access to house amenities and community events.
										</p>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											{house.roomTypes.map((room, index) => (
												<div key={index} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
													{/* Room Image Placeholder */}
													<div className="h-40 bg-gray-800 flex items-center justify-center">
														<Bed className="h-10 w-10 text-gray-700" />
													</div>

													<div className="p-4">
														<div className="flex justify-between items-start mb-2">
															<h3 className="text-lg font-semibold">{room.name}</h3>
															<span className="text-blue-400 font-medium">{room.price}</span>
														</div>
														<p className="text-sm text-gray-400 mb-3">{room.description}</p>
														<div className={`text-xs px-2 py-1 rounded-full inline-block ${room.availability === 'Available Now'
															? 'bg-green-900/30 text-green-400'
															: room.availability === 'Limited Availability'
																? 'bg-yellow-900/30 text-yellow-400'
																: 'bg-gray-800 text-gray-400'
															}`}>
															{room.availability}
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</TabsContent>

								{/* Community Tab */}
								<TabsContent value="community" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">Community Profile</h2>
										<p className="text-gray-300 mb-6">
											Our residents form a diverse and talented community of builders, creators, and innovators.
										</p>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
											<div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
												<h3 className="text-lg font-semibold mb-4">Resident Backgrounds</h3>
												<ul className="space-y-2">
													{house.community.backgrounds.map((background, index) => (
														<li key={index} className="flex items-center">
															<span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
															{background}
														</li>
													))}
												</ul>
											</div>

											<div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
												<h3 className="text-lg font-semibold mb-4">Companies & Projects</h3>
												<ul className="space-y-2">
													{house.community.companies.map((company, index) => (
														<li key={index} className="flex items-center">
															<span className="h-2 w-2 bg-purple-400 rounded-full mr-3"></span>
															{company}
														</li>
													))}
												</ul>
											</div>
										</div>

										{/* Current Occupancy */}
										<div className="bg-gray-900 rounded-lg border border-gray-800 p-5">
											<div className="flex items-center justify-between mb-3">
												<h3 className="text-lg font-semibold">Current Occupancy</h3>
												<span className="text-gray-400">{house.occupied}/{house.capacity} Residents</span>
											</div>

											<div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
												<div
													className="bg-blue-600 h-2.5 rounded-full"
													style={{ width: `${(house.occupied / house.capacity) * 100}%` }}
												></div>
											</div>

											<p className="text-sm text-gray-400">
												{house.capacity - house.occupied} spots currently available for new residents.
											</p>
										</div>
									</div>
								</TabsContent>

								{/* Neighborhood Tab */}
								<TabsContent value="neighborhood" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">Neighborhood</h2>
										<p className="text-gray-300 mb-6">
											Located in the vibrant Nob Hill neighborhood of San Francisco, the house offers
											easy access to a variety of amenities and attractions.
										</p>

										{/* Map Placeholder */}
										<div className="h-[300px] bg-gray-900 rounded-lg border border-gray-800 mb-8 flex items-center justify-center">
											<div className="text-center">
												<MapPin className="h-12 w-12 text-gray-700 mx-auto mb-4" />
												<p className="text-gray-400">Interactive map will be displayed here</p>
											</div>
										</div>

										<h3 className="text-xl font-bold mb-4">Nearby Amenities</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{house.nearby.map((item, index) => (
												<div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
													<span>{item.name}</span>
													<span className="text-sm text-gray-400">{item.distance}</span>
												</div>
											))}
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>

						{/* Right Column - Application */}
						<div className="lg:col-span-1">
							<div className="bg-gray-900 rounded-lg border border-gray-800 p-6 sticky top-28">
								<h2 className="text-2xl font-bold mb-4">Interested in this house?</h2>

								{house.available ? (
									<>
										<p className="text-gray-300 mb-6">
											Apply now to secure your spot at our {house.name} location. The application process
											takes about 10-15 minutes.
										</p>

										<div className="space-y-4">
											<Button asChild className="w-full">
												<Link href="/apply">
													Apply Now
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>

											<Button asChild variant="outline" className="w-full">
												<Link href="/apply?type=tour">
													Schedule a Tour
												</Link>
											</Button>

											<Button asChild variant="secondary" className="w-full">
												<Link href="/contact">
													Contact Us
												</Link>
											</Button>
										</div>

										<div className="mt-6 pt-6 border-t border-gray-800">
											<h3 className="font-semibold mb-2">Have Questions?</h3>
											<p className="text-sm text-gray-400 mb-4">
												Reach out to our team or check our FAQ for more information about the application process.
											</p>
											<Link
												href="/faq"
												className="text-blue-400 text-sm flex items-center hover:text-blue-300 transition-colors"
											>
												Read our FAQ
												<ArrowUpRight className="ml-1 h-3 w-3" />
											</Link>
										</div>
									</>
								) : (
									<>
										<div className="bg-yellow-900/20 text-yellow-300 px-4 py-3 rounded-md border border-yellow-900/50 mb-6">
											This house is coming soon! Join our waitlist to be notified when it opens.
										</div>

										<Button asChild className="w-full mb-4">
											<Link href="/apply?waitlist=true">
												Join Waitlist
											</Link>
										</Button>

										<p className="text-sm text-gray-400">
											We'll notify you as soon as this location becomes available.
										</p>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related Houses Section */}
			<section className="py-16 bg-black">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-8">Other Houses You Might Like</h2>

					{/* This would be populated with other houses */}
					<div className="text-center py-6 bg-gray-900 rounded-lg border border-gray-800">
						<p className="text-gray-400">
							More house options will be displayed here.
						</p>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
}
