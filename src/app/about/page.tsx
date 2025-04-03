import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Building, Heart, Target, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About Accelr8 | Coliving for Founders",
	description: "Learn about our mission to accelerate innovation through community, collaboration, and shared living spaces.",
};

export default function AboutPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							About <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Accelr8</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							We're building the future of founder housing and communities,
							designed specifically for innovators and entrepreneurs.
						</p>
					</div>
				</div>
			</section>

			{/* Our Story Section */}
			<section className="py-20 bg-gradient-to-b from-gray-950 to-blue-950/80">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div className="order-2 md:order-1">
							<h2 className="text-3xl font-bold mb-6">Our Story</h2>
							<p className="text-gray-300 mb-4">
								Accelr8 began with a simple observation: the most successful founders often
								lived and worked alongside other ambitious builders during their journey.
							</p>
							<p className="text-gray-300 mb-4">
								Founded in 2022, we started with a single house in San Francisco, bringing
								together founders, engineers, and designers under one roof. The results were
								remarkable - spontaneous collaborations, late-night brainstorming sessions,
								and a support network that extended far beyond typical accelerator programs.
							</p>
							<p className="text-gray-300">
								Today, we're expanding our vision to create a network of houses where innovation
								happens naturally, and where the next generation of world-changing companies
								can begin their journey.
							</p>
						</div>
						<div className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay z-10"></div>
							{/* Placeholder for actual image */}
							<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
								<Building className="h-20 w-20 text-gray-700" />
							</div>
							{/* Uncomment when real image is available */}
							{/* <Image 
                src="/images/accelr8-founding.jpg"
                alt="Accelr8 founding team"
                fill
                style={{ objectFit: 'cover' }}
              /> */}
						</div>
					</div>
				</div>
			</section>

			{/* Mission and Values */}
			<section className="py-20 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
						<p className="text-gray-400">
							We're guided by a clear purpose and a strong set of principles
							that shape everything we do.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
						<div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
							<div className="mb-4">
								<Target className="h-10 w-10 text-blue-500" />
							</div>
							<h3 className="text-2xl font-bold mb-4">Our Mission</h3>
							<p className="text-gray-300">
								To accelerate innovation by creating environments where talented
								founders can live, collaborate, and build together, with the resources,
								community, and support they need to succeed.
							</p>
						</div>
						<div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
							<div className="mb-4">
								<Heart className="h-10 w-10 text-red-500" />
							</div>
							<h3 className="text-2xl font-bold mb-4">Our Vision</h3>
							<p className="text-gray-300">
								A global network of innovation hubs where the next generation of
								technology companies are born, all connected through a shared community
								of ambitious builders and entrepreneurs.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								title: "Community First",
								description: "We believe that meaningful connections between founders create exponential value.",
								icon: <Users className="h-8 w-8 text-blue-400" />,
							},
							{
								title: "High Talent Density",
								description: "We curate our houses to bring together exceptional people with complementary skills.",
								icon: <Award className="h-8 w-8 text-yellow-400" />,
							},
							{
								title: "Collaboration Over Competition",
								description: "We foster an environment of shared learning and mutual support.",
								icon: <Building className="h-8 w-8 text-purple-400" />,
							},
						].map((value, index) => (
							<div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
								<div className="mb-4">{value.icon}</div>
								<h3 className="text-xl font-bold mb-2">{value.title}</h3>
								<p className="text-gray-400">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section (Placeholder) */}
			<section className="py-20 bg-gradient-to-b from-blue-950 to-black">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl font-bold mb-4">Our Team</h2>
						<p className="text-gray-400">
							Meet the passionate people behind Accelr8 who are dedicated to
							supporting founders and building exceptional communities.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Team Member Cards (Placeholders) */}
						{[1, 2, 3].map((member) => (
							<div key={member} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 text-center">
								<div className="h-64 relative">
									<div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 mix-blend-overlay z-10"></div>
									{/* Placeholder for actual team member image */}
									<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
										<Users className="h-16 w-16 text-gray-700" />
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold mb-1">Team Member Name</h3>
									<p className="text-blue-400 mb-4">Position</p>
									<p className="text-gray-400">
										Short bio about the team member and their background.
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-black">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Ready to Join Our Community?
						</h2>
						<p className="text-xl text-gray-300 mb-8">
							Apply today to become part of our growing network of founders and innovators.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/apply">
									Apply Now
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/houses">
									Explore Our Houses
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 