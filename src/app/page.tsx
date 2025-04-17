import HousesCarousel from "@/components/houses/houses-carousel";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Accelr8 - Community Living for Founders & Builders",
	description: "Join a high-density network of ambitious founders in San Francisco. Live, build, and grow with exceptional peers in a space designed for innovation.",
};

export default async function HomePage() {
	return (
		<PublicLayout>
			{/* Hero Section - Full-height, clean visual focus */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/hero-background.jpg"
						alt="Accelr8 Community"
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background/80"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10 py-32 text-center">
					<h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-4xl mx-auto text-foreground">
						A community of <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">exceptional founders</span>
					</h1>

					<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
						Living, building, and growing together in San Francisco
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6 text-lg">
							<Link href="/apply">
								Join Our Community
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
							<Link href="/story">
								Our Story
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Community Vibe - Large Image Gallery */}
			<section className="py-24 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
							Our Community Vibe
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{/* First row */}
						<div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md col-span-1 md:col-span-2">
							<Image
								src="/images/image4.jpg"
								alt="Accelr8 Community Dinner"
								fill
								className="object-cover"
							/>
						</div>
						<div className="aspect-square relative rounded-2xl overflow-hidden shadow-md">
							<Image
								src="/images/image9.jpg"
								alt="Accelr8 Working Together"
								fill
								className="object-cover"
							/>
						</div>

						{/* Second row */}
						<div className="aspect-square relative rounded-2xl overflow-hidden shadow-md">
							<Image
								src="/images/image10.jpg"
								alt="Accelr8 Hackathon"
								fill
								className="object-cover"
							/>
						</div>
						<div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md col-span-1 md:col-span-2">
							<Image
								src="/accelr8.jpg"
								alt="Community Gathering"
								fill
								className="object-cover"
							/>
						</div>

						{/* Third row */}
						<div className="aspect-[2/1] relative rounded-2xl overflow-hidden shadow-md col-span-1 lg:col-span-3">
							<Image
								src="/cta-background.jpg"
								alt="Accelr8 Community"
								fill
								className="object-cover"
							/>
						</div>
					</div>

					<div className="text-center mt-12">
						<Button asChild variant="outline" size="lg" className="px-8 py-6">
							<Link href="/media">
								See More
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Community Stats - Simplified */}
			<section className="py-24 section-secondary">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 text-center max-w-5xl mx-auto">
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">40+</p>
							<p className="text-muted-foreground text-lg">Founders</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">15+</p>
							<p className="text-muted-foreground text-lg">Startups</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">100+</p>
							<p className="text-muted-foreground text-lg">Events</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">$10M+</p>
							<p className="text-muted-foreground text-lg">Funding</p>
						</div>
					</div>
				</div>
			</section>

			{/* Community Quotes - Testimonials Grid */}
			<section className="py-24 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
							From Our Community
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="bg-background/50 p-8 rounded-2xl shadow-sm">
							<p className="text-xl text-foreground mb-6 leading-relaxed">
								"Moving into Accelr8 was the best decision I made for my startup journey. The serendipitous connections happen daily."
							</p>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full overflow-hidden relative">
									<Image src="/founder1.jpg" alt="Founder" fill className="object-cover" />
								</div>
								<div>
									<p className="font-bold text-foreground">Sarah Chen</p>
									<p className="text-muted-foreground text-sm">NeuralPath AI</p>
								</div>
							</div>
						</div>

						<div className="bg-background/50 p-8 rounded-2xl shadow-sm">
							<p className="text-xl text-foreground mb-6 leading-relaxed">
								"I met my technical co-founder at an Accelr8 hackathon. Six months later, we closed our seed round."
							</p>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full overflow-hidden relative">
									<Image src="/founder1.jpg" alt="Founder" fill className="object-cover" />
								</div>
								<div>
									<p className="font-bold text-foreground">Michael Park</p>
									<p className="text-muted-foreground text-sm">Quantum Leap</p>
								</div>
							</div>
						</div>

						<div className="bg-background/50 p-8 rounded-2xl shadow-sm md:col-span-2 lg:col-span-1">
							<p className="text-xl text-foreground mb-6 leading-relaxed">
								"The density of ambitious builders here creates an energy that's impossible to find elsewhere in the city."
							</p>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full overflow-hidden relative">
									<Image src="/founder1.jpg" alt="Founder" fill className="object-cover" />
								</div>
								<div>
									<p className="font-bold text-foreground">Elena Reyes</p>
									<p className="text-muted-foreground text-sm">BlockMatrix</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Community Life - Visual Highlights */}
			<section className="py-24 section-secondary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
							Life at Accelr8
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image4.jpg"
								alt="Weekly Hackathons"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Weekly Hackathons</h3>
									<p className="text-white/90">Building together</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image9.jpg"
								alt="Founder Dinners"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Founder Dinners</h3>
									<p className="text-white/90">Connecting authentically</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image10.jpg"
								alt="Investor Connections"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Investor Connections</h3>
									<p className="text-white/90">Growing your network</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Community Spaces - Houses */}
			<section className="py-24 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
							Our Spaces
						</h2>
					</div>

					{/* Houses Carousel with Suspense boundary */}
					<HousesCarousel />

					<div className="text-center mt-16">
						<Button asChild variant="outline" size="lg" className="px-8 py-6">
							<Link href="/houses">
								View All Locations
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Community Events - Simplified */}
			<section className="py-24 section-secondary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
							Community Events
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="bg-background/50 p-6 rounded-2xl hover:shadow-md transition-shadow">
							<div className="flex justify-between items-start mb-3">
								<h3 className="text-xl font-bold text-foreground">Founder Dinner Series</h3>
								<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Networking</span>
							</div>
							<p className="text-muted-foreground text-sm mb-4">Monthly dinners with founders and investors in the Bay Area tech ecosystem.</p>
							<div className="space-y-2">
								<div className="flex items-center text-muted-foreground text-sm">
									<CalendarDays className="h-4 w-4 mr-2" />
									<span>Monthly</span>
								</div>
								<div className="flex items-center text-muted-foreground text-sm">
									<MapPin className="h-4 w-4 mr-2" />
									<span>San Francisco House</span>
								</div>
							</div>
						</div>

						<div className="bg-background/50 p-6 rounded-2xl hover:shadow-md transition-shadow">
							<div className="flex justify-between items-start mb-3">
								<h3 className="text-xl font-bold text-foreground">AI Hackathon Weekend</h3>
								<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Hackathon</span>
							</div>
							<p className="text-muted-foreground text-sm mb-4">48-hour hackathon for building AI applications with expert mentorship.</p>
							<div className="space-y-2">
								<div className="flex items-center text-muted-foreground text-sm">
									<CalendarDays className="h-4 w-4 mr-2" />
									<span>Quarterly</span>
								</div>
								<div className="flex items-center text-muted-foreground text-sm">
									<MapPin className="h-4 w-4 mr-2" />
									<span>All Houses</span>
								</div>
							</div>
						</div>

						<div className="bg-background/50 p-6 rounded-2xl hover:shadow-md transition-shadow">
							<div className="flex justify-between items-start mb-3">
								<h3 className="text-xl font-bold text-foreground">Pitch Practice Workshop</h3>
								<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Workshop</span>
							</div>
							<p className="text-muted-foreground text-sm mb-4">Practice your startup pitch with feedback from experienced founders.</p>
							<div className="space-y-2">
								<div className="flex items-center text-muted-foreground text-sm">
									<CalendarDays className="h-4 w-4 mr-2" />
									<span>Bi-weekly</span>
								</div>
								<div className="flex items-center text-muted-foreground text-sm">
									<MapPin className="h-4 w-4 mr-2" />
									<span>San Francisco House</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Simplified Join CTA */}
			<section className="relative py-32 overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/cta-background.jpg"
						alt="Join Accelr8"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background/70"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
							Join our community
						</h2>
						<div className="mt-10">
							<Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6">
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
