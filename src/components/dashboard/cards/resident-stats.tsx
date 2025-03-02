import { ProfilePicture } from '@/components/ui/profile-picture';
import { Resident } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import { StatCard } from './stat-card';

interface ResidentStatsProps {
	residents: Resident[];
	className?: string;
}

export function ResidentStats({ residents, className }: ResidentStatsProps) {
	return (
		<DashboardCard
			title="Resident Goals"
			titleIcon={<Users className="w-4 h-4 text-blue-400" />}
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
				{residents.map((resident, residentIndex) => (
					<motion.div
						key={resident.id}
						className="flex flex-col space-y-3 overflow-hidden bg-gray-900/40 rounded-lg p-3 border border-gray-800"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: residentIndex * 0.1 }}
					>
						<div className="flex items-center gap-3">
							<ProfilePicture
								name={resident.name}
								size="md"
								square={true}
								className="shadow-md"
							/>

							<div className="flex-1">
								<div className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text flex-shrink-0">
									{resident.name}
								</div>

								{/* GitHub handle if available */}
								{resident.github && (
									<div className="text-xs text-gray-400 flex items-center mt-1">
										<svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										{resident.github}
									</div>
								)}
							</div>
						</div>

						<div className="flex flex-col space-y-3 overflow-y-auto flex-1 pr-1">
							{resident.customStats.map((stat, index) => (
								<motion.div
									key={`${resident.id}-${index}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
								>
									<StatCard
										title={stat.name}
										value={stat.value}
										target={stat.target}
										unit={stat.unit}
										className="h-auto"
									/>
								</motion.div>
							))}
						</div>
					</motion.div>
				))}
			</div>
		</DashboardCard>
	);
} 