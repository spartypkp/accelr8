'use client';

import { PublicLayout } from "@/components/layout/public-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { urlFor } from "@/lib/sanity";
import { House } from "@/lib/sanity.types";
import {
	AlertCircle,
	ArrowRight,
	Building,
	Filter,
	MapPin,
	Search,
	Users,
	Wifi
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function HousesContent() {
	const searchParams = useSearchParams();
	const status = searchParams.get('status');
	const [houses, setHouses] = useState<House[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHouses = async () => {
			try {
				// Use our API route instead of direct Sanity call
				const response = await fetch('/api/houses');

				if (!response.ok) {
					throw new Error(`API responded with status: ${response.status}`);
				}

				const housesData = await response.json();
				setHouses(housesData);
			} catch (error) {
				console.error('Error fetching houses:', error);
				setError('Failed to load houses. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchHouses();
	}, []);

	return (
		<>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-primary-tr z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Our <span className="gradient-text">Houses</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8">
							Explore our network of coliving spaces designed specifically for founders,
							builders, and innovators across the United States.
						</p>
					</div>
				</div>
			</section>

			{/* Search and Filter Section */}
			<section className="py-12 bg-background border-b border-border">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						{/* Search Bar */}
						<div className="relative w-full max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search houses..."
								className="pl-10"
							/>
						</div>

						{/* Filter Button */}
						<Button variant="outline" className="gap-2">
							<Filter className="h-4 w-4" />
							Filter Options
						</Button>
					</div>

					{/* Filter Tags */}
					<div className="flex flex-wrap gap-2 mt-4">
						{['All Locations', 'Available Now', 'San Francisco', 'New York', 'Austin', 'Seattle'].map((tag, index) => (
							<Button
								key={index}
								variant={index === 0 ? "default" : "outline"}
								size="sm"
							>
								{tag}
							</Button>
						))}
					</div>
				</div>
			</section>

			{/* Houses Grid */}
			<section className="py-20 bg-background">
				<div className="container mx-auto px-4">
					{status === 'no_active_house' && (
						<Alert variant="destructive" className="mb-8">
							<AlertCircle className="h-4 w-4 mr-2" />
							<AlertTitle>Not Assigned to a House</AlertTitle>
							<AlertDescription>
								You don't currently have an active residency in any Accelr8 house.
								Please browse available houses below or contact support if you believe this is an error.
							</AlertDescription>
						</Alert>
					)}

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{[1, 2, 3].map((index) => (
								<div key={index} className="bg-card rounded-lg overflow-hidden border border-border shadow-lg h-[400px] animate-pulse">
									<div className="h-48 bg-muted" />
									<div className="p-6">
										<div className="h-6 bg-muted rounded mb-3 w-3/4" />
										<div className="h-4 bg-muted rounded mb-4 w-1/2" />
										<div className="h-4 bg-muted rounded mb-4 w-full" />
										<div className="h-10 bg-muted rounded mt-4" />
									</div>
								</div>
							))}
						</div>
					) : error ? (
						<div className="text-center py-12">
							<Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-bold mb-2">Couldn't Load Houses</h3>
							<p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
						</div>
					) : houses?.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{houses.map((house) => (
								<div
									key={house._id}
									className="bg-card rounded-lg overflow-hidden border border-border shadow-lg transition-all hover:shadow-xl hover-lift"
								>
									{/* House Image */}
									<div className="h-48 relative">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay z-10"></div>
										{house.mainImage ? (
											<Image
												src={urlFor(house.mainImage).width(400).height(192).url()}
												alt={house.name || 'House image'}
												fill
												style={{ objectFit: 'cover' }}
											/>
										) : (
											<div className="absolute inset-0 bg-muted flex items-center justify-center">
												<Building className="h-12 w-12 text-muted-foreground" />
											</div>
										)}

										{/* Availability Badge */}
										<div className="absolute top-4 right-4 bg-success/80 text-success-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
											Available
										</div>
									</div>

									{/* House Content */}
									<div className="p-6">
										<div className="flex items-start justify-between mb-3">
											<h3 className="text-xl font-bold">{house.name}</h3>
										</div>

										<div className="flex items-center mb-4 text-sm text-muted-foreground">
											<MapPin className="h-4 w-4 mr-1" />
											<span>{house.location?.city}, {house.location?.state}</span>
										</div>

										<p className="text-muted-foreground mb-4 line-clamp-3">
											{house.shortDescription}
										</p>

										{/* Key Features */}
										<div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
											<div className="flex items-center text-sm">
												<Users className="h-4 w-4 text-primary mr-2" />
												<span>20 Residents</span>
											</div>
											<div className="flex items-center text-sm">
												<Wifi className="h-4 w-4 text-primary mr-2" />
												<span>Gigabit Internet</span>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-3 mt-4">
											<Button asChild variant="outline" className="flex-1">
												<Link href={`/houses/${house.slug?.current}`}>
													View Details
												</Link>
											</Button>
											<Button asChild className="flex-1">
												<Link href="/apply">
													Apply Now
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						// Fallback when no houses are available
						<div className="col-span-full text-center py-12">
							<Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-bold mb-2">No Houses Available</h3>
							<p className="text-muted-foreground max-w-md mx-auto mb-6">
								We're currently working on adding new house locations. Please check back soon or contact us for more information.
							</p>
							<Button asChild>
								<a href="mailto:hello@accelr8.io">
									Contact Us
								</a>
							</Button>
						</div>
					)}
				</div>
			</section>

			{/* Map Overview (Placeholder) */}
			<section className="py-20 bg-muted">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Our Locations</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Accelr8 houses are strategically located in tech hubs across the United States,
							with plans to expand globally in the coming years.
						</p>
					</div>

					{/* Map Placeholder */}
					<div className="bg-card h-[500px] rounded-lg border border-border flex items-center justify-center">
						<div className="text-center">
							<MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
							<p className="text-muted-foreground max-w-md mx-auto">
								Interactive map showing all Accelr8 house locations will be displayed here.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-gradient-primary">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">
							Ready to Join the Community?
						</h2>
						<p className="text-xl text-primary-foreground/80 mb-8">
							Apply now to live alongside ambitious founders and builders in one of our houses.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button asChild size="lg" variant="secondary">
								<Link href="/apply">
									Apply Now
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
								<a href="mailto:hello@accelr8.io">
									Contact Us
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default function HousesPage() {
	return (
		<PublicLayout>
			<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading houses...</div>}>
				<HousesContent />
			</Suspense>
		</PublicLayout>
	);
}
