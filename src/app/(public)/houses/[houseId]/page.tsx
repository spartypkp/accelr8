import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHouse } from "@/lib/api/houses";
import { getRoomsByHouse } from "@/lib/api/rooms";
import { urlFor } from "@/lib/sanity/client";
import {
	ArrowRight,
	Bed,
	Building,
	CalendarDays,
	ChefHat,
	Clock,
	Coffee,
	MapPin,
	Monitor,
	Users,
	Wifi
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// This is used to generate static metadata for each house page
export async function generateMetadata({ params }: { params: { houseId: string; }; }): Promise<Metadata> {
	const house = await getHouse(params.houseId);

	if (!house) {
		return {
			title: 'House Not Found | Accelr8',
		};
	}

	return {
		title: `${house.sanityHouse?.name} | Accelr8 Houses`,
		description: house.sanityHouse?.shortDescription,
	};
}

export default async function HouseDetailsPage({ params }: { params: { houseId: string; }; }) {
	const house = await getHouse(params.houseId);

	if (!house) {
		notFound();
	}

	// Get rooms for this house
	const rooms = await getRoomsByHouse(params.houseId);

	// Count available and occupied rooms
	const totalRooms = rooms.length || 0;
	const availableRooms = rooms.filter(room => room.status === 'available').length || 0;
	const occupiedRooms = totalRooms - availableRooms;

	// Room types based on room data
	const roomTypes = rooms.length > 0 ? [
		...new Set(rooms.map(room => room.sanityRoomType?.name || 'Standard'))
	].map((type: string) => {
		const roomsOfType = rooms.filter(room => room.sanityRoomType?.name === type);
		const availableOfType = roomsOfType.filter(room => room.status === 'available').length;

		return {
			name: type,
			description: type.toLowerCase().includes('single') ? 'Your own private bedroom' : 'Shared bedroom with 1-2 roommates',
			price: `$${Math.min(...roomsOfType.map(r => r.current_price || r.sanityRoomType?.basePrice || 1400))}/month`,
			availability: availableOfType > 0 ? 'Available Now' : 'Waitlist Only'
		};
	}) : [];

	// Placeholder features since we don't have this data yet
	const features = [
		{ name: `${totalRooms} Rooms Total`, icon: <Users className="h-5 w-5 text-primary" /> },
		{ name: 'Gigabit Internet', icon: <Wifi className="h-5 w-5 text-primary" /> },
		{ name: 'Private & Shared Rooms', icon: <Bed className="h-5 w-5 text-primary" /> },
		{ name: 'Full Kitchen', icon: <ChefHat className="h-5 w-5 text-primary" /> },
		{ name: 'Weekly Events', icon: <CalendarDays className="h-5 w-5 text-primary" /> },
		{ name: '24/7 Access', icon: <Clock className="h-5 w-5 text-primary" /> },
	];

	return (
		<PublicLayout>
			{/* Hero Section with House Image */}
			<section className="relative pt-32 overflow-hidden">
				<div className="h-[300px] md:h-[500px] w-full relative">
					<div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background/90 z-10"></div>

					{/* House image */}
					{house.sanityHouse?.mainImage ? (
						<Image
							src={urlFor(house.sanityHouse.mainImage).width(1200).url()}
							alt={house.sanityHouse?.name || 'House image'}
							fill
							style={{ objectFit: 'cover' }}
							priority
						/>
					) : (
						<div className="absolute inset-0 bg-muted flex items-center justify-center">
							<Building className="h-20 w-20 text-muted-foreground" />
						</div>
					)}

					{/* House name and location overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
						<div className="container mx-auto">
							<div className="max-w-4xl">
								<div className="flex flex-wrap gap-2 mb-3">
									{house.sanityHouse?.amenities?.slice(0, 3).map((amenity, index) => (
										<Badge key={amenity._key || index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
											{amenity.name}
										</Badge>
									))}

									<Badge variant="secondary" className="bg-success/10 text-success border-success/20">
										Available
									</Badge>
								</div>

								<h1 className="text-3xl md:text-5xl font-bold mb-2">{house.sanityHouse?.name}</h1>

								<div className="flex items-center text-muted-foreground mb-4">
									<MapPin className="h-5 w-5 mr-2" />
									<span>{house.sanityHouse?.location?.address}, {house.sanityHouse?.location?.city}, {house.sanityHouse?.location?.state}</span>
								</div>

								<p className="text-xl text-muted-foreground max-w-2xl">
									{house.sanityHouse?.shortDescription}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-12 bg-background">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column - Main Content */}
						<div className="lg:col-span-2">
							{/* Tabbed Content */}
							<Tabs defaultValue="overview" className="w-full mb-8">
								<TabsList className="w-full mb-8 bg-card">
									<TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
									<TabsTrigger value="rooms" className="flex-1">Room Types</TabsTrigger>
									<TabsTrigger value="community" className="flex-1">Community</TabsTrigger>
									<TabsTrigger value="neighborhood" className="flex-1">Neighborhood</TabsTrigger>
								</TabsList>

								{/* Overview Tab */}
								<TabsContent value="overview" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">About This House</h2>
										<p className="text-muted-foreground mb-4">{house.sanityHouse?.shortDescription}</p>
										{house.sanityHouse?.fullDescription && (
											<div className="mt-4">
												{/* Here you would use PortableText to render the fullDescription properly */}
												<p className="text-muted-foreground">This house offers a unique living experience for tech professionals and founders.</p>
											</div>
										)}
									</div>

									{/* Features Grid */}
									<div>
										<h3 className="text-xl font-bold mb-4">Key Features</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{features.map((feature, index) => (
												<div key={index} className="flex items-center p-3 bg-card rounded-lg border border-border">
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
											{house.sanityHouse?.amenities?.map((amenity, index) => (
												<div key={amenity._key || index} className="flex flex-col items-center p-3 text-center bg-card rounded-lg border border-border">
													<div className="mb-2 bg-primary/10 p-2 rounded-full">
														<Monitor className="h-5 w-5" />
													</div>
													<span className="text-sm">{amenity.name}</span>
												</div>
											))}
										</div>
									</div>

									{/* Photo Gallery */}
									<div>
										<h3 className="text-xl font-bold mb-4">Photo Gallery</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{house.sanityHouse?.galleryImages?.slice(0, 6).map((image, index) => (
												<div key={index} className="aspect-square relative rounded-lg overflow-hidden border border-border">
													<Image
														src={urlFor(image).width(400).height(400).url()}
														alt={`${house.sanityHouse?.name} - Photo ${index + 1}`}
														fill
														style={{ objectFit: 'cover' }}
													/>
												</div>
											))}

											{/* If no gallery images, show placeholders */}
											{(!house.sanityHouse?.galleryImages || house.sanityHouse?.galleryImages.length === 0) && Array(6).fill(0).map((_, index) => (
												<div key={index} className="aspect-square relative rounded-lg overflow-hidden border border-border bg-card flex items-center justify-center">
													<Building className="h-8 w-8 text-muted-foreground" />
												</div>
											))}
										</div>
									</div>
								</TabsContent>

								{/* Rooms Tab */}
								<TabsContent value="rooms" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">Room Options</h2>
										<p className="text-muted-foreground mb-6">
											We offer various room types to fit different preferences and budgets. All rooms include access to house amenities and common spaces.
										</p>

										{roomTypes.length > 0 ? (
											<div className="space-y-6">
												{roomTypes.map((room, index) => (
													<div key={index} className="bg-card p-6 rounded-lg border border-border">
														<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
															<h3 className="text-xl font-bold">{room.name}</h3>
															<div className="flex items-center mt-2 md:mt-0">
																<p className="text-primary font-bold">{room.price}</p>
																<Badge className="ml-3 bg-muted">{room.availability}</Badge>
															</div>
														</div>
														<p className="text-muted-foreground mb-4">{room.description}</p>
													</div>
												))}
											</div>
										) : (
											<div className="bg-card p-6 rounded-lg border border-border">
												<p>Room information is currently being updated. Please contact us for details.</p>
											</div>
										)}

										<div className="mt-8">
											<h3 className="text-xl font-bold mb-4">What's Included</h3>
											<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>Utilities (electricity, water, gas)</span>
												</li>
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>High-speed internet</span>
												</li>
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>Weekly cleaning of common areas</span>
												</li>
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>Access to all house amenities</span>
												</li>
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>Community events</span>
												</li>
												<li className="flex items-center">
													<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
													<span>Basic kitchen supplies</span>
												</li>
											</ul>
										</div>
									</div>
								</TabsContent>

								{/* Community Tab */}
								<TabsContent value="community" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">Our Community</h2>
										<p className="text-muted-foreground mb-6">
											{house.sanityHouse?.name} is home to a diverse group of founders, engineers, designers, and other tech professionals focused on building remarkable products.
										</p>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
											<div className="bg-card p-6 rounded-lg border border-border">
												<h3 className="text-lg font-bold mb-3">Current Residents</h3>
												<div className="flex items-center mb-4">
													<div className="w-full bg-muted rounded-full h-2.5 mr-2">
														<div
															className="bg-primary h-2.5 rounded-full"
															style={{ width: `${totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0}%` }}
														></div>
													</div>
													<span className="text-sm text-muted-foreground">{occupiedRooms}/{totalRooms} Rooms Filled</span>
												</div>
												<p className="text-muted-foreground">
													A tight-knit community of tech professionals collaborating and building together.
												</p>
											</div>

											<div className="bg-card p-6 rounded-lg border border-border">
												<h3 className="text-lg font-bold mb-3">Resident Backgrounds</h3>
												<ul className="space-y-2">
													<li className="flex items-center">
														<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
														<span>Software Engineers</span>
													</li>
													<li className="flex items-center">
														<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
														<span>Startup Founders</span>
													</li>
													<li className="flex items-center">
														<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
														<span>Product Designers</span>
													</li>
													<li className="flex items-center">
														<div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
														<span>AI/ML Specialists</span>
													</li>
												</ul>
											</div>
										</div>

										<div>
											<h3 className="text-xl font-bold mb-4">Community Events</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="bg-card p-5 rounded-lg border border-border">
													<h4 className="font-bold mb-2">Weekly Founder Dinner</h4>
													<p className="text-muted-foreground text-sm">Community dinner every Thursday with occasional guest speakers.</p>
												</div>
												<div className="bg-card p-5 rounded-lg border border-border">
													<h4 className="font-bold mb-2">Demo Day Prep</h4>
													<p className="text-muted-foreground text-sm">Monthly practice sessions for founders preparing for investor pitches.</p>
												</div>
												<div className="bg-card p-5 rounded-lg border border-border">
													<h4 className="font-bold mb-2">Hackathons</h4>
													<p className="text-muted-foreground text-sm">Quarterly weekend-long building sessions focused on specific themes.</p>
												</div>
												<div className="bg-card p-5 rounded-lg border border-border">
													<h4 className="font-bold mb-2">Social Mixers</h4>
													<p className="text-muted-foreground text-sm">Regular social events to help residents connect and unwind.</p>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>

								{/* Neighborhood Tab */}
								<TabsContent value="neighborhood" className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">The Neighborhood</h2>
										<p className="text-muted-foreground mb-6">
											Located in {house.sanityHouse?.location?.city}, our house provides easy access to local amenities and the tech community.
										</p>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
											<div>
												<h3 className="text-xl font-bold mb-4">What's Nearby</h3>
												<ul className="space-y-4">
													<li className="flex">
														<div className="mt-1 mr-3 bg-primary/10 p-1.5 rounded-full">
															<Building className="h-4 w-4 text-primary" />
														</div>
														<div>
															<span className="font-medium block">Tech Companies</span>
															<span className="text-sm text-muted-foreground">Multiple within 2 miles</span>
														</div>
													</li>
													<li className="flex">
														<div className="mt-1 mr-3 bg-primary/10 p-1.5 rounded-full">
															<Coffee className="h-4 w-4 text-primary" />
														</div>
														<div>
															<span className="font-medium block">Cafes & Restaurants</span>
															<span className="text-sm text-muted-foreground">Several within walking distance</span>
														</div>
													</li>
													<li className="flex">
														<div className="mt-1 mr-3 bg-primary/10 p-1.5 rounded-full">
															<MapPin className="h-4 w-4 text-primary" />
														</div>
														<div>
															<span className="font-medium block">Public Transportation</span>
															<span className="text-sm text-muted-foreground">Easily accessible</span>
														</div>
													</li>
												</ul>
											</div>

											<div>
												<h3 className="text-xl font-bold mb-4">Map Location</h3>
												<div className="bg-card p-4 rounded-lg border border-border h-[200px] flex items-center justify-center">
													<MapPin className="h-10 w-10 text-muted-foreground mb-2" />
													<p className="text-center text-muted-foreground">
														Interactive map will be displayed here.
													</p>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>

						{/* Right Column - Fixed Sidebar */}
						<div>
							<div className="bg-card p-6 rounded-lg border border-border sticky top-24">
								<h3 className="text-xl font-bold mb-4">Interested in This House?</h3>

								<div className="mb-6">
									<div className="flex items-center justify-between mb-2">
										<span className="font-medium">Availability:</span>
										<span className="text-success">Rooms Available</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="font-medium">Starting at:</span>
										<span className="text-primary font-bold">
											{roomTypes.length > 0
												? roomTypes.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''))).map(room => room.price)[0]
												: '$1,400/month'
											}
										</span>
									</div>
								</div>

								<div className="space-y-3">
									<Button asChild className="w-full">
										<Link href="/apply">
											Apply Now
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>

								</div>

								<div className="mt-6 pt-6 border-t border-border">
									<h4 className="font-bold mb-3">Quick Facts</h4>
									<ul className="space-y-2">
										<li className="flex justify-between">
											<span className="text-muted-foreground">Total Rooms:</span>
											<span>{totalRooms}</span>
										</li>
										<li className="flex justify-between">
											<span className="text-muted-foreground">Available Now:</span>
											<span>{availableRooms}</span>
										</li>
										<li className="flex justify-between">
											<span className="text-muted-foreground">Minimum Stay:</span>
											<span>1 month</span>
										</li>
										<li className="flex justify-between">
											<span className="text-muted-foreground">Move-in:</span>
											<span>Flexible</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 bg-gradient-primary">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4 text-primary-foreground">Frequently Asked Questions</h2>
						<p className="text-primary-foreground/80 max-w-2xl mx-auto">
							Here are some common questions about living at {house.sanityHouse?.name}.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						<div className="bg-white/10 p-6 rounded-lg border border-white/20">
							<h3 className="text-lg font-bold mb-2 text-primary-foreground">What is the application process?</h3>
							<p className="text-primary-foreground/80">
								Submit an application, followed by a video or in-person interview. We review applications holistically, focusing on your background, interests, and potential contribution to the community.
							</p>
						</div>
						<div className="bg-white/10 p-6 rounded-lg border border-white/20">
							<h3 className="text-lg font-bold mb-2 text-primary-foreground">What's included in the rent?</h3>
							<p className="text-primary-foreground/80">
								All utilities, high-speed internet, weekly cleaning of common areas, and access to all house amenities and community events.
							</p>
						</div>
						<div className="bg-white/10 p-6 rounded-lg border border-white/20">
							<h3 className="text-lg font-bold mb-2 text-primary-foreground">How long can I stay?</h3>
							<p className="text-primary-foreground/80">
								Minimum stay is 1 month, but most residents stay 3-6 months or longer. We offer flexible terms to accommodate your needs.
							</p>
						</div>
						<div className="bg-white/10 p-6 rounded-lg border border-white/20">
							<h3 className="text-lg font-bold mb-2 text-primary-foreground">Can I bring guests?</h3>
							<p className="text-primary-foreground/80">
								Yes, residents can have guests during reasonable hours. Overnight guests are allowed with some limitations to maintain community balance.
							</p>
						</div>
					</div>

					<div className="text-center mt-10">
						<Button asChild variant="secondary">
							<a href="mailto:hello@accelr8.io">
								Ask More Questions
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-accent">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Ready to Join Our Community?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Apply now to secure your spot at {house.sanityHouse?.name} and start collaborating with other ambitious builders.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/apply">
									Apply Now
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<a href="mailto:hello@accelr8.io">
									Contact Us
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
}
