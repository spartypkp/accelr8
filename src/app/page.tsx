import HousesCarousel from "@/components/houses/houses-carousel";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CalendarDays, ChevronRight, DollarSign, Handshake, MapPin, Star, TrendingUp, Users } from "lucide-react";
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
			{/* Hero Section - Full-height, visually focused */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 z-0">
					<Image
						src="/hero-background.jpg"
						alt="Accelr8 Community"
						fill
						className="object-cover opacity-90 mix-blend-overlay"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10 py-32 text-center">
					<div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8">
						<span className="mr-2">✦</span> A new model for founder living
					</div>

					<h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-4xl mx-auto text-foreground">
						Where <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">exceptional founders</span> live and build together
					</h1>

					<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
						The high-talent-density living space designed for ambitious builders in San Francisco
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-7 text-xl">
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
					<ChevronRight className="h-10 w-10 rotate-90 text-muted-foreground" />
				</div>
			</section>

			{/* Proof Points Section - Clean, centered stats */}
			<section className="py-24 section-primary">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 text-center max-w-5xl mx-auto">
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">40+</p>
							<p className="text-muted-foreground text-lg">Ambitious Founders</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">15+</p>
							<p className="text-muted-foreground text-lg">Startups Launched</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">100+</p>
							<p className="text-muted-foreground text-lg">Community Events</p>
						</div>
						<div className="space-y-3">
							<p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">$10M+</p>
							<p className="text-muted-foreground text-lg">Funding Raised</p>
						</div>
					</div>
				</div>
			</section>

			{/* Main Visual Feature Section */}
			<section className="py-24 section-secondary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							Life at Accelr8
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto">
							Our community is designed to create the perfect environment for founders
						</p>
					</div>

					<div className="relative aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden mb-24 shadow-lg">
						<Image
							src="/accelr8.jpg"
							alt="Accelr8 Community Life"
							fill
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent flex items-end">
							<div className="p-8">
								<h3 className="text-2xl font-bold mb-2 text-white">Weekly community dinners</h3>
								<p className="text-white/90">Where connections and collaborations begin</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image4.jpg"
								alt="Accelr8 Hackathon"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Weekly Hackathons</h3>
									<p className="text-white/90">Build, test, and iterate together</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image9.jpg"
								alt="Founder Dinner"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Founder Dinners</h3>
									<p className="text-white/90">Connect and share experiences</p>
								</div>
							</div>
						</div>

						<div className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
							<Image
								src="/images/image10.jpg"
								alt="Pitch Day"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent flex items-end">
								<div className="p-8">
									<h3 className="text-2xl font-bold mb-2 text-white">Investor Pitch Days</h3>
									<p className="text-white/90">Showcase to VCs and angel investors</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Solution Section (Simplified) */}
			<section className="py-32 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							Our solution: high-density founder living
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto">
							We've solved the biggest challenges founders face
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12 max-w-5xl mx-auto">
						<div className="flex flex-col items-center text-center p-6 feature-box">
							<div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<Users className="h-12 w-12 text-primary" />
							</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Curated Community</h3>
							<p className="text-muted-foreground text-lg">
								Live with exceptional builders who have complementary skills and aligned ambitions
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6 feature-box">
							<div className="bg-secondary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<Handshake className="h-12 w-12 text-secondary" />
							</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Co-Founder Matching</h3>
							<p className="text-muted-foreground text-lg">
								Find your technical or business co-founder through organic interactions, not forced networking
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6 feature-box">
							<div className="bg-success/10 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<DollarSign className="h-12 w-12 text-success" />
							</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Investor Network</h3>
							<p className="text-muted-foreground text-lg">
								Access to VCs and angel investors through warm introductions and pitch events
							</p>
						</div>

						<div className="flex flex-col items-center text-center p-6 feature-box">
							<div className="bg-warning/10 rounded-full w-24 h-24 flex items-center justify-center mb-6">
								<TrendingUp className="h-12 w-12 text-warning" />
							</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Peer Accountability</h3>
							<p className="text-muted-foreground text-lg">
								Progress faster with the energy and accountability of building alongside other founders
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonial Section with Large Image */}
			<section className="py-32 section-secondary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							Success Stories
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto">
							Hear from founders who found success in our community
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
						<div className="h-[500px] lg:h-[600px] relative rounded-2xl overflow-hidden shadow-lg">
							<Image
								src="/images/image7.jpg"
								alt="Founder Success Story"
								fill
								className="object-cover"
							/>
						</div>

						<div className="relative">
							<div className="absolute -top-12 -left-12">
								<Star className="h-20 w-20 text-warning fill-warning opacity-20" />
							</div>

							<div className="relative z-10">
								<p className="text-2xl text-foreground mb-10 leading-relaxed">
									"I moved in without a clear idea and within weeks found my technical co-founder at a house hackathon. Six months later, we closed our seed round. The density of talent here is unmatched."
								</p>

								<div className="flex items-center gap-5">
									<div className="w-16 h-16 rounded-full overflow-hidden relative shadow-md">
										<Image src="/founder1.jpg" alt="Founder" fill className="object-cover" />
									</div>
									<div>
										<p className="text-xl font-bold text-foreground">Sarah Chen</p>
										<p className="text-muted-foreground">Founder, NeuralPath AI</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Houses Section - Now using the Carousel */}
			<section className="py-32 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							Our Houses
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto mb-12">
							Purpose-designed living spaces for founders
						</p>
					</div>

					{/* Houses Carousel with Suspense boundary */}
					<HousesCarousel />

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

			{/* Community Events Section */}
			<section className="py-32 section-secondary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							Community Events
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto">
							Connect, learn, and grow with our workshops, hackathons, and networking opportunities
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="card-light hover:shadow-md transition-shadow">
							<div className="h-48 bg-muted relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-primary/40" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold text-foreground">Founder Dinner Series</h3>
									<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Networking</span>
								</div>
								<p className="text-muted-foreground text-sm mb-4">Join us for our monthly dinner with founders and investors in the Bay Area tech ecosystem.</p>
								<div className="space-y-2 mb-6">
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
						</div>

						<div className="card-light hover:shadow-md transition-shadow">
							<div className="h-48 bg-muted relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-primary/40" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold text-foreground">AI Hackathon Weekend</h3>
									<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Hackathon</span>
								</div>
								<p className="text-muted-foreground text-sm mb-4">48-hour hackathon focused on building AI-powered applications with mentorship from industry experts.</p>
								<div className="space-y-2 mb-6">
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
						</div>

						<div className="card-light hover:shadow-md transition-shadow">
							<div className="h-48 bg-muted relative">
								<div className="absolute inset-0 flex items-center justify-center">
									<Calendar className="h-12 w-12 text-primary/40" />
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-xl font-bold text-foreground">Pitch Practice Workshop</h3>
									<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Workshop</span>
								</div>
								<p className="text-muted-foreground text-sm mb-4">Practice your startup pitch and receive feedback from experienced founders and investors.</p>
								<div className="space-y-2 mb-6">
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
				</div>
			</section>

			{/* Application Process - Simple Steps */}
			<section className="py-32 section-primary overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 section-heading">
							How to Join
						</h2>
						<p className="text-xl section-description max-w-2xl mx-auto">
							Our application process is designed to find exceptional founders
						</p>
					</div>

					<div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
						<div className="flex-1 flex flex-col items-center text-center p-8 card-light">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center font-bold text-2xl text-white mb-6">1</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Apply Online</h3>
							<p className="text-muted-foreground text-lg">
								Tell us about yourself and your company in our 10-minute application
							</p>
						</div>

						<div className="flex-1 flex flex-col items-center text-center p-8 card-light">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center font-bold text-2xl text-white mb-6">2</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Interview</h3>
							<p className="text-muted-foreground text-lg">
								Selected applicants join a 30-minute video call with our team
							</p>
						</div>

						<div className="flex-1 flex flex-col items-center text-center p-8 card-light">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center font-bold text-2xl text-white mb-6">3</div>
							<h3 className="text-2xl font-bold mb-3 text-foreground">Move In</h3>
							<p className="text-muted-foreground text-lg">
								Accepted founders receive move-in details and join the community
							</p>
						</div>
					</div>

					<div className="text-center mt-16">
						<Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6 text-xl">
							<Link href="/apply">
								Start Your Application
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
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
						className="object-cover opacity-90 mix-blend-overlay"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/80"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground">
							Ready to accelerate your founder journey?
						</h2>
						<p className="text-xl md:text-2xl text-muted-foreground mb-12 mx-auto max-w-2xl">
							Join a community of exceptional founders building the future
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-6">
							<Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-10 py-8 text-xl">
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
