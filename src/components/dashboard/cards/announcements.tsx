import { Announcement } from '@/lib/data/mock-data';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, InfoIcon, Megaphone } from 'lucide-react';
import { DashboardCard } from './dashboard-card';

interface AnnouncementsProps {
	announcements: Announcement[];
	className?: string;
}

export function Announcements({ announcements, className }: AnnouncementsProps) {
	return (
		<DashboardCard
			title="Announcements"
			titleClassName="flex items-center gap-2"
			titleIcon={<Megaphone className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			{announcements.length === 0 ? (
				<div className="text-center py-6 text-gray-500">No announcements</div>
			) : (
				<div className="space-y-3 overflow-y-auto h-full pr-1">
					{announcements.map((announcement, index) => {
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

						return (
							<motion.div
								key={announcement.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
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
					})}
				</div>
			)}
		</DashboardCard>
	);
} 