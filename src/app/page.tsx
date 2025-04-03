import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { getHouses, type SanityHouse } from "@/lib/api";
import { urlFor } from "@/lib/sanity";
import { ArrowRight, Building, Calendar, CalendarDays, ChevronRight, DollarSign, Handshake, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Accelr8 - Community Living for Founders & Builders",
	description: "Join a high-density network of ambitious founders in San Francisco. Live, build, and grow with exceptional peers in a space designed for innovation.",
};

export default async function HomePage() {
	// Fetch house data from the API
	const houses: SanityHouse[] = await getHouses();
	const featuredHouses = houses?.filter(house => house.featured) || houses?.slice(0, 3) || [];

	return (
		<PublicLayout>
			{/* Hero Section - Full-height, visually focused */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-black z-0">
					<Image
						src="/hero-background.jpg"
						alt="Accelr8 Community"
						fill
						className="object-cover opacity-50"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black/60 to-black"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10 py-32 text-center">
					<div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-8">
						<span className="mr-2">✦</span> A new model for founder living
					</div>

					<h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-4xl mx-auto">
						Where <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">exceptional founders</span> live and build together
					</h1>

					<p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12">
						The high-talent-density living space designed for ambitious builders in San Francisco
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-7 text-xl">
							<Link href="/apply">
								Apply Now
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="px-8 py-7 text-xl">
							<Link href="/story">
								Our Story
							</Link>
						</Button>
					</div>
				</div>

				<div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
					<ChevronRight className="h-10 w-10 rotate-90 text-gray-500" />
				</div>
			</section>

			{/* Proof Points Section - Clean, centered stats */}
			<section className="py-24 bg-black">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 text-center max-w-5xl mx-auto">
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">40+</p>
							<p className="text-gray-400 text-lg">Ambitious Founders</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">15+</p>
							<p className="text-gray-400 text-lg">Startups Launched</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">100+</p>
							<p className="text-gray-400 text-lg">Community Events</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">$10M+</p>
							<p className="text-gray-400 text-lg">Funding Raised</p>
						</div>
					</div>
				</div>
			</section>

			{/* Main Visual Feature Section */}
			<section className="py-24 bg-gray-950 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Life at Accelr8
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Our community is designed to create the perfect environment for founders
						</p>
					</div>

					<div className="relative aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden mb-24">
						<Image
							src="/accelr8-feature.jpg"
							alt="Accelr8 Community Life"
							fill
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
							<div className="p-8">
								<h3 className="text-2xl font-bold mb-2">Weekly community dinners</h3>
								<p className="text-gray-300">Where connections and collaborations begin</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="aspect-square relative rounded-2xl overflow-hidden group">
							<Image
								src="/hackathon.jpg"
								alt="Accelr8 Hackathon"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2">Weekly Hackathons</h3>
									<p className="text-gray-300">Build, test, and iterate together</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group">
							<Image
								src="/dinner.jpg"
								alt="Founder Dinner"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2">Founder Dinners</h3>
									<p className="text-gray-300">Connect and share experiences</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group">
							<Image
								src="/pitch.jpg"
								alt="Pitch Day"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2">Investor Pitch Days</h3>
									<p className="text-gray-300">Showcase to VCs and angel investors</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Solution Section (Simplified) */}
			<section className="py-32 bg-black overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Our solution: high-density founder living
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							We've solved the biggest challenges founders face
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12 max-w-5xl mx-auto">
						<div className="flex flex-col items-center text-center p-6">
							<div className="bg-blue-600/20 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<Users className="h-12 w-12 text-blue-400" />
							</div>
							<h3 className="text-2xl font-bold mb-3">Curated Community</h3>
							<p className="text-gray-400 text-lg">
								Live with exceptional builders who have complementary skills and aligned ambitions
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6">
							<div className="bg-purple-600/20 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<Handshake className="h-12 w-12 text-purple-400" />
							</div>
							<h3 className="text-2xl font-bold mb-3">Co-Founder Matching</h3>
							<p className="text-gray-400 text-lg">
								Find your technical or business co-founder through organic interactions, not forced networking
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6">
							<div className="bg-green-600/20 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<DollarSign className="h-12 w-12 text-green-400" />
							</div>
							<h3 className="text-2xl font-bold mb-3">Investor Network</h3>
							<p className="text-gray-400 text-lg">
								Access to VCs and angel investors through warm introductions and pitch events
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6">
							<div className="bg-yellow-600/20 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<TrendingUp className="h-12 w-12 text-yellow-400" />
							</div>
							<h3 className="text-2xl font-bold mb-3">Peer Accountability</h3>
							<p className="text-gray-400 text-lg">
								Progress faster with the energy and accountability of building alongside other founders
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonial Section with Large Image */}
			<section className="py-32 bg-gray-950 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Success Stories
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Hear from founders who found success in our community
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
						<div className="h-[500px] lg:h-[600px] relative rounded-2xl overflow-hidden">
							<Image
								src="/founder-story.jpg"
								alt="Founder Success Story"
								fill
								className="object-cover"
							/>
						</div>

						<div className="relative">
							<div className="absolute -top-12 -left-12">
								<Star className="h-20 w-20 text-yellow-500 fill-yellow-500 opacity-30" />
							</div>

							<div className="relative z-10">
								<p className="text-2xl text-gray-300 mb-10 leading-relaxed">
									"I moved in without a clear idea and within weeks found my technical co-founder at a house hackathon. Six months later, we closed our seed round. The density of talent here is unmatched."
								</p>

								<div className="flex items-center gap-5">
									<div className="w-16 h-16 rounded-full overflow-hidden relative">
										<Image src="/founder1.jpg" alt="Founder" fill className="object-cover" />
									</div>
									<div>
										<p className="text-xl font-bold">Sarah Chen</p>
										<p className="text-gray-400">Founder, NeuralPath AI</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Houses Section - Visual Grid */}
			<section className="py-32 bg-black overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Our Houses
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Purpose-designed living spaces for founders
						</p>
					</div>

					{featuredHouses?.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
							{featuredHouses.map((house) => (
								<div
									key={house._id}
									className="group relative"
								>
									{/* House Image - Full bleed */}
									<div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
										{house.mainImage ? (
											<Image
												src={urlFor(house.mainImage).width(800).height(1000).url()}
												alt={house.name}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										) : (
											<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
												<Building className="h-24 w-24 text-gray-700" />
											</div>
										)}

										{/* Availability Badge */}
										<div className="absolute top-6 right-6 bg-green-900/80 text-green-400 text-sm px-3 py-1 rounded-full backdrop-blur-sm z-20">
											Available
										</div>
									</div>

									{/* House Content - Overlay */}
									<div className="absolute bottom-0 left-0 right-0 p-8 z-20">
										<h3 className="text-2xl font-bold mb-2">{house.name}</h3>
										<div className="flex items-center mb-4 text-sm text-gray-300">
											<MapPin className="h-4 w-4 mr-2" />
											<span>{house.location?.city}, {house.location?.state}</span>
										</div>

										<Button asChild className="mt-4 w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
											<Link href={`/houses/${house.slug?.current}`}>
												View Details
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-20 max-w-xl mx-auto">
							<Building className="h-24 w-24 text-gray-700 mx-auto mb-6" />
							<h3 className="text-2xl font-bold mb-4">New Houses Coming Soon</h3>
							<p className="text-gray-400 text-lg mb-8">
								We're expanding our network of houses. Join the waitlist to be notified when new locations open.
							</p>
							<Button asChild size="lg" className="px-8 py-6 text-xl">
								<a href="mailto:hello@accelr8.io">
									Join Waitlist
								</a>
							</Button>
						</div>
					)}

					<div className="text-center mt-16">
						<Button asChild variant="outline" size="lg" className="px-8 py-6 text-xl">
							<Link href="/houses">
								View All Locations
								<ChevronRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Application Process - Simple Steps */}
			<section className="py-32 bg-gray-950 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							How to Join
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Our application process is designed to find exceptional founders
						</p>
					</div>

					<div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
						<div className="flex-1 flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800">
							<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mb-6">1</div>
							<h3 className="text-2xl font-bold mb-3">Apply Online</h3>
							<p className="text-gray-400 text-lg">
								Tell us about yourself and your company in our 10-minute application
							</p>
						</div>

						<div className="flex-1 flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800">
							<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mb-6">2</div>
							<h3 className="text-2xl font-bold mb-3">Interview</h3>
							<p className="text-gray-400 text-lg">
								Selected applicants join a 30-minute video call with our team
							</p>
						</div>

						<div className="flex-1 flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800">
							<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mb-6">3</div>
							<h3 className="text-2xl font-bold mb-3">Move In</h3>
							<p className="text-gray-400 text-lg">
								Accepted founders receive move-in details and join the community
							</p>
						</div>
					</div>

					<div className="text-center mt-16">
						<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-xl">
							<Link href="/apply">
								Start Your Application
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Community Events Section */}
			<section className="py-32 bg-black overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Community Events
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Connect, learn, and grow with our workshops, hackathons, and networking opportunities
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600 transition-colors">
							<div className="h-48 bg-gray-800 relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-gray-700" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold">Founder Dinner Series</h3>
									<span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Networking</span>
								</div>
								<p className="text-gray-400 text-sm mb-4">Join us for our monthly dinner with founders and investors in the Bay Area tech ecosystem.</p>
								<div className="space-y-2 mb-6">
									<div className="flex items-center text-gray-400 text-sm">
										<CalendarDays className="h-4 w-4 mr-2" />
										<span>Monthly</span>
									</div>
									<div className="flex items-center text-gray-400 text-sm">
										<MapPin className="h-4 w-4 mr-2" />
										<span>San Francisco House</span>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600 transition-colors">
							<div className="h-48 bg-gray-800 relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-gray-700" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold">AI Hackathon Weekend</h3>
									<span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Hackathon</span>
								</div>
								<p className="text-gray-400 text-sm mb-4">48-hour hackathon focused on building AI-powered applications with mentorship from industry experts.</p>
								<div className="space-y-2 mb-6">
									<div className="flex items-center text-gray-400 text-sm">
										<CalendarDays className="h-4 w-4 mr-2" />
										<span>Quarterly</span>
									</div>
									<div className="flex items-center text-gray-400 text-sm">
										<MapPin className="h-4 w-4 mr-2" />
										<span>All Houses</span>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600 transition-colors">
							<div className="h-48 bg-gray-800 relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-gray-700" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold">Pitch Practice Workshop</h3>
									<span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Workshop</span>
								</div>
								<p className="text-gray-400 text-sm mb-4">Practice your startup pitch and receive feedback from experienced founders and investors.</p>
								<div className="space-y-2 mb-6">
									<div className="flex items-center text-gray-400 text-sm">
										<CalendarDays className="h-4 w-4 mr-2" />
										<span>Bi-weekly</span>
									</div>
									<div className="flex items-center text-gray-400 text-sm">
										<MapPin className="h-4 w-4 mr-2" />
										<span>San Francisco House</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA - Full-width background image */}
			<section className="relative py-40 overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/cta-background.jpg"
						alt="Join Accelr8"
						fill
						className="object-cover opacity-30"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl md:text-6xl font-bold mb-8">
							Ready to accelerate your founder journey?
						</h2>
						<p className="text-xl md:text-2xl text-gray-300 mb-12 mx-auto max-w-2xl">
							Join a community of exceptional founders building the future
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-6">
							<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-8 text-xl">
								<Link href="/apply">
									Apply Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
}
