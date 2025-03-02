import { Card } from '@/components/ui/card';
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
	children: React.ReactNode;
	autoRotate?: boolean;
	rotationInterval?: number; // in milliseconds
}

export function DashboardLayout({
	children,
	autoRotate = true,
	rotationInterval = 15000, // 15 seconds default
}: DashboardLayoutProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every minute
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	// Format time as HH:MM AM/PM
	const formattedTime = currentTime.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

	// Format date as Weekday, Month Day
	const formattedDate = currentTime.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});

	// Set up auto-rotation
	useEffect(() => {
		if (!api || !autoRotate) return;

		// Set up interval for auto-rotation
		const interval = setInterval(() => {
			api.scrollNext();
		}, rotationInterval);

		// Clear interval on cleanup
		return () => clearInterval(interval);
	}, [api, autoRotate, rotationInterval]);

	// Update current state when carousel changes
	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<div className="relative flex flex-col h-screen w-full bg-black p-4 gap-4 overflow-hidden">
			{/* Dynamic Background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 to-purple-950/30" />

				{/* Animated Grid Lines */}
				<motion.div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
						backgroundSize: '60px 60px'
					}}
					animate={{
						y: [0, 60],
						x: [0, 60]
					}}
					transition={{
						repeat: Infinity,
						duration: 120,
						ease: "linear"
					}}
				/>

				{/* Glowing Orbs */}
				<div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />
				<div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
			</div>

			{/* Header */}
			<div className="relative z-10 flex justify-between items-center">
				<div className="flex flex-col">
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
					>
						Accelr8 Dashboard
					</motion.h1>
					<div className="text-sm text-gray-400 mt-1">Accelerating Innovation</div>
				</div>

				<div className="flex flex-row gap-6 items-center">
					{/* Date and Time */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex flex-col items-end"
					>
						<div className="text-xl font-bold text-white">{formattedTime}</div>
						<div className="text-sm text-gray-400">{formattedDate}</div>
					</motion.div>

					{/* Address */}
					<div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mr-4">
						1551 Larkin Street, San Francisco
					</div>

					{/* Page Counter */}
					<motion.div
						className="flex items-center justify-center rounded-full bg-gray-800/70 px-3 py-1 text-sm text-gray-300 border border-gray-700"
						whileHover={{ scale: 1.05 }}
					>
						{current} / {count}
					</motion.div>
				</div>
			</div>

			{/* Carousel */}
			<Carousel
				setApi={setApi}
				className="relative z-10 w-full h-[calc(100vh-4rem)] flex-1"
				opts={{
					align: "start",
					loop: true,
				}}
			>
				<CarouselContent className="h-full">
					{Array.isArray(children) ? (
						children.map((child, index) => (
							<CarouselItem key={index} className="h-full">
								<motion.div
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
									className="h-full"
								>
									<Card className="flex h-full bg-gray-900/80 backdrop-blur-sm border-gray-800/40 rounded-xl overflow-hidden shadow-lg shadow-blue-900/10">
										{child}
									</Card>
								</motion.div>
							</CarouselItem>
						))
					) : (
						<CarouselItem className="h-full">
							<motion.div
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="h-full"
							>
								<Card className="flex h-full bg-gray-900/80 backdrop-blur-sm border-gray-800/40 rounded-xl overflow-hidden shadow-lg shadow-blue-900/10">
									{children}
								</Card>
							</motion.div>
						</CarouselItem>
					)}
				</CarouselContent>
			</Carousel>
		</div>
	);
} 