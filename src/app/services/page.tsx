import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, BookOpen, Building, Code, DollarSign, Globe, GraduationCap, Handshake, LightbulbIcon, Users, Zap } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Services | Accelr8",
	description: "Comprehensive services for founders and startups to accelerate growth and development.",
};

export default function ServicesPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-background z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Our <span className="gradient-text">Services</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8">
							More than just housing - a complete ecosystem to help founders succeed
						</p>
					</div>
				</div>
			</section>

			{/* Services Overview Section */}
			<section className="py-20 bg-card/30">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-6 text-foreground">How We Support Founders</h2>
						<p className="text-lg text-muted-foreground">
							Accelr8 provides a comprehensive suite of services designed to address
							the unique challenges that early-stage founders face. Our approach combines
							community, resources, and strategic support.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Community & Network */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Community & Network</CardTitle>
								<CardDescription>Access to a curated network of exceptional founders</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Curated community of high-potential founders</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Direct connections to investors and mentors</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Co-founder matching and team building</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Industry-specific sub-communities</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Funding & Investment */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<DollarSign className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Funding & Investment</CardTitle>
								<CardDescription>Resources to help you secure the capital you need</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Direct introductions to our VC network</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Pitch deck review and optimization</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Fundraising strategy sessions</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Demo days with invited investors</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Education & Workshops */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<GraduationCap className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Education & Workshops</CardTitle>
								<CardDescription>Continuous learning opportunities to level up</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Founder-specific skill development</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Technical workshops on emerging technologies</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Growth marketing masterclasses</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Peer learning sessions</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Product Development */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<Code className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Product Development</CardTitle>
								<CardDescription>Technical resources to build better products</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Technical co-founder matching</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Code reviews from experienced engineers</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>AWS/cloud infrastructure guidance</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Design sprints and product feedback</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Go-to-Market Strategy */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<Globe className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Go-to-Market Strategy</CardTitle>
								<CardDescription>Launch and scale your product effectively</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Market positioning and messaging</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Customer acquisition strategy</span>
									</li>
									<li className="flex items-start">
										<span className="text-red-500 mr-2">•</span>
										<span>Pricing strategy optimization</span>
									</li>
									<li className="flex items-start">
										<span className="text-red-500 mr-2">•</span>
										<span>Sales process development</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Operational Support */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
									<Building className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>Operational Support</CardTitle>
								<CardDescription>Infrastructure to run your startup efficiently</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Legal and accounting partner referrals</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>HR and recruitment guidance</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Incorporation and compliance support</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Vendor discounts and perks</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Premium Programs Section */}
			<section className="py-24 bg-background overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-6 text-foreground">Premium Programs</h2>
						<p className="text-lg text-muted-foreground">
							Specialized accelerator programs for founders at different stages
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						<Card className="bg-card/40 border-border">
							<CardHeader>
								<div className="flex items-center gap-4 mb-2">
									<Award className="h-6 w-6 text-primary" />
									<CardTitle>Founder Fellowship</CardTitle>
								</div>
								<CardDescription>For early-stage founders with just an idea</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									A 3-month intensive program designed to help founders go from idea to MVP. Get matched with co-founders, validate your concept, and prepare for initial fundraising.
								</p>
								<ul className="space-y-2 text-muted-foreground mb-6">
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Weekly 1:1 mentorship with a serial founder</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Technical resources for MVP development</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Market validation framework</span>
									</li>
									<li className="flex items-start">
										<span className="text-primary mr-2">•</span>
										<span>Pre-seed fundraising preparation</span>
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-gradient-primary">
									Apply for Fellowship
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>

						<Card className="bg-card/40 border-border">
							<CardHeader>
								<div className="flex items-center gap-4 mb-2">
									<Zap className="h-6 w-6 text-secondary" />
									<CardTitle>Scale Program</CardTitle>
								</div>
								<CardDescription>For seed-stage startups ready to scale</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									A 6-month program focused on helping startups with initial traction scale their operations, hire key talent, and raise Series A funding.
								</p>
								<ul className="space-y-2 text-muted-foreground mb-6">
									<li className="flex items-start">
										<span className="text-secondary mr-2">•</span>
										<span>Go-to-market strategy refinement</span>
									</li>
									<li className="flex items-start">
										<span className="text-secondary mr-2">•</span>
										<span>Introductions to key enterprise clients</span>
									</li>
									<li className="flex items-start">
										<span className="text-secondary mr-2">•</span>
										<span>Structured Series A fundraising support</span>
									</li>
									<li className="flex items-start">
										<span className="text-secondary mr-2">•</span>
										<span>Growth team building and recruitment</span>
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-gradient-secondary">
									Apply for Scale Program
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</section>

			{/* Events & Workshops Section */}
			<section className="py-24 bg-card/30 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-6 text-foreground">Recurring Events & Workshops</h2>
						<p className="text-lg text-muted-foreground">
							Regular opportunities to learn, network, and grow
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<Handshake className="h-10 w-10 text-primary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">Founder Dinner Series</h3>
							<p className="text-muted-foreground mb-2">Monthly networking dinners with founders, investors, and industry experts.</p>
							<p className="text-sm text-muted-foreground/70">Every last Thursday of the month</p>
						</div>

						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<LightbulbIcon className="h-10 w-10 text-primary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">Weekend Hackathons</h3>
							<p className="text-muted-foreground mb-2">48-hour intense building sessions with mentorship and prizes.</p>
							<p className="text-sm text-muted-foreground/70">First weekend of each quarter</p>
						</div>

						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<DollarSign className="h-10 w-10 text-primary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">VC Office Hours</h3>
							<p className="text-muted-foreground mb-2">One-on-one sessions with VCs from top firms.</p>
							<p className="text-sm text-muted-foreground/70">Every Wednesday afternoon</p>
						</div>

						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<Code className="h-10 w-10 text-secondary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">Technical Workshops</h3>
							<p className="text-muted-foreground mb-2">Hands-on sessions on emerging technologies and development practices.</p>
							<p className="text-sm text-muted-foreground/70">Bi-weekly on Tuesdays</p>
						</div>

						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<BookOpen className="h-10 w-10 text-secondary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">Founder Book Club</h3>
							<p className="text-muted-foreground mb-2">Discussions on essential startup and business literature.</p>
							<p className="text-sm text-muted-foreground/70">Monthly on first Monday</p>
						</div>

						<div className="bg-card border border-border rounded-xl p-6">
							<div className="mb-4">
								<Users className="h-10 w-10 text-secondary" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-foreground">Demo Day</h3>
							<p className="text-muted-foreground mb-2">Showcase your startup to investors, press, and the community.</p>
							<p className="text-sm text-muted-foreground/70">End of each quarter</p>
						</div>
					</div>

					<div className="text-center mt-12">
						<Button asChild variant="outline" size="lg">
							<Link href="/">
								View All Events Calendar
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Partner Services Section */}
			<section className="py-24 bg-background overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl font-bold mb-6 text-foreground">Partner Services & Perks</h2>
						<p className="text-lg text-muted-foreground">
							Exclusive deals and resources from our partners
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="aspect-square bg-card rounded-xl flex items-center justify-center mb-4">
								<Image src="/aws-logo.svg" alt="AWS" width={80} height={80} className="p-4" />
							</div>
							<p className="text-sm font-medium text-foreground">$100K AWS Credits</p>
						</div>

						<div className="text-center">
							<div className="aspect-square bg-card rounded-xl flex items-center justify-center mb-4">
								<Image src="/stripe-logo.svg" alt="Stripe" width={80} height={80} className="p-4" />
							</div>
							<p className="text-sm font-medium text-foreground">$20K Fee-Free Processing</p>
						</div>

						<div className="text-center">
							<div className="aspect-square bg-card rounded-xl flex items-center justify-center mb-4">
								<Image src="/hubspot-logo.svg" alt="HubSpot" width={80} height={80} className="p-4" />
							</div>
							<p className="text-sm font-medium text-foreground">90% off HubSpot for 1 year</p>
						</div>

						<div className="text-center">
							<div className="aspect-square bg-card rounded-xl flex items-center justify-center mb-4">
								<Image src="/notion-logo.svg" alt="Notion" width={80} height={80} className="p-4" />
							</div>
							<p className="text-sm font-medium text-foreground">Free Notion Team Plan</p>
						</div>
					</div>

					<div className="text-center mt-12 max-w-xl mx-auto">
						<p className="text-muted-foreground mb-6">
							Plus 50+ additional partner perks and discounts on essential startup tools and services,
							collectively worth over $250,000 in savings.
						</p>
						<Button asChild variant="outline">
							<Link href="/">
								View Full Perks Package
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-card/40">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
							Ready to supercharge your startup journey?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Apply now to join our community and access all services
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-gradient-primary">
								<Link href="/apply">
									Apply for Membership
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/schedule-tour">
									Schedule a Tour
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 