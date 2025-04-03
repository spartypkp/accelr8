import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { getHomepage } from "@/lib/api";
import { urlFor } from "@/lib/sanity";
import { ArrowRight, Globe, RefreshCw, Target, TrendingUp, Users, Wrench } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
	const homepage = await getHomepage();

	return {
		title: homepage?.title || "Accelr8",
		description: homepage?.description || "Accelerate your startup journey with Accelr8",
		openGraph: homepage?.openGraph || undefined,
	};
}

export default async function HomePage() {
	const homepage = await getHomepage();

	// Handle the case where homepage data isn't available
	if (!homepage) {
		return (
			<PublicLayout>
				<div className="container mx-auto px-4 py-20 text-center">
					<h1 className="text-4xl font-bold mb-4">Welcome to Accelr8</h1>
					<p className="text-lg text-gray-400">Content is being prepared. Please check back soon.</p>
				</div>
			</PublicLayout>
		);
	}

	// Extract sections from homepage content
	const heroSection = homepage.content?.find(section => section._type === 'hero');
	const featureSection = homepage.content?.find(section => section._type === 'featureSection');
	const housePreviewSection = homepage.content?.find(section => section._type === 'housePreviewSection');

	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h1 className="text-4xl md:text-6xl font-bold">
								<span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
									{heroSection?.heading?.split(' ')[0] || "Accelerate"}
								</span>{' '}
								{heroSection?.heading?.split(' ').slice(1).join(' ') || "Your Startup Journey"}
							</h1>
							<p className="text-lg md:text-xl text-gray-300 max-w-lg">
								{heroSection?.subheading || "Join a community of founders, builders, and innovators in a high-talent-density living environment designed to help you succeed."}
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button asChild size="lg">
									<Link href={heroSection?.ctaLink || "/apply"}>
										{heroSection?.ctaText || "Apply Now"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<Link href="/houses">
										Explore Houses
									</Link>
								</Button>
							</div>
						</div>
						<div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-2xl">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay z-10"></div>
							{heroSection?.image ? (
								<Image
									src={urlFor(heroSection.image).width(800).url()}
									alt="Accelr8 Hacker House"
									fill
									style={{ objectFit: 'cover' }}
								/>
							) : (
								<div className="absolute inset-0 bg-gray-800"></div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{featureSection?.heading || "Why Choose Accelr8?"}
						</h2>
						<p className="text-gray-400">
							{featureSection?.subheading || "We've designed our houses with founders in mind, providing everything you need to build, connect, and succeed."}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{featureSection?.features ? (
							featureSection.features.map((feature, index) => (
								<div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-600 transition-colors">
									<div className="mb-4">
										{/* If using Sanity icon field, you might need a mapping or custom component */}
										<div className="h-8 w-8 text-blue-400" dangerouslySetInnerHTML={{ __html: feature.icon }} />
									</div>
									<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
									<p className="text-gray-400">{feature.description}</p>
								</div>
							))
						) : (
							// Fallback features if none are provided from Sanity
							[
								{
									title: "Community",
									description: "Live and work alongside talented founders, engineers, and designers.",
									icon: <Users className="h-8 w-8 text-blue-400" />,
								},
								{
									title: "Resources",
									description: "Access dedicated workspaces, high-speed internet, and event spaces.",
									icon: <Wrench className="h-8 w-8 text-purple-400" />,
								},
								{
									title: "Network",
									description: "Connect with investors, mentors, and potential co-founders.",
									icon: <Globe className="h-8 w-8 text-green-400" />,
								},
								{
									title: "Flexibility",
									description: "Choose from various house locations and stay options that fit your needs.",
									icon: <RefreshCw className="h-8 w-8 text-yellow-400" />,
								},
								{
									title: "Events",
									description: "Participate in hackathons, demo days, and social gatherings.",
									icon: <Target className="h-8 w-8 text-red-400" />,
								},
								{
									title: "Growth",
									description: "Get feedback, learn from peers, and accelerate your startup growth.",
									icon: <TrendingUp className="h-8 w-8 text-teal-400" />,
								}
							].map((feature, index) => (
								<div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-blue-600 transition-colors">
									<div className="mb-4">{feature.icon}</div>
									<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
									<p className="text-gray-400">{feature.description}</p>
								</div>
							))
						)}
					</div>
				</div>
			</section>

			{/* Houses Preview Section */}
			<section className="py-20 bg-gradient-to-b from-gray-950 to-blue-950">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{housePreviewSection?.heading || "Our Houses"}
						</h2>
						<p className="text-gray-400">
							{housePreviewSection?.subheading || "Explore our growing network of coliving spaces designed for innovation."}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{housePreviewSection?.houses ? (
							// Map through actual houses from Sanity
							housePreviewSection.houses.map((house) => (
								<div key={house._id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
									<div className="h-48 relative">
										{house.mainImage ? (
											<Image
												src={urlFor(house.mainImage).width(400).height(192).url()}
												alt={house.name}
												fill
												style={{ objectFit: 'cover' }}
											/>
										) : (
											<div className="absolute inset-0 bg-gray-800"></div>
										)}
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-2">{house.name}</h3>
										<p className="text-gray-400 mb-4">
											{house.location?.city}, {house.location?.state}
										</p>
										<Button asChild variant="outline" className="w-full">
											<Link href={`/houses/${house.slug?.current}`}>
												View Details
											</Link>
										</Button>
									</div>
								</div>
							))
						) : (
							// Fallback sample house if none from Sanity
							<div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
								<div className="h-48 relative">
									<div className="absolute inset-0 bg-gray-800"></div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold mb-2">San Francisco - Nob Hill</h3>
									<p className="text-gray-400 mb-4">
										Our flagship location in the heart of San Francisco with stunning city views.
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded">
											20 Residents
										</span>
										<span className="bg-purple-900/30 text-purple-400 text-xs px-2 py-1 rounded">
											Startup Focused
										</span>
									</div>
									<Button asChild variant="outline" className="w-full">
										<Link href="/houses/sf-nob-hill">
											View Details
										</Link>
									</Button>
								</div>
							</div>
						)}

						{/* View All Houses */}
						<div className="bg-blue-950/30 rounded-lg overflow-hidden border border-blue-800/30 shadow-lg flex flex-col justify-center items-center p-6 h-full">
							<h3 className="text-xl font-bold mb-4 text-center">Discover All Locations</h3>
							<p className="text-gray-400 mb-6 text-center">
								Explore our growing network of houses across multiple cities.
							</p>
							<Button asChild>
								<Link href="/houses">
									View All Houses
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-black">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Ready to Accelerate Your Startup?
						</h2>
						<p className="text-xl text-gray-300 mb-8">
							Join our community of founders and innovators today.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/apply">
									Apply Now
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
