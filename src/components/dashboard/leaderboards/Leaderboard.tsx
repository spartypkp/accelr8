import { ProfilePicture } from '@/components/ui/profile-picture';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

export interface LeaderboardParticipant {
	id: string;
	name: string;
	imagePath?: string;
	score: number;
	additionalData?: Record<string, any>;
}

export interface LeaderboardProps {
	title: string;
	titleIcon: ReactNode;
	participants: LeaderboardParticipant[];
	className?: string;
	limit?: number;
	/** Optional renderer for top performers podium */
	renderPodium?: (topParticipants: LeaderboardParticipant[]) => ReactNode;
	/** Optional renderer for detail section (chart, etc.) */
	renderDetail?: (participants: LeaderboardParticipant[]) => ReactNode;
	/** Optional custom renderer for each participant row */
	renderParticipantRow?: (participant: LeaderboardParticipant, index: number, maxScore: number) => ReactNode;
	/** Optional formatter for score display */
	formatScore?: (score: number) => string;
	/** Unit to display after score (e.g., "commits", "workouts") */
	scoreUnit?: string;
}

export function Leaderboard({
	title,
	titleIcon,
	participants,
	className,
	limit = 10,
	renderPodium,
	renderDetail,
	renderParticipantRow,
	formatScore = (score) => score.toString(),
	scoreUnit = ""
}: LeaderboardProps) {
	// Sort by score and limit to top N
	const sortedParticipants = [...participants]
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	const maxScore = sortedParticipants[0]?.score || 0;

	return (
		<div className={cn(
			"h-full flex flex-col overflow-hidden",
			className
		)}>
			{/* Header */}
			<div className="p-2 sm:p-3 border-b border-gray-700/30 flex-shrink-0">
				<div className="flex items-center justify-center mb-2 sm:mb-3">

					<h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
						{title}
					</h2>

				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-hidden flex flex-col">
				{renderPodium && (
					<div className="flex-shrink-0 px-2 sm:px-3 pt-2 sm:pt-3 pb-2">
						{renderPodium(sortedParticipants.slice(0, 3))}
					</div>
				)}

				{/* Participants List */}
				<div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
					{sortedParticipants.length === 0 ? (
						<div className="text-center py-6 text-gray-500 h-full flex items-center justify-center">
							<p>No data available</p>
						</div>
					) : (
						sortedParticipants.map((participant, index) => (
							renderParticipantRow ? (
								<div key={participant.id}>
									{renderParticipantRow(participant, index, maxScore)}
								</div>
							) : (
								<DefaultParticipantRow
									key={participant.id}
									participant={participant}
									index={index}
									maxScore={maxScore}
									formatScore={formatScore}
									scoreUnit={scoreUnit}
								/>
							)
						))
					)}
				</div>

				{/* Optional detail section (e.g., chart) */}
				{renderDetail && (
					<div className="flex-shrink-0 p-2 sm:p-3 h-[160px] border-t border-gray-700/30 mt-auto">
						{renderDetail(sortedParticipants)}
					</div>
				)}
			</div>
		</div>
	);
}

interface DefaultParticipantRowProps {
	participant: LeaderboardParticipant;
	index: number;
	maxScore: number;
	formatScore: (score: number) => string;
	scoreUnit: string;
}

function DefaultParticipantRow({
	participant,
	index,
	maxScore,
	formatScore,
	scoreUnit
}: DefaultParticipantRowProps) {
	// Calculate percentage for visual bar
	const scorePercentage = maxScore > 0 ? (participant.score / maxScore) * 100 : 0;

	// Different styling for top 3
	const gradientColor = index === 0
		? "from-blue-600/20 to-purple-600/10"
		: index === 1
			? "from-cyan-600/20 to-blue-600/10"
			: index === 2
				? "from-indigo-600/20 to-blue-600/10"
				: "from-gray-700/20 to-gray-800/10";

	return (
		<motion.div
			key={participant.id}
			className="flex items-center gap-2 sm:gap-3 bg-gray-900/40 rounded-lg p-1.5 sm:p-2 border border-gray-800 relative overflow-hidden"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: index * 0.05 }}
		>
			{/* Background progress bar */}
			<div
				className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${gradientColor} z-0`}
				style={{ width: `${scorePercentage}%` }}
			/>

			{/* Position indicator */}
			<div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${index === 0 ? 'bg-blue-600/30 text-blue-300' :
				index === 1 ? 'bg-cyan-600/30 text-cyan-300' :
					index === 2 ? 'bg-indigo-600/30 text-indigo-300' :
						'bg-gray-800 text-gray-300'
				} text-[10px] sm:text-xs font-bold z-10 shadow-md`}>
				{index + 1}
			</div>

			<div className="relative">
				<ProfilePicture
					name={participant.name}
					imageUrl={participant.imagePath}
					size="sm"
					className="z-10 shadow-md"
				/>
				{index === 0 && (
					<motion.div
						className="absolute -inset-0.5 rounded-full blur-sm -z-10 bg-blue-500/20"
						animate={{
							opacity: [0.4, 0.7, 0.4],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					/>
				)}
			</div>

			<div className="flex-1 font-medium text-xs sm:text-sm z-10 truncate">{participant.name}</div>

			<div className="flex items-center">
				{index === 0 && (
					<div className="mr-1 sm:mr-2 px-1.5 sm:px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] sm:text-xs border border-yellow-500/20 flex items-center">
						<TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
						<span>Top</span>
					</div>
				)}
				<div className="bg-blue-500/10 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs border border-blue-500/20 z-10 whitespace-nowrap">
					{formatScore(participant.score)}{scoreUnit ? ` ${scoreUnit}` : ''}
				</div>
			</div>
		</motion.div>
	);
} 