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
	minimal?: boolean; // Whether to use a minimal layout without decorative elements
	showHeader?: boolean; // Whether to show the header with date, time and page counter
	showAddress?: boolean; // Whether to show the address in the header
	background?: 'default' | 'minimal' | 'none'; // Background style
}

export function DashboardLayout({
	children,
	autoRotate = true,
	rotationInterval = 15000, // 15 seconds default
	minimal = false,
	showHeader = true,
	showAddress = true,
	background = 'default'
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
		<div className="relative flex flex-col h-screen w-full bg-black p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
			{/* Dynamic Background based on selected style */}
			{background !== 'none' && (
				<div className="absolute inset-0 overflow-hidden">
					{/* Gradient Background */}
					<div className={`absolute inset-0 ${background === 'default' ? 'bg-gradient-to-br from-blue-950/30 to-purple-950/30' : 'bg-gray-950'}`} />

					{/* Animated Grid Lines - only in default mode */}
					{background === 'default' && !minimal && (
						<motion.div
							className="absolute inset-0 opacity-5"
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
					)}

					{/* Glowing Orbs - only in default mode */}
					{background === 'default' && !minimal && (
						<>
							<div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl" />
							<div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl" />
						</>
					)}
				</div>
			)}

			{/* Header - only shown if showHeader is true */}
			{showHeader && (
				<div className="relative z-50 flex justify-between items-center mt-1 px-2">
					<div className="flex flex-col">
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
						>
							Accelr8 Dashboard
						</motion.h1>
						{!minimal && (
							<div className="text-xs md:text-sm text-gray-400 mt-1">Accelerating Innovation</div>
						)}
					</div>

					<div className="flex flex-row gap-2 md:gap-6 items-center">
						{/* Date and Time */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex flex-col items-end"
						>
							<div className="text-lg md:text-xl font-bold text-white">{formattedTime}</div>
							{!minimal && (
								<div className="text-xs md:text-sm text-gray-400">{formattedDate}</div>
							)}
						</motion.div>

						{/* Address - only if showAddress is true */}
						{showAddress && !minimal && (
							<div className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mr-4">
								1551 Larkin Street, San Francisco
							</div>
						)}

						{/* Page Counter */}
						<motion.div
							className="flex items-center justify-center rounded-full bg-gray-800/70 px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm text-gray-300 border border-gray-700"
							whileHover={{ scale: 1.05 }}
						>
							{current} / {count}
						</motion.div>
					</div>
				</div>
			)}

			{/* Carousel */}
			<Carousel
				setApi={setApi}
				className={`relative z-10 w-full ${showHeader ? 'h-[calc(100vh-3rem)]' : 'h-screen'} flex-1`}
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
									<Card className={`flex h-full ${minimal ? 'bg-transparent border-0' : 'bg-gray-900/80 backdrop-blur-sm border-gray-800/40'} rounded-xl overflow-hidden ${!minimal && 'shadow-lg shadow-blue-900/5'}`}>
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
								<Card className={`flex h-full ${minimal ? 'bg-transparent border-0' : 'bg-gray-900/80 backdrop-blur-sm border-gray-800/40'} rounded-xl overflow-hidden ${!minimal && 'shadow-lg shadow-blue-900/5'}`}>
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