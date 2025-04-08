'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getHouses } from '@/lib/api/houses';
import { urlFor } from '@/lib/sanity/client';
import { House } from '@/lib/types';
import { ArrowRight, Building, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

// This component renders the house item in the carousel
function HouseCard({ house }: { house: House; }) {
	return (
		<div className="group relative h-full">
			{/* House Image */}
			<div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-md h-full">
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
				{house.sanityHouse?.mainImage ? (
					<Image
						src={urlFor(house.sanityHouse?.mainImage).width(800).height(1000).url()}
						alt={house.sanityHouse?.name || 'House image'}
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
				<h3 className="text-2xl font-bold mb-2 text-white">{house.sanityHouse?.name}</h3>
				<div className="flex items-center mb-4 text-sm text-gray-300">
					<MapPin className="h-4 w-4 mr-2" />
					<span>{house.sanityHouse?.location?.city}, {house.sanityHouse?.location?.state}</span>
				</div>

				<Button asChild className="mt-4 w-full bg-gradient-primary hover:bg-gradient-primary/90 transition-colors">
					<Link href={`/houses/${house.sanityHouse?.slug?.current}`}>
						View Details
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

// Client component that loads and displays houses
function HousesCarouselContent() {
	const [houses, setHouses] = useState<House[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadHouses() {
			try {
				// Use the API route instead of direct Sanity call
				const houses = await getHouses();
				setHouses(houses);
			} catch (error) {
				console.error('Error loading houses:', error);
				setError('Failed to load houses. Please try again later.');
			} finally {
				setLoading(false);
			}
		}

		loadHouses();
	}, []);

	if (loading) {
		return <LoadingCarousel />;
	}

	if (error) {
		return (
			<div className="w-full max-w-7xl mx-auto text-center py-12">
				<div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6 mx-auto">
					<Building className="h-12 w-12 text-primary" />
				</div>
				<h3 className="text-2xl font-bold mb-4">Couldn't Load Houses</h3>
				<p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
				<Button variant="outline" onClick={() => window.location.reload()}>
					Try Again
				</Button>
			</div>
		);
	}

	if (!houses || houses.length === 0) {
		return (
			<div className="w-full max-w-7xl mx-auto text-center py-12">
				<div className="bg-secondary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6 mx-auto">
					<Building className="h-12 w-12 text-secondary" />
				</div>
				<h3 className="text-2xl font-bold mb-4">New Houses Coming Soon</h3>
				<p className="text-muted-foreground max-w-md mx-auto mb-6">
					We're expanding our network of houses. Join the waitlist to be notified when new locations open.
				</p>
				<Button asChild className="bg-gradient-primary hover:bg-gradient-primary/90">
					<Link href="/apply">
						Join Waitlist
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<Carousel className="w-full max-w-7xl mx-auto">
			<CarouselContent>
				{houses.map((house) => (
					<CarouselItem key={house.sanityHouse?._id} className="md:basis-1/2 lg:basis-1/3 h-full">
						<div className="p-1 h-full">
							<HouseCard house={house} />
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden sm:flex left-4 lg:-left-12 bg-primary/10 text-primary border-primary/10 hover:bg-primary/20 hover:text-primary" />
			<CarouselNext className="hidden sm:flex right-4 lg:-right-12 bg-primary/10 text-primary border-primary/10 hover:bg-primary/20 hover:text-primary" />
		</Carousel>
	);
}

// This is the wrapper component that uses React.lazy for code splitting
export default function HousesCarousel() {
	return (
		<div className="w-full">
			<Suspense fallback={<LoadingCarousel />}>
				<HousesCarouselContent />
			</Suspense>
		</div>
	);
}

// Loading state component
function LoadingCarousel() {
	return (
		<div className="w-full max-w-7xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{[1, 2, 3].map((index) => (
					<div key={index} className="relative animate-pulse p-1">
						<div className="aspect-[3/4] bg-gray-800/30 rounded-2xl shadow-md">
							<div className="absolute bottom-0 left-0 right-0 p-8">
								<div className="h-8 bg-gray-700/30 rounded-md mb-4"></div>
								<div className="h-4 bg-gray-700/30 rounded-md w-3/4 mb-6"></div>
								<div className="h-10 bg-gray-700/30 rounded-md w-full mt-4"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
} 