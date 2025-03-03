import { HouseStat } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HouseStatVisualization } from './HouseStatVisualization';

interface HouseStatsCarouselProps {
	stats: HouseStat[];
	className?: string;
	autoRotate?: boolean;
	rotationInterval?: number;
}

/**
 * A carousel component that displays house stats with custom visualizations
 * and allows for manual navigation or automatic rotation
 */
export function HouseStatsCarousel({
	stats,
	className,
	autoRotate = true,
	rotationInterval = 8000
}: HouseStatsCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Handle automatic rotation
	useEffect(() => {
		if (!autoRotate || isPaused || stats.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % stats.length);
		}, rotationInterval);

		return () => clearInterval(interval);
	}, [stats, autoRotate, rotationInterval, isPaused]);

	// Navigation functions
	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % stats.length);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + stats.length) % stats.length);
	};

	if (!stats.length) {
		return (
			<div className={cn("flex items-center justify-center h-full", className)}>
				<p className="text-gray-400">No house stats available</p>
			</div>
		);
	}

	return (
		<div
			className={cn("relative flex flex-col h-full", className)}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{/* Main Visualization Area */}
			<div className="flex-1 relative flex items-center justify-center w-full">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						className="absolute inset-0 flex items-center justify-center"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
					>
						<HouseStatVisualization
							stat={stats[currentIndex]}
							className="px-2"
						/>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation Controls */}
			{stats.length > 1 && (
				<div className="flex items-center justify-center gap-4 mt-4">
					<button
						onClick={goToPrevious}
						className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
						aria-label="Previous stat"
					>
						<ArrowLeft className="h-4 w-4 text-blue-400" />
					</button>

					<div className="flex gap-1.5">
						{stats.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={cn(
									"w-2 h-2 rounded-full transition-all",
									index === currentIndex
										? "bg-blue-400 scale-125"
										: "bg-blue-400/30 hover:bg-blue-400/50"
								)}
								aria-label={`Go to stat ${index + 1}`}
							/>
						))}
					</div>

					<button
						onClick={goToNext}
						className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
						aria-label="Next stat"
					>
						<ArrowRight className="h-4 w-4 text-blue-400" />
					</button>
				</div>
			)}
		</div>
	);
} 