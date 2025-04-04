'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { urlFor } from '@/lib/sanity';
import { House } from '@/lib/sanity.types';
import { ArrowRight, Building, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';

// This component renders the house item in the carousel
function HouseCard({ house }: { house: House; }) {
	return (
		<div className="group relative">
			{/* House Image */}
			<div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
				{house.mainImage ? (
					<Image
						src={urlFor(house.mainImage).width(800).height(1000).url()}
						alt={house.name || 'House image'}
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
	);
}

// Client component that loads and displays houses
function HousesCarouselContent() {
	const [houses, setHouses] = React.useState<House[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function loadHouses() {
			try {
				// Use the API route instead of direct Sanity call
				const response = await fetch('/api/houses');

				if (!response.ok) {
					throw new Error(`API responded with status: ${response.status}`);
				}

				const housesData = await response.json();
				setHouses(housesData);
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
				<Building className="h-16 w-16 text-gray-700 mx-auto mb-4" />
				<h3 className="text-xl font-bold mb-2">Couldn't Load Houses</h3>
				<p className="text-gray-400 max-w-md mx-auto mb-6">{error}</p>
			</div>
		);
	}

	if (!houses || houses.length === 0) {
		return (
			<div className="w-full max-w-7xl mx-auto text-center py-12">
				<Building className="h-16 w-16 text-gray-700 mx-auto mb-4" />
				<h3 className="text-xl font-bold mb-2">New Houses Coming Soon</h3>
				<p className="text-gray-400 max-w-md mx-auto mb-6">
					We're expanding our network of houses. Join the waitlist to be notified when new locations open.
				</p>
			</div>
		);
	}

	return (
		<Carousel className="w-full max-w-7xl mx-auto">
			<CarouselContent>
				{houses.map((house) => (
					<CarouselItem key={house._id} className="md:basis-1/2 lg:basis-1/3">
						<HouseCard house={house} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden sm:flex left-4 lg:-left-12" />
			<CarouselNext className="hidden sm:flex right-4 lg:-right-12" />
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
				{[1, 2, 3].map((index) => (
					<div key={index} className="relative animate-pulse">
						<div className="aspect-[3/4] bg-gray-800 rounded-2xl"></div>
					</div>
				))}
			</div>
		</div>
	);
} 