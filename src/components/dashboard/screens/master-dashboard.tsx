import { AnimatePresence, motion } from 'framer-motion';
import {
	Award,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Dumbbell,
	Github,
	Home,
	Megaphone,
	Pause,
	Play,
	Trash2,
	Trophy,
	Users,
	UtensilsCrossed
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import data utilities
import {
	getAllHouseStats,
	getAllResidents,
	getCommitStats,
	getLatestAnnouncements,
	getResidentById,
	getTodaysChores,
	getUpcomingEvents,
	getWorkoutStats
} from '@/lib/data/data-utils';

// Import components
import { ProfilePicture } from '@/components/ui/profile-picture';
import { ResidentProfile } from '../cards/resident-profile';

// Import our new leaderboard components
import { GitHubLeaderboard } from '../leaderboards/GithubLeaderboard';
import { WorkoutLeaderboard } from '../leaderboards/WorkoutLeaderboard';
import { HouseStatsCarousel } from '../visualizations/HouseStatsCarousel';

// Function to get all image paths from public/images folder
function getImagePaths() {
	// Since this is server-side rendering, we can use relative paths from the public directory
	// Create image objects similar to the original residentMemories
	const imageFiles = [
		'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg',
		'image7.jpg', 'image8.jpg', 'image9.jpg', 'image10.jpg', 'image11.jpg',
		'image12.jpg', 'image13.jpg', 'image14.jpg', 'image16.jpg', 'image17.jpg'
	];

	return imageFiles.map((filename, index) => ({
		src: `/images/${filename}`,
		alt: `House photo ${index + 1}`,
		caption: `Accelr8 House - ${index + 1}`,
		featured: index % 3 === 0 // Every third image is featured
	}));
}

// Get all image paths
const houseImages = getImagePaths();

// Cycling content timing (in ms)
const CYCLE_TIMING = {
	PHOTOS: 8000,
	ANNOUNCEMENTS: 15000,
	RESIDENTS: 25000,
	LEADERBOARDS: 20000,
	HOUSE_TASKS: 12000, // Added for chores/dinner rotation
	COMPETITIVE_STATS: 15000
};

export function MasterDashboard() {
	// Fetch data
	const houseStats = getAllHouseStats();
	const residents = getAllResidents();
	const workoutStats = getWorkoutStats(30); // Update to use 30 days of data
	const commitStats = getCommitStats(30); // Update to use 30 days of data
	const chores = getTodaysChores();
	const announcements = getLatestAnnouncements(3);
	const events = getUpcomingEvents(3);

	// For time display
	const [currentTime, setCurrentTime] = useState(new Date());

	// Auto-cycling state
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
	const [currentResident, setCurrentResident] = useState(0);
	const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
	const [leaderboardType, setLeaderboardType] = useState<'workout' | 'github'>('workout');
	const [isPauseLeaderboard, setIsPauseLeaderboard] = useState(false);
	const [isPauseHouseStats, setIsPauseHouseStats] = useState(false);
	const [houseTaskView, setHouseTaskView] = useState<'chores' | 'dinner'>('chores');
	const [isPauseHouseTasks, setIsPauseHouseTasks] = useState(false);

	// Update time every minute
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);

		return () => clearInterval(timer);
	}, []);

	// Auto cycle photos
	useEffect(() => {
		const photoInterval = setInterval(() => {
			setCurrentPhotoIndex(prev => (prev + 1) % houseImages.length);
		}, CYCLE_TIMING.PHOTOS);

		return () => clearInterval(photoInterval);
	}, []);

	// Auto cycle residents (showing 1 at a time)
	useEffect(() => {
		const residentInterval = setInterval(() => {
			setCurrentResident(prev => (prev + 1) % residents.length);
		}, CYCLE_TIMING.RESIDENTS);

		return () => clearInterval(residentInterval);
	}, []);

	// Auto cycle announcements
	useEffect(() => {
		if (announcements.length <= 1) return;

		const announcementInterval = setInterval(() => {
			setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
		}, CYCLE_TIMING.ANNOUNCEMENTS);

		return () => clearInterval(announcementInterval);
	}, [announcements.length]);

	// Auto cycle between leaderboard types
	useEffect(() => {
		if (isPauseLeaderboard) return;

		const leaderboardInterval = setInterval(() => {
			setLeaderboardType(prev => prev === 'workout' ? 'github' : 'workout');
		}, CYCLE_TIMING.LEADERBOARDS);

		return () => clearInterval(leaderboardInterval);
	}, [isPauseLeaderboard]);

	// Auto cycle between chores and dinner views
	useEffect(() => {
		if (isPauseHouseTasks) return;

		const houseTasksInterval = setInterval(() => {
			setHouseTaskView(prev => prev === 'chores' ? 'dinner' : 'chores');
		}, CYCLE_TIMING.HOUSE_TASKS);

		return () => clearInterval(houseTasksInterval);
	}, [isPauseHouseTasks]);

	// Get icon for house stats
	function getIconForStat(statName: string) {
		switch (statName.toLowerCase()) {
			case 'meals shared':
				return <UtensilsCrossed className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
			case 'events hosted':
				return <Calendar className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
			case 'house improvements':
				return <Home className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
			case 'community meetings':
				return <Users className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
			case 'total house chores':
				return <Trash2 className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
			default:
				return <Trophy className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />;
		}
	}

	return (
		<div className="flex flex-col h-screen w-screen max-h-screen overflow-hidden bg-black text-white">
			{/* Gradient Overlay for Background */}
			<div className="absolute inset-0 bg-gradient-to-tl from-blue-950 via-gray-900 to-purple-950 opacity-95 z-0"></div>

			{/* Grain Texture Overlay */}
			<div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 z-0 mix-blend-soft-light"></div>

			{/* Header with integrated Events */}
			<header className="relative z-10 flex items-center justify-between p-2 sm:p-3 border-b border-gray-800/70 bg-black/60 backdrop-blur-md">
				{/* Left side - Logo and title */}
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-md shadow-lg">
						<Home className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					</div>
					<div>
						<h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
							Accelr8 Housing
						</h1>
						<div className="text-gray-400 text-xs sm:text-sm">Smart Coliving Dashboard</div>
					</div>
				</div>

				{/* Middle - Events Calendar */}
				{/* <div className="flex-1 mx-4 sm:mx-8 max-w-[500px]">
					<div className="bg-gray-800/30 backdrop-blur-sm rounded-lg px-2 py-1 sm:py-1.5 border border-gray-700/20 flex items-center">
						<div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-3 flex-shrink-0">
							<Calendar className="text-blue-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<h3 className="font-semibold text-white text-xs hidden sm:block">Events</h3>
						</div>

						<div className="flex-1 relative overflow-hidden h-6 max-w-[200px] sm:h-7">
							<EventsCalendar
								events={events.slice(0, 3)}
								className="h-full"
								compact={true}
								autoCycle={true}
								cycleDuration={10000}
							/>
						</div>

						<div className="flex items-center gap-1 ml-2 sm:ml-3 flex-shrink-0">
							<button
								onClick={() => {
									const eventsComponent = document.querySelector('[data-component="events"]');
									if (eventsComponent) {
										const prevButton = eventsComponent.querySelector('[data-action="prev"]');
										if (prevButton) (prevButton as HTMLButtonElement).click();
									}
								}}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700/70"
							>
								<ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
							</button>
							<button
								onClick={() => {
									const eventsComponent = document.querySelector('[data-component="events"]');
									if (eventsComponent) {
										const nextButton = eventsComponent.querySelector('[data-action="next"]');
										if (nextButton) (nextButton as HTMLButtonElement).click();
									}
								}}
								className="w-5 h-5 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-300 hover:bg-gray-700/70"
							>
								<ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
							</button>
						</div>
					</div>
				</div> */}

				{/* Right side - Notification and Clock */}
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="relative">
						<button className="relative bg-gray-900/70 hover:bg-gray-800/80 rounded-full p-1.5 text-gray-300 hover:text-white transition-colors">
							<Megaphone className="h-5 w-5" />
							<span className="absolute top-0 right-0 w-2.5 h-2.5 bg-purple-500 border border-gray-900 rounded-full"></span>
						</button>
					</div>
					{/* Time and Date Display */}
					<div className="flex gap-1.5 items-center bg-gray-900/50 px-2 py-1 rounded-md border border-gray-800/50">
						<div className="text-xs text-gray-300">
							{formatTime(currentTime)}
						</div>
						<div className="h-1.5 w-1.5 rounded-full bg-purple-500/40"></div>
						<div className="text-xs text-gray-300">
							{formatDate(currentTime, 'weekday')}
						</div>
					</div>
				</div>
			</header>

			{/* Main Dashboard Grid with improved spacing */}
			<main className="relative z-10 flex-1 overflow-hidden p-2 sm:p-3 grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 bg-gray-950/30">
				{/* Left Column - Administrative Hub with more vertical space */}
				<div className="md:col-span-4 flex flex-col">
					{/* Administrative Hub - Grouped admin components with improved spacing */}
					<div className="flex-1 overflow-hidden h-full">


						{/* Container for all administrative components with auto overflow */}
						<div className="flex flex-col space-y-2 sm:space-y-3 h-[calc(100%-2.5rem)] overflow-auto pb-1">
							{/* Combined House Chores & Dinner Section with rotation */}
							<div className="rounded-lg backdrop-blur-sm flex flex-col min-h-[180px] sm:min-h-[200px] flex-shrink-0 overflow-hidden border border-gray-700/50">
								<AnimatePresence mode="wait" initial={false}>
									{houseTaskView === 'chores' ? (
										<motion.div
											key="chores"
											className="flex flex-col h-full bg-gray-900/80 border-gray-700/50"
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-700/50 bg-gray-900/90">
												<div className="flex items-center gap-1.5 sm:gap-2">
													<div className="bg-purple-500/20 rounded-full p-1 sm:p-1.5">
														<Trash2 className="text-purple-400 h-3.5 w-3.5 sm:h-5 sm:w-5" />
													</div>
													<h3 className="font-bold text-white text-sm sm:text-lg">Today's House Chores</h3>
												</div>


											</div>

											<div className="space-y-2 overflow-y-auto flex-1 p-2 sm:p-3 pr-3">
												{chores
													.filter(chore => !chore.name.includes('Cooking'))
													.map((chore) => {
														// Get the resident assigned to this chore
														const resident = getResidentById(chore.assignedTo);

														return (
															<div
																key={chore.id}
																className="p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 shadow-sm flex items-center gap-2"
															>
																<div className="relative flex-shrink-0">
																	<ProfilePicture
																		name={resident?.name || 'Unknown'}
																		imageUrl={resident?.imagePath}
																		size="md"
																		className={chore.completed ? "opacity-70" : ""}
																	/>

																</div>
																<div className="flex-1 min-w-0">
																	<div className={`text-sm font-medium text-white`}>
																		{chore.name}
																	</div>
																	<div className="text-xs text-gray-400">{resident?.name || 'Unassigned'}</div>
																</div>
															</div>
														);
													})}
											</div>
										</motion.div>
									) : (
										<motion.div
											key="dinner"
											className="flex flex-col h-full bg-gray-900/80 border-gray-700/50"
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ duration: 0.3 }}
										>
											{/* Dinner header with integrated menu info */}
											<div className="relative py-2 sm:py-3 px-3 sm:px-4 border-b border-gray-700/50 bg-gray-900/90 flex-shrink-0">
												<div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-500/5 rounded-full -mt-10 sm:-mt-16 -mr-10 sm:-mr-16 backdrop-blur-md"></div>
												<div className="relative z-10 flex items-center justify-between">
													<div className="flex items-center gap-1.5 sm:gap-2">
														<div className="bg-blue-500/20 p-1.5 sm:p-2 rounded-lg shadow-inner border border-blue-500/20">
															<UtensilsCrossed className="text-blue-400 h-3.5 w-3.5 sm:h-5 sm:w-5" />
														</div>
														<div>
															<h3 className="font-bold text-white text-sm sm:text-lg">Tonight's House Dinner</h3>
															<div className="text-blue-300 text-[10px] sm:text-sm flex items-center gap-1.5">
																<span>Homemade Pizza with Garden Salad</span>
																<div className="h-2 w-2 rounded-full bg-blue-400/50"></div>
																<span>7:30 PM</span>
															</div>
														</div>
													</div>

													<div className="flex items-center gap-2">
														<div className="px-2 py-1 bg-gray-800 rounded-lg border border-gray-700/50 text-gray-300 text-[10px] flex items-center">
															<span>8 attending</span>
														</div>
													</div>
												</div>
											</div>

											{/* Cooking team section - more compact */}
											<div className="flex-1 p-2 sm:p-3">
												<div className="grid grid-cols-3 gap-2 sm:gap-3 overflow-y-auto">
													{chores
														.filter(chore => chore.name.includes('Cooking'))
														.map((chore) => {
															// Get the resident assigned to this chore
															const resident = getResidentById(chore.assignedTo);

															return (
																<div
																	key={chore.id}
																	className="flex flex-col items-center p-1.5 sm:p-2.5 bg-gray-800/90 rounded-lg border border-gray-700/40"
																>
																	<ProfilePicture
																		name={resident?.name || 'Unknown'}
																		imageUrl={resident?.imagePath}
																		size="lg"
																	/>
																	<div className="text-xs text-base">{resident?.name || 'Unassigned'}</div>

																</div>
															);
														})}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Resident Spotlight - Improved sizing and spacing */}
							<div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-gray-800/50 shadow-lg h-full max-h-full flex flex-col overflow-hidden">
								<div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Users className="text-purple-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
										<h2 className="text-base sm:text-lg font-semibold text-white">
											Resident Spotlight
										</h2>
									</div>

									<div className="flex items-center gap-1.5 sm:gap-2">
										<button
											onClick={() => setCurrentResident(prev => (prev - 1 + residents.length) % residents.length)}
											className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700/90 hover:text-purple-200"
										>
											<ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
										<div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs border border-gray-800/50">
											<span className="text-blue-400 font-medium">{currentResident + 1}</span>
											<span className="text-gray-400"> of </span>
											<span className="text-purple-400 font-medium">{residents.length}</span>
										</div>
										<button
											onClick={() => setCurrentResident(prev => (prev + 1) % residents.length)}
											className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700/90 hover:text-purple-200"
										>
											<ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
									</div>
								</div>

								<div className="flex-1 overflow-hidden">
									<AnimatePresence mode="wait">
										<motion.div
											key={residents[currentResident].id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.3 }}
											className="h-full"
										>
											<ResidentProfile
												resident={residents[currentResident]}
												className="h-full"
											/>
										</motion.div>
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Center and Right Content - Featured Photo and Competitive Stats */}
				<div className="md:col-span-8 flex flex-col gap-1 sm:gap-2">
					{/* Grid layout with Photo on left, House Stats below, and Competitive Stats taking full height on right */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 h-full">
						{/* Left Column - Photo and House Stats */}
						<div className="flex flex-col gap-2 sm:gap-3">
							{/* Featured Photo */}
							<div className="relative rounded-xl overflow-hidden shadow-xl h-[45%]">
								<AnimatePresence mode="wait">
									<motion.img
										key={currentPhotoIndex}
										src={houseImages[currentPhotoIndex].src}
										alt={houseImages[currentPhotoIndex].alt}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 1 }}
										className="w-full h-full object-cover absolute inset-0"
									/>
								</AnimatePresence>

								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 sm:px-4 sm:py-3">
									<div className="text-white text-xs sm:text-sm font-medium">
										{houseImages[currentPhotoIndex].caption}
									</div>
								</div>
							</div>

							{/* House Stats */}
							<div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-gray-800/50 shadow-lg flex flex-col overflow-hidden flex-1">
								<div className="flex items-center mb-2 sm:mb-3 flex-shrink-0 justify-between">
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Trophy className="text-purple-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
										<h2 className="text-base sm:text-lg font-semibold text-white">
											House Stats
										</h2>
									</div>
									<button
										className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-purple-300 transition-colors"
										onClick={() => setIsPauseHouseStats(!isPauseHouseStats)}
										title={isPauseHouseStats ? "Resume auto-cycling" : "Pause auto-cycling"}
									>
										{isPauseHouseStats ? (
											<Play className="w-3 h-3" />
										) : (
											<Pause className="w-3 h-3" />
										)}
									</button>
								</div>

								<div className="flex-1 relative overflow-hidden">
									<HouseStatsCarousel
										stats={houseStats}
										autoRotate={!isPauseHouseStats}
										rotationInterval={CYCLE_TIMING.COMPETITIVE_STATS}
									/>
								</div>
							</div>
						</div>

						{/* Right Column - Full-height Competitive Stats */}
						<div className="bg-gray-900/70 backdrop-blur-md rounded-xl flex flex-col h-full border border-gray-800/50 shadow-xl overflow-hidden">
							<div className="p-2 sm:p-3 border-b border-gray-800/50 bg-gray-900/80 flex items-center justify-between">
								<div className="flex items-center gap-1.5 sm:gap-2">
									<Award className="text-purple-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
									<h2 className="font-semibold text-white text-sm sm:text-base">Competitive Stats</h2>
								</div>

								<div className="flex items-center space-x-1 sm:space-x-2">
									<button
										className={`py-1 px-1.5 sm:px-2 rounded-md text-xs sm:text-sm flex items-center gap-1 ${leaderboardType === 'workout'
											? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
											: 'bg-gray-800 text-gray-400 hover:bg-gray-800/80 hover:text-purple-300'
											}`}
										onClick={() => {
											setLeaderboardType('workout');
											setIsPauseLeaderboard(true);
										}}
										title="Show Workout Stats"
									>
										<Dumbbell className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Fitness
									</button>

									<button
										className={`py-1 px-1.5 sm:px-2 rounded-md text-xs sm:text-sm flex items-center gap-1 ${leaderboardType === 'github'
											? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
											: 'bg-gray-800 text-gray-400 hover:bg-gray-800/80 hover:text-blue-300'
											}`}
										onClick={() => {
											setLeaderboardType('github');
											setIsPauseLeaderboard(true);
										}}
										title="Show GitHub Stats"
									>
										<Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> GitHub
									</button>

									<button
										className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
										onClick={() => setIsPauseLeaderboard(!isPauseLeaderboard)}
										title={isPauseLeaderboard ? "Resume auto-cycling" : "Pause auto-cycling"}
									>
										{isPauseLeaderboard ? (
											<Play className="w-3 h-3" />
										) : (
											<Pause className="w-3 h-3" />
										)}
									</button>
								</div>
							</div>

							<div className="flex-1 relative overflow-hidden">
								<AnimatePresence mode="wait" initial={false}>
									{leaderboardType === 'workout' ? (
										<motion.div
											key="workout"
											className="absolute inset-0"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.3 }}
										>
											{/* Workout Stats View */}
											<WorkoutLeaderboard residentStats={workoutStats} className="h-full" />
										</motion.div>
									) : (
										<motion.div
											key="github"
											className="absolute inset-0"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.3 }}
										>
											{/* GitHub Stats View */}
											<GitHubLeaderboard residentStats={commitStats} className="h-full" />
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

// Clock component for the header
function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formattedTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	}).format(time);

	const formattedDate = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	}).format(time);

	return (
		<div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-700/30">
			<div className="text-base sm:text-lg font-bold text-white">{formattedTime}</div>
			<div className="text-[10px] sm:text-xs text-gray-300">{formattedDate}</div>
		</div>
	);
}

// Helper functions
function formatTime(date: Date): string {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function formatDate(date: Date, format?: 'weekday' | 'full' | 'short'): string {
	const options: Intl.DateTimeFormatOptions = {};

	if (format === 'weekday') {
		options.weekday = 'long';
	} else if (format === 'full') {
		options.weekday = 'long';
		options.year = 'numeric';
		options.month = 'long';
		options.day = 'numeric';
	} else {
		options.month = 'short';
		options.day = 'numeric';
	}

	return new Intl.DateTimeFormat('en-US', options).format(date);
} 