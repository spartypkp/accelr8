'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Code,
	ExternalLink,
	Github,
	Link as LinkIcon,
	Mail,
	MessageSquare,
	Plus,
	Search,
	Twitter,
	Users
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for community residents
const mockResidents = [
	{
		id: 1,
		name: "Alex Chen",
		role: "Software Engineer",
		company: "TechStart.io",
		bio: "Full-stack developer building developer tools and productivity apps.",
		avatar: "/placeholder-user.jpg",
		joinDate: "May 2023",
		room: "204",
		interests: ["AI", "Developer Tools", "React"],
		social: {
			twitter: "alexchen",
			github: "alexc",
			website: "alexchen.dev"
		}
	},
	{
		id: 2,
		name: "Maya Johnson",
		role: "Product Designer",
		company: "DesignLabs",
		bio: "Creating intuitive user experiences and interfaces for fintech products.",
		avatar: "/placeholder-user.jpg",
		joinDate: "March 2023",
		room: "108",
		interests: ["UX Design", "Design Systems", "Figma"],
		social: {
			twitter: "mayajohnson",
			github: "mayaj",
			website: "maya.design"
		}
	},
	{
		id: 3,
		name: "Jamie Smith",
		role: "Founder & CEO",
		company: "DataSync",
		bio: "Building a startup that helps companies synchronize their customer data across platforms.",
		avatar: "/placeholder-user.jpg",
		joinDate: "January 2023",
		room: "302",
		interests: ["B2B SaaS", "Data Integration", "Startups"],
		social: {
			twitter: "jamiesmith",
			github: "jamies",
			website: "datasync.io"
		}
	},
	{
		id: 4,
		name: "Taylor Wong",
		role: "ML Engineer",
		company: "AILabs",
		bio: "Working on machine learning models to improve content recommendation systems.",
		avatar: "/placeholder-user.jpg",
		joinDate: "April 2023",
		room: "210",
		interests: ["Machine Learning", "Python", "Recommendation Systems"],
		social: {
			twitter: "taylorwong",
			github: "twong",
			website: "taylorwong.ai"
		}
	},
	{
		id: 5,
		name: "Jordan Lee",
		role: "Growth Marketer",
		company: "GrowthHacks",
		bio: "Helping startups scale their user acquisition and retention strategies.",
		avatar: "/placeholder-user.jpg",
		joinDate: "February 2023",
		room: "115",
		interests: ["Growth Marketing", "User Acquisition", "Analytics"],
		social: {
			twitter: "jordanlee",
			github: "",
			website: "jordanlee.co"
		}
	},
	{
		id: 6,
		name: "Sam Rodriguez",
		role: "Backend Engineer",
		company: "CloudScale",
		bio: "Specialized in building scalable backend systems and API infrastructure.",
		avatar: "/placeholder-user.jpg",
		joinDate: "June 2023",
		room: "217",
		interests: ["Go", "Microservices", "Cloud Infrastructure"],
		social: {
			twitter: "samrodriguez",
			github: "samr",
			website: ""
		}
	},
];

// Mock interest topics/channels
const mockInterestTopics = [
	{ name: "Founders", count: 18 },
	{ name: "Engineering", count: 24 },
	{ name: "Design", count: 12 },
	{ name: "Marketing", count: 9 },
	{ name: "AI/ML", count: 15 },
	{ name: "Blockchain", count: 7 },
	{ name: "Remote Work", count: 11 },
	{ name: "Fundraising", count: 14 },
	{ name: "Health Tech", count: 6 },
	{ name: "Climate Tech", count: 5 },
];

// Mock collaboration opportunities
const mockCollaborations = [
	{
		id: 1,
		title: "Looking for a frontend developer",
		description: "Need help building a React dashboard for my data analytics startup.",
		postedBy: "Jamie Smith",
		postedDate: "2 days ago",
		skills: ["React", "TypeScript", "Data Visualization"],
		type: "Project Collaboration"
	},
	{
		id: 2,
		title: "UX researcher needed for user testing",
		description: "Planning to run usability tests for my new app next week and could use help designing the test scenarios.",
		postedBy: "Maya Johnson",
		postedDate: "3 days ago",
		skills: ["UX Research", "User Testing", "Interview Design"],
		type: "Short-term Help"
	},
	{
		id: 3,
		title: "Co-founder search (technical)",
		description: "I'm building a SaaS platform for small e-commerce businesses and looking for a technical co-founder.",
		postedBy: "Jordan Lee",
		postedDate: "1 week ago",
		skills: ["Full-stack", "SaaS Experience", "E-commerce"],
		type: "Co-founder Search"
	},
];

export default function CommunityPage() {
	const params = useParams();
	const houseId = params?.houseId as string;

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Community</h1>
						<p className="text-gray-500 dark:text-gray-400">{houseName}</p>
					</div>

					<div className="flex items-center space-x-2 mt-4 md:mt-0">
						<Button variant="outline" size="sm" asChild>
							<Link href={`/dashboard/${houseId}/community/projects`}>
								<Code className="h-4 w-4 mr-2" />
								View Projects
							</Link>
						</Button>
						<Button size="sm">
							<MessageSquare className="h-4 w-4 mr-2" />
							Message Board
						</Button>
					</div>
				</div>

				<Tabs defaultValue="residents" className="space-y-6">
					<TabsList className="bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="residents">Residents</TabsTrigger>
						<TabsTrigger value="topics">Topics & Channels</TabsTrigger>
						<TabsTrigger value="collaborate">Collaborate</TabsTrigger>
					</TabsList>

					{/* Residents Tab */}
					<TabsContent value="residents">
						<div className="mb-6">
							<div className="relative w-full max-w-md">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
								<Input
									placeholder="Search residents by name, skills, or interests..."
									className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{mockResidents.map((resident) => (
								<Card key={resident.id} className="overflow-hidden bg-white dark:bg-gray-900">
									<CardHeader className="pb-0">
										<div className="flex items-start justify-between">
											<div className="flex items-center">
												<Avatar className="h-12 w-12 mr-3">
													<AvatarImage src={resident.avatar} />
													<AvatarFallback>{resident.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className="text-lg">{resident.name}</CardTitle>
													<CardDescription className="text-sm">
														{resident.role} at {resident.company}
													</CardDescription>
												</div>
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												Room {resident.room}
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm text-gray-600 dark:text-gray-300">{resident.bio}</p>

										<div>
											<h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Interests</h4>
											<div className="flex flex-wrap gap-2">
												{resident.interests.map((interest, idx) => (
													<Badge key={idx} variant="outline">
														{interest}
													</Badge>
												))}
											</div>
										</div>

										<div className="flex pt-2 border-t border-gray-100 dark:border-gray-800">
											<div className="flex space-x-3">
												{resident.social.github && (
													<Link href={`https://github.com/${resident.social.github}`} target="_blank" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
														<Github className="h-4 w-4" />
													</Link>
												)}
												{resident.social.twitter && (
													<Link href={`https://twitter.com/${resident.social.twitter}`} target="_blank" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
														<Twitter className="h-4 w-4" />
													</Link>
												)}
												{resident.social.website && (
													<Link href={`https://${resident.social.website}`} target="_blank" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
														<ExternalLink className="h-4 w-4" />
													</Link>
												)}
											</div>
											<div className="ml-auto">
												<Button variant="ghost" size="sm">
													<Mail className="h-4 w-4 mr-2" />
													Message
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Topics & Channels Tab */}
					<TabsContent value="topics">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="md:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle>Discussion Topics</CardTitle>
										<CardDescription>Connect with residents with similar interests</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{mockInterestTopics.map((topic, idx) => (
												<Button key={idx} variant="outline" className="justify-between h-auto py-3" asChild>
													<Link href={`/dashboard/${houseId}/community/topics/${topic.name.toLowerCase()}`}>
														<div className="flex items-center">
															<div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
																<Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
															</div>
															<span className="font-medium">{topic.name}</span>
														</div>
														<Badge variant="secondary">{topic.count}</Badge>
													</Link>
												</Button>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Channels</CardTitle>
										<CardDescription>Community discussion channels</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<Button variant="outline" className="w-full justify-start" asChild>
												<Link href={`/dashboard/${houseId}/community/channels/general`}>
													<MessageSquare className="h-4 w-4 mr-2" />
													#general
												</Link>
											</Button>
											<Button variant="outline" className="w-full justify-start" asChild>
												<Link href={`/dashboard/${houseId}/community/channels/events`}>
													<MessageSquare className="h-4 w-4 mr-2" />
													#events
												</Link>
											</Button>
											<Button variant="outline" className="w-full justify-start" asChild>
												<Link href={`/dashboard/${houseId}/community/channels/tech-help`}>
													<MessageSquare className="h-4 w-4 mr-2" />
													#tech-help
												</Link>
											</Button>
											<Button variant="outline" className="w-full justify-start" asChild>
												<Link href={`/dashboard/${houseId}/community/channels/random`}>
													<MessageSquare className="h-4 w-4 mr-2" />
													#random
												</Link>
											</Button>
											<Button variant="outline" className="w-full justify-start" asChild>
												<Link href={`/dashboard/${houseId}/community/channels/jobs`}>
													<MessageSquare className="h-4 w-4 mr-2" />
													#jobs
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Create New Channel</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Want to start a discussion on a new topic? Create a new channel for the house.
											</p>
											<Button className="w-full">
												<LinkIcon className="h-4 w-4 mr-2" />
												Create Channel
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Collaborate Tab */}
					<TabsContent value="collaborate">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="md:col-span-2">
								<Card>
									<CardHeader>
										<div className="flex justify-between items-center">
											<div>
												<CardTitle>Collaboration Opportunities</CardTitle>
												<CardDescription>Find people to work with on projects</CardDescription>
											</div>
											<Button>
												<Plus className="h-4 w-4 mr-2" />
												Post Opportunity
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{mockCollaborations.map((collab) => (
												<Card key={collab.id} className="overflow-hidden">
													<CardHeader className="pb-2">
														<div className="flex justify-between">
															<CardTitle className="text-lg">{collab.title}</CardTitle>
															<Badge>{collab.type}</Badge>
														</div>
													</CardHeader>
													<CardContent className="space-y-4">
														<p className="text-sm text-gray-600 dark:text-gray-300">{collab.description}</p>

														<div className="flex flex-wrap gap-2">
															{collab.skills.map((skill, idx) => (
																<Badge key={idx} variant="outline">
																	{skill}
																</Badge>
															))}
														</div>

														<div className="flex justify-between items-center pt-2 text-sm">
															<span className="text-gray-500 dark:text-gray-400">
																Posted by {collab.postedBy} · {collab.postedDate}
															</span>
															<Button size="sm">
																Contact
															</Button>
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Skill Directory</CardTitle>
										<CardDescription>Find residents by skills</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<Button variant="outline" className="w-full justify-between">
												React
												<Badge variant="secondary">8</Badge>
											</Button>
											<Button variant="outline" className="w-full justify-between">
												Python
												<Badge variant="secondary">6</Badge>
											</Button>
											<Button variant="outline" className="w-full justify-between">
												UX Design
												<Badge variant="secondary">5</Badge>
											</Button>
											<Button variant="outline" className="w-full justify-between">
												Machine Learning
												<Badge variant="secondary">4</Badge>
											</Button>
											<Button variant="outline" className="w-full justify-between">
												Growth Marketing
												<Badge variant="secondary">4</Badge>
											</Button>
											<Button variant="outline" className="w-full justify-start">
												<Search className="h-4 w-4 mr-2" />
												View All Skills
											</Button>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>My Skills & Interests</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Update your skills to help others find you for collaboration.
											</p>
											<Button className="w-full">
												Update Profile
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
} 