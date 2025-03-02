import { ProfilePicture } from '@/components/ui/profile-picture';
import { getResidentById } from '@/lib/data/data-utils';
import { Chore } from '@/lib/data/mock-data';
import { cn } from '@/lib/utils';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { DashboardCard } from './dashboard-card';

interface ChoresListProps {
	chores: Chore[];
	className?: string;
}

export function ChoresList({ chores, className }: ChoresListProps) {
	// Group cooking squad chores together
	const cookingSquad = chores.filter(chore => chore.name.includes('Cooking'));
	const otherChores = chores.filter(chore => !chore.name.includes('Cooking'));

	// Mock dinner info - would come from real data in production
	const dinnerInfo = {
		meal: "Pasta Carbonara",
		time: "7:30 PM",
		attendees: 12
	};

	return (
		<DashboardCard
			title="Today's Chores"
			className={cn("h-full", className)}
			contentClassName="overflow-hidden"
		>
			<div className="space-y-4 overflow-y-auto h-full pr-1">
				{/* Cooking Squad Section */}
				{cookingSquad.length > 0 && (
					<div className="rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 border border-blue-500/20">
						<div className="flex items-center gap-2 mb-4">
							<UtensilsCrossed className="h-5 w-5 text-blue-400" />
							<h3 className="font-semibold text-white">Tonight's Cooking Squad</h3>
						</div>

						<div className="flex justify-between items-start mb-5">
							<div className="space-y-1 max-w-[60%]">
								<div className="text-lg text-white font-medium">{dinnerInfo.meal}</div>
								<div className="flex items-center text-xs text-gray-400">
									<Clock className="h-3 w-3 mr-1" />
									<span>Dinner at {dinnerInfo.time}</span>
								</div>
							</div>
							<div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
								<span>{dinnerInfo.attendees} residents attending</span>
							</div>
						</div>

						<div className="flex justify-center space-x-4">
							{cookingSquad.map((chore) => {
								const resident = getResidentById(chore.assignedTo);
								return (
									<div key={chore.id} className="flex flex-col items-center">
										<ProfilePicture
											name={resident?.name || 'Unknown'}
											size="lg"
											square={true}
											className="shadow-lg shadow-blue-900/20"
											imageUrl={resident?.imagePath}
										/>
										<span className="text-sm font-medium text-white mt-2">
											{resident?.name?.split(' ')[0] || 'Unknown'}
										</span>
										<span className="text-xs text-gray-400">
											{chore.name.includes('1') ? 'Head Chef' : chore.name.includes('2') ? 'Sous Chef' : 'Prep Cook'}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Other Chores */}
				{otherChores.length === 0 ? (
					<div className="text-center py-6 text-gray-500">No other chores assigned for today</div>
				) : (
					<ul className="space-y-3">
						{otherChores.map((chore) => {
							const resident = getResidentById(chore.assignedTo);

							// Determine styling based on chore name
							let bgColorClass = "from-blue-900/20 to-purple-900/20";

							if (chore.name.includes('Dishes')) {
								bgColorClass = "from-blue-900/20 to-cyan-900/20";
							} else if (chore.name.includes('Trash')) {
								bgColorClass = "from-green-900/20 to-emerald-900/20";
							}

							return (
								<li
									key={chore.id}
									className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${bgColorClass} border border-gray-800`}
								>
									<div className="flex items-center gap-3">
										<div className="relative">
											<ProfilePicture
												name={resident?.name || 'Unknown'}
												size="sm"
												square={true}
												className="shadow-md"
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
						})}
					</ul>
				)}
			</div>
		</DashboardCard>
	);
} 