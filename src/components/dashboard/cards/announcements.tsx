import { Announcement } from '@/lib/data/mock-data';
import { cn, formatDate } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, InfoIcon, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardCard } from './dashboard-card';

interface AnnouncementsProps {
	announcements: Announcement[];
	className?: string;
	compact?: boolean;
	autoCycle?: boolean;
	cycleDuration?: number;
}

export function Announcements({
	announcements,
	className,
	compact = false,
	autoCycle = false,
	cycleDuration = 8000
}: AnnouncementsProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Auto cycle through announcements if enabled
	useEffect(() => {
		if (!autoCycle || announcements.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % announcements.length);
		}, cycleDuration);

		return () => clearInterval(interval);
	}, [autoCycle, announcements.length, cycleDuration]);

	// Handler for manual navigation
	const handlePrevious = () => {
		setCurrentIndex(prev => (prev - 1 + announcements.length) % announcements.length);
	};

	const handleNext = () => {
		setCurrentIndex(prev => (prev + 1) % announcements.length);
	};

	// Return empty state if no announcements
	if (announcements.length === 0) {
		return (
			<DashboardCard
				title={compact ? undefined : "Announcements"}
				titleClassName={compact ? undefined : "flex items-center gap-2"}
				titleIcon={compact ? undefined : <Megaphone className="w-4 h-4 text-blue-400" />}
				className={cn("h-full", className)}
				contentClassName="overflow-hidden"
			>
				<div className="text-center py-3 text-gray-500 text-sm">No announcements</div>
			</DashboardCard>
		);
	}

	// Function to render a single announcement
	const renderAnnouncement = (announcement: Announcement, index: number, isCompact: boolean) => {
		// Determine styling based on priority
		let Icon = InfoIcon;
		let priorityColor = "text-blue-500";
		let priorityBg = "from-blue-500/20 to-blue-500/5";
		let priorityBorder = "border-blue-500/20";
		let priorityGlow = "shadow-blue-500/10";
		let priorityLabel = "Info";

		if (announcement.priority === 'medium') {
			Icon = AlertTriangle;
			priorityColor = "text-yellow-500";
			priorityBg = "from-yellow-500/20 to-yellow-500/5";
			priorityBorder = "border-yellow-500/20";
			priorityGlow = "shadow-yellow-500/10";
			priorityLabel = "Important";
		} else if (announcement.priority === 'high') {
			Icon = AlertCircle;
			priorityColor = "text-red-500";
			priorityBg = "from-red-500/20 to-red-500/5";
			priorityBorder = "border-red-500/20";
			priorityGlow = "shadow-red-500/10";
			priorityLabel = "Urgent";
		}

		if (isCompact) {
			// Compact version for TV display
			return (
				<motion.div
					key={announcement.id}
					className={cn(
						"p-1.5 rounded-lg bg-gradient-to-br border",
						priorityBg, priorityBorder,
						"shadow-sm", priorityGlow
					)}
				>
					<div className="flex items-start gap-1.5">
						<div className={cn(
							"flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
							"bg-gray-900/60", priorityColor, "border", priorityBorder
						)}>
							<Icon className="w-2.5 h-2.5" />
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-start mb-0.5">
								<div className="flex items-center gap-1 flex-wrap">
									<h3 className="font-semibold text-[10px] text-white truncate">{announcement.title}</h3>
									<span className={cn(
										"text-[8px] px-1 py-0.5 rounded-full",
										priorityColor, "bg-gray-900/60", priorityBorder
									)}>
										{priorityLabel}
									</span>
								</div>
								<span className="text-[8px] text-gray-400 ml-1 bg-gray-900/40 px-1 py-0.5 rounded-full whitespace-nowrap">
									{formatDate(announcement.date)}
								</span>
							</div>
							<p className="text-[9px] text-gray-300 line-clamp-1">{announcement.content}</p>
						</div>
					</div>
				</motion.div>
			);
		}

		// Full version
		return (
			<motion.div
				key={announcement.id}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className={cn(
					"p-3 rounded-lg bg-gradient-to-br border",
					priorityBg, priorityBorder,
					"shadow-lg", priorityGlow
				)}
			>
				<div className="flex items-start gap-3">
					<div className={cn(
						"flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
						"bg-gray-900/60", priorityColor, "border", priorityBorder
					)}>
						<Icon className="w-4 h-4" />
					</div>

					<div className="flex-1">
						<div className="flex justify-between items-start mb-1">
							<div className="flex items-center gap-2">
								<h3 className="font-semibold text-sm text-white">{announcement.title}</h3>
								<span className={cn(
									"text-xs px-2 py-0.5 rounded-full",
									priorityColor, "bg-gray-900/60", priorityBorder
								)}>
									{priorityLabel}
								</span>
							</div>
							<span className="text-xs text-gray-400 ml-2 bg-gray-900/40 px-2 py-0.5 rounded-full">
								{formatDate(announcement.date)}
							</span>
						</div>
						<p className="mt-1 text-sm text-gray-300 leading-relaxed">{announcement.content}</p>
					</div>
				</div>
			</motion.div>
		);
	};

	// For single announcement with auto cycle or compact view
	if ((announcements.length === 1 || autoCycle) && compact) {
		return (
			<div className={cn("h-full flex flex-col", className)}>
				<div className="flex justify-between items-center mb-1">
					{announcements.length > 1 && (
						<div className="flex items-center gap-2">
							<button
								onClick={handlePrevious}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700"
							>
								<ChevronLeft className="w-3 h-3" />
							</button>
							<div className="text-[10px] text-gray-400">
								{currentIndex + 1} / {announcements.length}
							</div>
							<button
								onClick={handleNext}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700"
							>
								<ChevronRight className="w-3 h-3" />
							</button>
						</div>
					)}
				</div>

				<div className="flex-1 overflow-hidden">
					<AnimatePresence mode="wait">
						<motion.div
							key={announcements[currentIndex].id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -5 }}
							transition={{ duration: 0.3 }}
						>
							{renderAnnouncement(announcements[currentIndex], 0, true)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		);
	}

	// For compact view, we'll add navigation controls outside the component
	if (compact) {
		return (
			<div data-component="announcements" className={cn("h-full", className)}>
				<AnimatePresence mode="wait">
					<motion.div
						key={announcements[currentIndex].id}
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.3 }}
						className="h-full"
					>
						{renderAnnouncement(announcements[currentIndex], currentIndex, true)}
					</motion.div>
				</AnimatePresence>

				{/* Hidden buttons for external control */}
				<button
					data-action="prev"
					className="hidden"
					onClick={handlePrevious}
					aria-hidden="true"
				/>
				<button
					data-action="next"
					className="hidden"
					onClick={handleNext}
					aria-hidden="true"
				/>
			</div>
		);
	}

	// Full rendering for multiple announcements without auto-cycling
	return (
		<DashboardCard
			title={compact ? undefined : "Announcements"}
			titleClassName={compact ? undefined : "flex items-center gap-2"}
			titleIcon={compact ? undefined : <Megaphone className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className={compact ? "space-y-2" : "space-y-3"}>
				{compact ? (
					// Compact list view
					announcements.map((announcement, index) => (
						renderAnnouncement(announcement, index, true)
					))
				) : (
					// Standard list view
					announcements.map((announcement, index) => (
						renderAnnouncement(announcement, index, false)
					))
				)}
			</div>
		</DashboardCard>
	);
} 