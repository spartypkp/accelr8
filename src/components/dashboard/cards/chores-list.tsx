import { ProfilePicture } from '@/components/ui/profile-picture';
import { getResidentById } from '@/lib/data/data-utils';
import { Chore } from '@/lib/data/mock-data';
import { cn, formatDate } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardCard } from './dashboard-card';

interface ChoresListProps {
	chores: Chore[];
	className?: string;
	compact?: boolean;
	autoCycle?: boolean;
	cycleDuration?: number;
}

export function ChoresList({
	chores,
	className,
	compact = false,
	autoCycle = false,
	cycleDuration = 8000
}: ChoresListProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Auto cycle through chores if enabled
	useEffect(() => {
		if (!autoCycle || chores.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % chores.length);
		}, cycleDuration);

		return () => clearInterval(interval);
	}, [autoCycle, chores.length, cycleDuration]);

	// Handler for manual navigation
	const handlePrevious = () => {
		setCurrentIndex(prev => (prev - 1 + chores.length) % chores.length);
	};

	const handleNext = () => {
		setCurrentIndex(prev => (prev + 1) % chores.length);
	};

	// Return empty state if no chores
	if (chores.length === 0) {
		return (
			<DashboardCard
				title={compact ? undefined : "Today's Chores"}
				titleClassName={compact ? undefined : "flex items-center gap-2"}
				titleIcon={compact ? undefined : <UtensilsCrossed className="w-4 h-4 text-blue-400" />}
				className={cn("h-full", className)}
				contentClassName="overflow-hidden"
			>
				<div className="text-center py-3 text-gray-500 text-sm">No chores for today</div>
			</DashboardCard>
		);
	}

	// Function to render a single chore
	const renderChore = (chore: Chore, isCompact: boolean) => {
		// Look up the resident assigned to this chore
		const resident = getResidentById(chore.assignedTo);

		// Determine styling based on chore type
		let colorClass = "from-amber-500/20 to-amber-500/5";
		let borderClass = "border-amber-500/20";
		let bgClass = "bg-amber-500/10";

		if (chore.name.includes('Cooking')) {
			if (chore.name.includes('1')) {
				colorClass = "from-blue-500/20 to-blue-500/5";
				borderClass = "border-blue-500/20";
				bgClass = "bg-blue-500/10";
			} else if (chore.name.includes('2')) {
				colorClass = "from-purple-500/20 to-purple-500/5";
				borderClass = "border-purple-500/20";
				bgClass = "bg-purple-500/10";
			} else {
				colorClass = "from-cyan-500/20 to-cyan-500/5";
				borderClass = "border-cyan-500/20";
				bgClass = "bg-cyan-500/10";
			}
		} else if (chore.name.includes('Dishes')) {
			colorClass = "from-sky-500/20 to-cyan-500/5";
			borderClass = "border-sky-500/20";
			bgClass = "bg-sky-500/10";
		} else if (chore.name.includes('Trash')) {
			colorClass = "from-green-500/20 to-emerald-500/5";
			borderClass = "border-green-500/20";
			bgClass = "bg-green-500/10";
		}

		if (isCompact) {
			// Compact version for TV display
			return (
				<div className={cn(
					"p-1.5 rounded-lg bg-gradient-to-br border",
					colorClass, borderClass,
					"shadow-sm"
				)}>
					<div className="flex items-center gap-1.5">
						<div className="relative flex-shrink-0">
							<ProfilePicture
								name={resident?.name || 'Unknown'}
								size="sm"
								square={true}
								imageUrl={resident?.imagePath}
								showBorder
							/>
							{chore.completed && (
								<div className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-0.5 border border-gray-900">
									<Check className="h-2 w-2 text-white" />
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<div className="font-medium text-[10px] text-white truncate">
								{chore.name}
							</div>
							<div className="flex items-center">
								<span className="text-[8px] text-gray-400">
									{formatDate(chore.dueDate)}
								</span>
								<span className={cn(
									"ml-1.5 px-1 py-0.5 rounded-full text-[8px]",
									chore.completed
										? "bg-green-900/30 text-green-400"
										: "bg-yellow-900/30 text-yellow-400"
								)}>
									{chore.completed ? "Completed" : "Due Today"}
								</span>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// Full version for standard view
		if (chore.name.includes('Cooking')) {
			// Cooking squad members
			const roleColor = chore.name.includes('1')
				? "shadow-blue-500/30 ring-blue-500/30"
				: chore.name.includes('2')
					? "shadow-purple-500/30 ring-purple-500/30"
					: "shadow-cyan-500/30 ring-cyan-500/30";

			return (
				<motion.div
					className="flex flex-col items-center"
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
				>
					<motion.div className="relative">
						<motion.div
							className="absolute -inset-1 rounded-xl blur-md -z-10 bg-blue-500/10"
							animate={{
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
						<ProfilePicture
							name={resident?.name || 'Unknown'}
							size="lg"
							square={true}
							className={`shadow-lg ${roleColor}`}
							imageUrl={resident?.imagePath}
							showBorder
						/>
					</motion.div>
					<span className="text-sm font-medium text-white mt-2">
						{resident?.name?.split(' ')[0] || 'Unknown'}
					</span>
					<span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${chore.name.includes('1')
						? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
						: chore.name.includes('2')
							? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
							: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
						}`}>
						{chore.name.includes('1') ? 'Head Chef' : chore.name.includes('2') ? 'Sous Chef' : 'Prep Cook'}
					</span>
				</motion.div>
			);
		}

		// Other chores
		return (
			<li className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${colorClass} border ${borderClass}`}>
				<div className="flex items-center gap-3">
					<div className="relative">
						<motion.div
							className="absolute -inset-1 rounded-md blur-sm -z-10 bg-gray-500/10"
							animate={{
								opacity: [0.2, 0.4, 0.2],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
						<ProfilePicture
							name={resident?.name || 'Unknown'}
							size="sm"
							square={true}
							imageUrl={resident?.imagePath}
							showBorder
						/>
					</div>
					<div>
						<div className="font-medium">{chore.name}</div>
						<div className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
					</div>
				</div>
				<div className="text-sm text-gray-400">
					{resident?.name || 'Unknown'}
				</div>
			</li>
		);
	};

	// If compact mode is enabled and we want to display them all at once
	if (compact) {
		// Compact list view
		return (
			<DashboardCard
				title={undefined}
				className={cn("h-full", className)}
				contentClassName="overflow-hidden"
			>
				<div className="space-y-1">
					{chores.map((chore, index) => (
						<motion.div
							key={chore.id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
						>
							{renderChore(chore, true)}
						</motion.div>
					))}
				</div>
			</DashboardCard>
		);
	}

	// Otherwise, standard case is to use the auto-cycling functionality
	return (
		<DashboardCard
			title="Today's Chores"
			titleClassName="flex items-center gap-2"
			titleIcon={<UtensilsCrossed className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="flex justify-end mb-2">
				<div className="flex items-center gap-1">
					<button
						onClick={handlePrevious}
						className="p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
					>
						<ChevronLeft className="w-3 h-3" />
					</button>
					<div className="text-xs text-gray-400">
						{currentIndex + 1}/{chores.length}
					</div>
					<button
						onClick={handleNext}
						className="p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
					>
						<ChevronRight className="w-3 h-3" />
					</button>
				</div>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={chores[currentIndex].id}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className="py-1"
				>
					{renderChore(chores[currentIndex], false)}
				</motion.div>
			</AnimatePresence>
		</DashboardCard>
	);
} 