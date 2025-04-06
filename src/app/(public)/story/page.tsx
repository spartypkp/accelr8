import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { sanityClient, urlFor } from "@/lib/sanity";
import {
	ArrowRight,
	Award,
	BrainCircuit,
	Building,
	Calendar,
	Code,
	Globe,
	Home,
	Laptop,
	LightbulbIcon,
	Network,
	Rocket,
	Star,
	Users,
	Zap
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About Accelr8 | The Story of Our Community",
	description: "The journey, vision, and community building the future of technology in San Francisco.",
};

// Fetch team members from Sanity
async function getTeamMembers() {
	const teamMembers = await sanityClient.fetch(`
		*[_type == "person" && isTeamMember == true && displayOnWebsite != false] | order(displayOrder asc) {
			_id,
			name,
			role,
			bio,
			profileImage,
			socialLinks
		}
	`);
	return teamMembers;
}

export default async function AboutPage() {
	const teamMembers = await getTeamMembers();

	return (
		<PublicLayout>
			{/* Hero Section - Our Story */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-background z-0"></div>
				{/* Circuit Pattern Overlay */}
				<div className="absolute inset-0 opacity-10 z-0 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<div className="mb-6 flex justify-center">
							<div className="inline-block gradient-text text-5xl md:text-7xl font-bold">
								ACCELR8
							</div>
						</div>
						<h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
							OUR <span className="gradient-text">STORY</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8">
							How a community of builders, thinkers, and creators came together to
							reimagine what's possible when talented people share space, ideas, and ambition.
						</p>
					</div>
				</div>
			</section>

			{/* Genesis: The Beginnings */}
			<section className="py-20 bg-gradient-to-b from-background to-card/50 relative">
				{/* Subtle circuit background */}
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-5xl mx-auto">
						<div className="flex items-center mb-12">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 mr-6">
								<LightbulbIcon className="h-8 w-8 text-primary-foreground" />
							</div>
							<h2 className="text-4xl font-bold gradient-text">I. Genesis</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
							<div className="md:col-span-3">
								<h3 className="text-2xl font-bold text-foreground mb-6">The Spark That Started It All</h3>
								<p className="text-muted-foreground mb-6 text-lg">
									Accelr8 began when Daniel and Pat met at a Web3 co-living experiment in the Sierra Nevada mountains
									hosted by Cabin DAO. Surrounded by ambitious builders working on cutting-edge technologies, they
									witnessed firsthand how magical the right community can be.
								</p>
								<p className="text-muted-foreground mb-6 text-lg">
									What started as late-night conversations about the future of work and innovation evolved into
									a vision: create a space in San Francisco where the world's brightest minds could live, build,
									and grow together.
								</p>
								<p className="text-muted-foreground text-lg">
									This wasn't just about shared housing—it was about creating an environment where
									serendipitous connections lead to outsized outcomes, where breakfast conversations spark
									midnight breakthroughs, and where the next generation of world-changing companies could begin.
								</p>
							</div>
							<div className="md:col-span-2">
								<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-primary/10 h-full">
									<div className="relative h-full min-h-[300px]">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay z-10"></div>
										<Image
											src="/cabin-sierra-nevada.jpg"
											alt="Cabin in Sierra Nevada"
											fill
											className="object-cover"
											priority
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Evolution: Building Community */}
			<section className="py-20 bg-card/30 relative">
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-5xl mx-auto">
						<div className="flex items-center mb-12">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/30 mr-6">
								<Network className="h-8 w-8 text-secondary-foreground" />
							</div>
							<h2 className="text-4xl font-bold text-foreground">II. <span className="gradient-text">Evolution</span></h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
							<div className="md:col-span-2 md:order-2">
								<h3 className="text-2xl font-bold text-foreground mb-6">Growing the Community</h3>
								<p className="text-muted-foreground mb-6 text-lg">
									Over time, Daniel and Pat built deep networks across technology and Web3. They organized
									events, hosted dinner gatherings, and connected builders who were working on similar problems.
								</p>
								<p className="text-muted-foreground mb-6 text-lg">
									They recognized a pattern: when the right people come together in the right environment with
									the right incentives, innovation happens at an accelerated pace. Not through formal structures
									or rigid programs, but through organic connection and authentic collaboration.
								</p>
								<p className="text-muted-foreground text-lg">
									Every event strengthened their conviction that community-driven innovation was the future—and that
									San Francisco needed a physical hub where this approach could flourish full-time.
								</p>
							</div>
							<div className="md:col-span-3 md:order-1">
								<div className="grid grid-cols-2 gap-4 h-full">
									<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-secondary/10">
										<div className="relative h-full min-h-[200px]">
											<div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 mix-blend-overlay z-10"></div>
											<Image
												src="/community-events.jpg"
												alt="Community Events"
												fill
												className="object-cover"
											/>
										</div>
									</div>
									<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-primary/10">
										<div className="relative h-full min-h-[200px]">
											<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 mix-blend-overlay z-10"></div>
											<Image
												src="/hackathon.jpg"
												alt="Hackathon"
												fill
												className="object-cover"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Present: Accelr8 Today */}
			<section className="py-20 bg-gradient-to-b from-background to-card/50 relative">
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-5xl mx-auto">
						<div className="flex items-center mb-12">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 mr-6">
								<Rocket className="h-8 w-8 text-primary-foreground" />
							</div>
							<h2 className="text-4xl font-bold text-foreground">III. <span className="gradient-text">Present</span></h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
							<div>
								<h3 className="text-2xl font-bold text-foreground mb-6">Accelr8 Today</h3>
								<p className="text-muted-foreground mb-6 text-lg">
									Today, Accelr8 is bringing these learnings and vision to life through our hacker house in
									San Francisco. We've created a space designed specifically for AI and Web3 founders at the
									pre-seed and seed stages—those building the future right at technology's frontier.
								</p>
								<p className="text-muted-foreground mb-6 text-lg">
									Our 15-bedroom house in Nob Hill has become home to engineers, designers, and founders
									from diverse backgrounds but with a common trait: they're all exceptionally talented
									builders committed to creating something meaningful.
								</p>
								<p className="text-muted-foreground text-lg">
									Through weekly house events, monthly hackathons, demo days, and daily interactions,
									our community is accelerating innovation in ways that traditional accelerators and
									incubators simply cannot replicate.
								</p>
							</div>
							<div>
								<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-primary/10 h-full">
									<div className="relative h-full min-h-[300px]">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 mix-blend-overlay z-10"></div>
										<Image
											src="/accelr8-house.jpg"
											alt="Accelr8 House"
											fill
											className="object-cover"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Impact & Outcomes */}
						<div className="mt-12 mb-16">
							<h3 className="text-2xl font-bold text-foreground mb-8 text-center">Our Impact So Far</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
									<div className="text-4xl font-bold text-foreground mb-2">40+</div>
									<div className="text-xl text-primary mb-2">Founders</div>
									<p className="text-muted-foreground">Building next-gen startups in AI, Web3, and beyond</p>
								</div>
								<div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
									<div className="text-4xl font-bold text-foreground mb-2">15+</div>
									<div className="text-xl text-secondary mb-2">Startups Launched</div>
									<p className="text-muted-foreground">From ideation to successful funding rounds</p>
								</div>
								<div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
									<div className="text-4xl font-bold text-foreground mb-2">100+</div>
									<div className="text-xl text-primary mb-2">Community Events</div>
									<p className="text-muted-foreground">Hackathons, workshops, pitch days, and social gatherings</p>
								</div>
							</div>
						</div>

						{/* Success Stories */}
						<div>
							<h3 className="text-2xl font-bold text-foreground mb-8 text-center">Community Stories</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border relative">
									<div className="absolute -top-6 left-8">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
											<span className="text-primary-foreground font-bold">"</span>
										</div>
									</div>
									<p className="text-muted-foreground italic mb-6 pt-4">
										"Being at Accelr8 changed everything for us. The late-night debugging sessions, spontaneous brainstorming over coffee, and the genuine support from everyone around – it's the kind of environment where ideas flourish. I met my co-founder here, and three months later we secured our first round of funding."
									</p>
									<div className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
										<div>
											<p className="font-semibold text-foreground">Alex Chen</p>
											<p className="text-primary text-sm">AI Startup Founder</p>
										</div>
									</div>
								</div>

								<div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border relative">
									<div className="absolute -top-6 left-8">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/30">
											<span className="text-secondary-foreground font-bold">"</span>
										</div>
									</div>
									<p className="text-muted-foreground italic mb-6 pt-4">
										"The diversity of thought here is incredible. One day you're discussing token economics with a Web3 developer, the next you're learning about LLM architecture from an AI researcher. These cross-disciplinary conversations have completely transformed how I approach building. The community here doesn't just support you – it elevates your thinking."
									</p>
									<div className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
										<div>
											<p className="font-semibold text-foreground">Maya Johnson</p>
											<p className="text-secondary text-sm">Web3 Developer</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Vision: The Future */}
			<section className="py-20 bg-card/30 relative">
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-5xl mx-auto">
						<div className="flex items-center mb-12">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/30 mr-6">
								<Globe className="h-8 w-8 text-secondary-foreground" />
							</div>
							<h2 className="text-4xl font-bold text-foreground">IV. <span className="gradient-text">Future</span></h2>
						</div>

						<div className="mb-16">
							<h3 className="text-2xl font-bold text-foreground mb-6">Our Vision Forward</h3>
							<p className="text-muted-foreground mb-10 text-lg">
								We believe we're just at the beginning of what's possible when you bring together the
								right people in the right environment. Our vision for Accelr8 extends far beyond a single
								house in San Francisco—we're building a globally connected network of innovation hubs
								that will reshape how talented people live, work, and create together.
							</p>

							{/* Near-Term: SF Network */}
							<div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-24">
								<div className="md:col-span-3 order-2 md:order-1">
									<h4 className="text-xl font-bold text-primary mb-4">Phase I: San Francisco Network</h4>
									<p className="text-muted-foreground mb-4 text-lg">
										Our immediate goal is to create a network of innovation hubs across San Francisco,
										forming a powerful ecosystem of talent, resources, and opportunities for founders.
									</p>
									<div className="mb-6 bg-card/50 backdrop-blur p-5 rounded-xl border border-border">
										<h5 className="font-semibold text-foreground mb-2">Why a network matters:</h5>
										<ul className="space-y-2 text-muted-foreground">
											<li className="flex items-start">
												<div className="mr-2 mt-1 text-primary"><Zap className="h-4 w-4" /></div>
												<span><span className="text-primary font-medium">Talent density:</span> Multiple houses means more founders, engineers, and creators in proximity</span>
											</li>
											<li className="flex items-start">
												<div className="mr-2 mt-1 text-primary"><Zap className="h-4 w-4" /></div>
												<span><span className="text-primary font-medium">Specialization:</span> Houses can develop unique focuses (AI, Web3, Biotech) while remaining connected</span>
											</li>
											<li className="flex items-start">
												<div className="mr-2 mt-1 text-primary"><Zap className="h-4 w-4" /></div>
												<span><span className="text-primary font-medium">Local network effects:</span> Cross-house events, shared resources, and expanded opportunity networks</span>
											</li>
										</ul>
									</div>
									<p className="text-muted-foreground text-lg">
										By creating multiple nodes across San Francisco, we'll build critical mass for innovation,
										allowing members to tap into different sub-communities while maintaining the cohesive Accelr8 experience.
									</p>
								</div>
								<div className="md:col-span-2 order-1 md:order-2 mb-8 md:mb-0">
									<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-primary/10 h-full">
										<div className="relative h-[300px]">
											<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 mix-blend-overlay z-10"></div>
											{/* SF Network illustration */}
											<div className="absolute inset-0 bg-card flex items-center justify-center p-6">
												<div className="w-full h-full relative">
													{/* SF Map Background */}
													<div className="absolute inset-0 opacity-20 bg-[url('/sf-map.jpg')] bg-cover bg-center"></div>

													{/* Network Visualization */}
													<div className="absolute inset-0 flex items-center justify-center">
														<div className="relative w-full max-w-[300px] h-[240px]">
															{/* House Nodes */}
															<div className="absolute top-[20%] left-[30%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 z-20 animate-pulse">
																	<Home className="h-5 w-5 text-primary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">Nob Hill</div>
															</div>

															<div className="absolute top-[60%] left-[20%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 z-20">
																	<Home className="h-5 w-5 text-primary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">SoMa</div>
															</div>

															<div className="absolute top-[30%] left-[75%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 z-20">
																	<Home className="h-5 w-5 text-primary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">Mission</div>
															</div>

															<div className="absolute top-[70%] left-[65%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/50 z-20">
																	<Home className="h-5 w-5 text-secondary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">Dogpatch</div>
															</div>

															{/* Connection Lines */}
															<svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 300 240">
																<line x1="96" y1="48" x2="225" y2="72" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />
																<line x1="96" y1="48" x2="60" y2="144" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />
																<line x1="96" y1="48" x2="195" y2="168" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />
																<line x1="60" y1="144" x2="225" y2="72" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />
																<line x1="60" y1="144" x2="195" y2="168" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />
																<line x1="225" y1="72" x2="195" y2="168" stroke="url(#cyan-gradient)" strokeWidth="2" strokeDasharray="5,5" />

																<defs>
																	<linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
																		<stop offset="0%" stopColor="rgb(var(--primary))" />
																		<stop offset="100%" stopColor="rgb(var(--secondary))" />
																	</linearGradient>
																</defs>
															</svg>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Long-Term: Global Network */}
							<div className="grid grid-cols-1 md:grid-cols-5 gap-12">
								<div className="md:col-span-2">
									<div className="rounded-lg overflow-hidden border-2 border-border shadow-lg shadow-secondary/10 h-full">
										<div className="relative h-[350px]">
											<div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 mix-blend-overlay z-10"></div>
											{/* Global Network illustration */}
											<div className="absolute inset-0 bg-card flex items-center justify-center p-6">
												<div className="w-full h-full relative">
													{/* World Map Background */}
													<div className="absolute inset-0 opacity-15 bg-[url('/world-map.jpg')] bg-cover bg-center"></div>

													{/* Network Visualization */}
													<div className="absolute inset-0 flex items-center justify-center">
														<div className="relative w-full h-full">
															{/* Major Hub Nodes */}
															<div className="absolute top-[35%] left-[20%]">
																<div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/50 z-20 animate-pulse">
																	<Building className="h-6 w-6 text-secondary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">San Francisco</div>
															</div>

															<div className="absolute top-[30%] left-[48%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/50 z-20">
																	<Building className="h-5 w-5 text-secondary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">London</div>
															</div>

															<div className="absolute top-[45%] left-[78%]">
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/50 z-20">
																	<Building className="h-5 w-5 text-secondary-foreground" />
																</div>
																<div className="mt-2 text-foreground text-center text-xs font-medium">Singapore</div>
															</div>

															{/* Smaller Nodes */}
															<div className="absolute top-[60%] left-[65%]">
																<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/50 z-20">
																	<Home className="h-4 w-4 text-primary-foreground" />
																</div>
															</div>

															<div className="absolute top-[25%] left-[42%]">
																<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/50 z-20">
																	<Home className="h-4 w-4 text-primary-foreground" />
																</div>
															</div>

															<div className="absolute top-[40%] left-[23%]">
																<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/50 z-20">
																	<Home className="h-4 w-4 text-primary-foreground" />
																</div>
															</div>

															<div className="absolute top-[38%] left-[60%]">
																<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/50 z-20">
																	<Home className="h-4 w-4 text-primary-foreground" />
																</div>
															</div>

															{/* Connection Lines would be rendered with SVG */}
															<svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 300">
																{/* Lines from SF to other hubs */}
																<path d="M80,105 C150,60 250,90 320,135" stroke="url(#secondary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
																<path d="M80,105 C120,130 280,130 310,90" stroke="url(#secondary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />

																{/* Lines from London to other nodes */}
																<path d="M192,90 C210,110 230,100 240,114" stroke="url(#primary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
																<path d="M192,90 C170,110 150,110 168,120" stroke="url(#primary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />

																{/* Lines from Singapore to other nodes */}
																<path d="M312,135 C300,150 280,160 260,180" stroke="url(#primary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
																<path d="M312,135 C290,120 270,130 240,114" stroke="url(#primary-gradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />

																<defs>
																	<linearGradient id="secondary-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
																		<stop offset="0%" stopColor="rgb(var(--secondary))" />
																		<stop offset="100%" stopColor="rgb(var(--primary))" />
																	</linearGradient>
																	<linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
																		<stop offset="0%" stopColor="rgb(var(--primary))" />
																		<stop offset="100%" stopColor="rgb(var(--secondary))" />
																	</linearGradient>
																</defs>
															</svg>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="md:col-span-3">
									<h4 className="text-xl font-bold text-secondary mb-4">Phase II: Global Innovation Network</h4>
									<p className="text-muted-foreground mb-4 text-lg">
										Our ultimate vision extends far beyond San Francisco. We're creating a global network
										of innovation hubs where the next generation of technology companies are born, all connected
										through a shared community of ambitious builders and entrepreneurs.
									</p>
									<div className="mb-6 bg-card/50 backdrop-blur p-5 rounded-xl border border-border">
										<h5 className="font-semibold text-foreground mb-2">The Accelr8 Network Advantage:</h5>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2 text-muted-foreground">
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Users className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Global Community:</span> Connect with brilliant minds worldwide</span>
												</div>
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Code className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Talent & Co-founders:</span> Find your perfect collaborator</span>
												</div>
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Laptop className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Remote Work:</span> Move between locations while staying connected</span>
												</div>
											</div>
											<div className="space-y-2 text-muted-foreground">
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Rocket className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Launch Support:</span> Resources to help you scale globally</span>
												</div>
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Award className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Prestige & Credibility:</span> Be part of a recognized network</span>
												</div>
												<div className="flex items-start">
													<div className="mr-2 mt-1 text-secondary"><Calendar className="h-4 w-4" /></div>
													<span><span className="text-secondary font-medium">Global Events:</span> Participate in cross-location collaborations</span>
												</div>
											</div>
										</div>
									</div>
									<p className="text-muted-foreground text-lg">
										When you join Accelr8, you're not just renting a room—you're becoming part of a global
										network designed to accelerate your journey as a founder. Whether you need a co-founder,
										technical talent, investment opportunities, or simply a supportive community that understands
										the challenges of building, the Accelr8 network will be there to support you at every step.
									</p>
								</div>
							</div>
						</div>

						{/* Core Values - Keep this section */}
						<div className="mt-20">
							<h3 className="text-2xl font-bold text-foreground mb-8 text-center">Our Guiding Principles</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
									<div className="mb-6 flex items-center justify-center">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
											<Users className="h-6 w-6 text-primary-foreground" />
										</div>
									</div>
									<h4 className="text-xl font-bold text-center mb-4">Community First</h4>
									<p className="text-muted-foreground text-center">
										We believe that meaningful connections between founders create exponential value.
										Our community is our greatest asset.
									</p>
								</div>

								<div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
									<div className="mb-6 flex items-center justify-center">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/30">
											<Star className="h-6 w-6 text-secondary-foreground" />
										</div>
									</div>
									<h4 className="text-xl font-bold text-center mb-4">High Talent Density</h4>
									<p className="text-muted-foreground text-center">
										We curate our community to bring together exceptional people with complementary skills and
										shared ambition.
									</p>
								</div>

								<div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
									<div className="mb-6 flex items-center justify-center">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
											<BrainCircuit className="h-6 w-6 text-primary-foreground" />
										</div>
									</div>
									<h4 className="text-xl font-bold text-center mb-4">Innovation Through Interaction</h4>
									<p className="text-muted-foreground text-center">
										We foster an environment where serendipitous collisions of ideas and perspectives lead
										to breakthrough innovations.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-20 bg-gradient-to-b from-card/30 to-background relative">
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">The Team Behind <span className="gradient-text">Accelr8</span></h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Meet the passionate people who are bringing this vision to life and building
							the future of innovation communities.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{teamMembers && teamMembers.length > 0 ? (
							teamMembers.map((member) => (
								<div key={member._id} className="bg-card/70 backdrop-blur rounded-xl overflow-hidden border border-border shadow-lg shadow-primary/10 text-center transform transition-all hover:scale-105">
									<div className="h-64 relative">
										<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10 mix-blend-overlay z-10"></div>
										{member.profileImage ? (
											<Image
												src={
													member.profileImage.asset
														? urlFor(member.profileImage).width(500).height(300).url()
														: '/placeholder-avatar.png'
												}
												alt={member.name}
												fill
												style={{ objectFit: 'cover' }}
											/>
										) : (
											<div className="absolute inset-0 bg-muted flex items-center justify-center">
												<Users className="h-16 w-16 text-muted-foreground/50" />
											</div>
										)}
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-1">{member.name}</h3>
										<p className="text-primary mb-4">{member.role}</p>
										<p className="text-muted-foreground">
											{member.bio}
										</p>
										{member.socialLinks && Object.values(member.socialLinks).some(link => link) && (
											<div className="mt-4 flex justify-center space-x-3">
												{member.socialLinks.twitter && (
													<a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
													</a>
												)}
												{member.socialLinks.linkedin && (
													<a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
													</a>
												)}
												{member.socialLinks.github && (
													<a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
													</a>
												)}
												{member.socialLinks.website && (
													<a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/80">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
													</a>
												)}
											</div>
										)}
									</div>
								</div>
							))
						) : (
							// Fallback if no team members found
							[1, 2, 3].map((fallback) => (
								<div key={fallback} className="bg-card/70 backdrop-blur rounded-xl overflow-hidden border border-border shadow-lg shadow-primary/10 text-center">
									<div className="h-64 relative">
										<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10 mix-blend-overlay z-10"></div>
										<div className="absolute inset-0 bg-muted flex items-center justify-center">
											<Users className="h-16 w-16 text-muted-foreground/50" />
										</div>
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-1">Team Member</h3>
										<p className="text-primary mb-4">Position</p>
										<p className="text-muted-foreground">
											Our team members will be listed here soon.
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</section>

			{/* Final CTA - Join the Journey */}
			<section className="py-20 bg-card/10 relative">
				<div className="absolute inset-0 opacity-5 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
							Join the <span className="gradient-text">Journey</span>
						</h2>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							We're building something special, and we're always looking for exceptional people who share our vision
							and want to be part of this story. Whether as a resident, collaborator, or supporter, there are many
							ways to get involved.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg" className="bg-primary hover:bg-primary/90 border-0 text-primary-foreground">
								<Link href="/apply">
									Join Our Community
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
								<a href="mailto:info@accelr8.io">
									Get in Touch
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 