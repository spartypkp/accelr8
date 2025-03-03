import { Resident } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { ResidentProfile } from '../cards/resident-profile';

interface ResidentStatsPageProps {
	residents: Resident[];
	pageIndex: number;
	totalPages: number;
	className?: string;
}

export function ResidentStatsPage({
	residents,
	pageIndex,
	totalPages,
	className
}: ResidentStatsPageProps) {
	// Animation variants for staggered animations
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.3
			}
		},
		exit: {
			opacity: 0,
			transition: { staggerChildren: 0.05, staggerDirection: -1 }
		}
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 }
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className={cn("h-screen w-full flex flex-col overflow-hidden p-4 md:p-6", className)}
		>
			{/* Page header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center justify-center">
					<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
						<Users className="text-blue-400 h-4 w-4" />
					</div>

					<motion.h2
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
						className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
					>
						Resident Spotlight
					</motion.h2>
				</div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3 }}
					className="bg-gray-800/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm border border-gray-700/50"
				>
					<span className="text-blue-400 font-medium">{pageIndex + 1}</span>
					<span className="text-gray-400"> of </span>
					<span className="text-purple-400 font-medium">{totalPages}</span>
				</motion.div>
			</div>

			{/* Resident profiles grid */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 h-[calc(100vh-100px)]"
			>
				{residents.map((resident, index) => (
					<motion.div
						key={resident.id}
						variants={cardVariants}
						transition={{ duration: 0.4 }}
						className="h-full overflow-hidden"
					>
						<ResidentProfile resident={resident} />
					</motion.div>
				))}

				{/* Fill in empty slots with placeholder if needed */}
				{residents.length < 4 &&
					Array(4 - residents.length)
						.fill(null)
						.map((_, index) => (
							<motion.div
								key={`empty-${index}`}
								variants={cardVariants}
								transition={{ duration: 0.4 }}
								className="border border-gray-800/30 rounded-xl bg-gray-900/20 flex items-center justify-center h-full backdrop-blur-sm"
							>
								<div className="text-gray-600 text-center p-6">
									<Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
									<p className="opacity-60">Awaiting new resident</p>
								</div>
							</motion.div>
						))
				}
			</motion.div>
		</motion.div>
	);
} 