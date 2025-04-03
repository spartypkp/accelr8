import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowRight,
	BookOpen,
	Clock,
	Filter,
	Search,
	Tag,
	User,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Blog & Resources | Accelr8",
	description: "Insights, stories, and resources for founders and innovators in the Accelr8 community.",
};

// Mock data for blog posts
const featuredPosts = [
	{
		id: 1,
		title: "From Idea to $1M Seed: An Accelr8 Success Story",
		excerpt: "How living in an Accelr8 house helped this founder connect with their co-founder, develop their MVP, and secure their first round of funding.",
		category: "Success Stories",
		author: "Jane Rodriguez",
		authorTitle: "Founder & CEO, DataSync",
		date: "June 2, 2023",
		readTime: "8 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Fundraising", "Networking", "Success Story"],
	},
	{
		id: 2,
		title: "The Ultimate Guide to Finding a Technical Co-Founder",
		excerpt: "Practical strategies for non-technical founders to find, evaluate, and partner with the right technical co-founder for their startup.",
		category: "Founder Resources",
		author: "Michael Chen",
		authorTitle: "Accelr8 Community Lead",
		date: "May 28, 2023",
		readTime: "12 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Co-Founders", "Team Building", "Startup Advice"],
	},
	{
		id: 3,
		title: "5 Ways Living in a Hacker House Accelerated My Startup",
		excerpt: "A first-hand account of how the environment, community, and resources at Accelr8 contributed to faster growth and better outcomes.",
		category: "Community",
		author: "Sarah Johnson",
		authorTitle: "Founder, HealthTech Innovations",
		date: "May 15, 2023",
		readTime: "6 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Community", "Productivity", "Networking"],
	},
];

const recentPosts = [
	{
		id: 4,
		title: "Navigating Your First VC Meeting: Do's and Don'ts",
		excerpt: "Preparing for your first meeting with venture capitalists? Learn what to focus on and what to avoid from founders who've been there.",
		category: "Fundraising",
		author: "David Park",
		authorTitle: "Partner at Acme Ventures",
		date: "June 8, 2023",
		readTime: "10 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Fundraising", "Pitch", "VC"],
	},
	{
		id: 5,
		title: "Building in Public: Why Transparency Helps Startups",
		excerpt: "Exploring the benefits and strategies of sharing your startup journey openly with your audience and potential customers.",
		category: "Growth",
		author: "Lisa Chen",
		authorTitle: "Growth Lead, BuildPublic",
		date: "June 5, 2023",
		readTime: "7 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Marketing", "Community Building", "Transparency"],
	},
	{
		id: 6,
		title: "Life at Accelr8: A Day in the SF House",
		excerpt: "Take a peek into the daily routines, work habits, and community events that make up a typical day at our San Francisco location.",
		category: "Community",
		author: "Accelr8 Team",
		authorTitle: "San Francisco House",
		date: "June 1, 2023",
		readTime: "5 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Community", "Lifestyle", "San Francisco"],
	},
	{
		id: 7,
		title: "Legal Essentials for Early-Stage Startups",
		excerpt: "A comprehensive guide to the key legal considerations every founder should understand when starting their company.",
		category: "Resources",
		author: "Amanda Torres",
		authorTitle: "Startup Counsel, LegalEdge",
		date: "May 25, 2023",
		readTime: "14 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Legal", "Incorporation", "Startup Basics"],
	},
	{
		id: 8,
		title: "How We Built Our MVP in Just 4 Weeks",
		excerpt: "The strategies, tools, and work methods that helped this founder team build and launch their minimum viable product in record time.",
		category: "Product Development",
		author: "Jason Kim",
		authorTitle: "CTO, QuickLaunch",
		date: "May 22, 2023",
		readTime: "9 min read",
		image: "/placeholder-blog.jpg",
		tags: ["MVP", "Product Development", "Engineering"],
	},
	{
		id: 9,
		title: "From Solo Founder to Dream Team: Building Your First Startup Team",
		excerpt: "Advice on when and how to make your first hires, what roles to prioritize, and how to attract top talent on a startup budget.",
		category: "Team Building",
		author: "Rachel Nguyen",
		authorTitle: "Founder & CEO, TeamSync",
		date: "May 18, 2023",
		readTime: "11 min read",
		image: "/placeholder-blog.jpg",
		tags: ["Hiring", "Team Building", "Leadership"],
	},
];

// Categories
const categories = [
	"All Categories",
	"Success Stories",
	"Founder Resources",
	"Community",
	"Fundraising",
	"Growth",
	"Product Development",
	"Team Building",
];

export default function BlogPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Founder <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Insights</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Stories, advice, and resources from the Accelr8 community
							and startup ecosystem.
						</p>
					</div>
				</div>
			</section>

			{/* Blog Content */}
			<section className="py-16 bg-gray-950">
				<div className="container mx-auto px-4">
					{/* Search and Filter */}
					<div className="mb-12 p-4 bg-gray-900 rounded-lg border border-gray-800">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
									<Input
										placeholder="Search articles..."
										className="pl-10 bg-gray-800 border-gray-700"
									/>
								</div>
							</div>
							<div className="flex gap-4">
								<Select defaultValue="all">
									<SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category, index) => (
											<SelectItem key={index} value={index === 0 ? "all" : category.toLowerCase().replace(" ", "-")}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon" className="bg-gray-800 border-gray-700">
									<Filter className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Featured Posts */}
					<div className="mb-16">
						<h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{featuredPosts.map((post) => (
								<Card key={post.id} className="bg-gray-900 border-gray-800 hover:border-blue-600 transition-colors overflow-hidden">
									<div className="h-48 bg-gray-800 relative">
										{/* Placeholder for post image */}
										<div className="absolute inset-0 flex items-center justify-center">
											<BookOpen className="h-12 w-12 text-gray-700" />
										</div>
									</div>
									<CardHeader>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full">
												{post.category}
											</span>
										</div>
										<CardTitle className="text-xl">{post.title}</CardTitle>
										<CardDescription className="text-gray-400">{post.excerpt}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center space-x-4 text-sm text-gray-400">
											<div className="flex items-center">
												<User className="h-4 w-4 mr-2" />
												<span>{post.author}</span>
											</div>
											<div className="flex items-center">
												<Clock className="h-4 w-4 mr-2" />
												<span>{post.readTime}</span>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button asChild variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
											<Link href={`/blog/${post.id}`}>
												Read More
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>

					{/* All Posts */}
					<div>
						<div className="flex justify-between items-center mb-8">
							<h2 className="text-3xl font-bold">All Articles</h2>
							<Tabs defaultValue="recent" className="w-[300px]">
								<TabsList className="bg-gray-900 border border-gray-800">
									<TabsTrigger value="recent">Recent</TabsTrigger>
									<TabsTrigger value="popular">Popular</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{recentPosts.map((post) => (
								<Card key={post.id} className="bg-gray-900 border-gray-800 hover:border-purple-600 transition-colors overflow-hidden">
									<CardHeader>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded-full">
												{post.category}
											</span>
										</div>
										<CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
										<CardDescription className="text-gray-400 line-clamp-3">{post.excerpt}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between items-center text-sm text-gray-400 mb-2">
											<span>{post.date}</span>
											<span>{post.readTime}</span>
										</div>
										<div className="flex flex-wrap gap-2 mt-3">
											{post.tags.slice(0, 2).map((tag, index) => (
												<span key={index} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full flex items-center">
													<Tag className="h-3 w-3 mr-1" />
													{tag}
												</span>
											))}
											{post.tags.length > 2 && (
												<span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
													+{post.tags.length - 2} more
												</span>
											)}
										</div>
									</CardContent>
									<CardFooter>
										<Button asChild variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
											<Link href={`/blog/${post.id}`}>
												Read More
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>

						<div className="mt-12 text-center">
							<Button variant="outline" size="lg">
								Load More Articles
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Resources Section */}
			<section className="py-20 bg-gradient-to-b from-gray-950 to-blue-950">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Founder Resources</h2>
						<p className="text-gray-300">
							Curated tools, templates, and guides to help you build your startup faster and smarter.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: "Startup Legal Templates",
								description: "Essential legal documents including incorporation, founder agreements, and employee contracts.",
								icon: <BookOpen className="h-8 w-8 text-blue-400" />,
							},
							{
								title: "Pitch Deck Framework",
								description: "Proven pitch deck structure with examples from successful Accelr8 alumni companies.",
								icon: <BookOpen className="h-8 w-8 text-purple-400" />,
							},
							{
								title: "Fundraising Playbook",
								description: "Step-by-step guide to prepare for and execute a successful fundraising round.",
								icon: <BookOpen className="h-8 w-8 text-green-400" />,
							},
						].map((resource, index) => (
							<Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-600 transition-colors">
								<CardHeader>
									<div className="mb-4">{resource.icon}</div>
									<CardTitle>{resource.title}</CardTitle>
									<CardDescription className="text-gray-400">{resource.description}</CardDescription>
								</CardHeader>
								<CardFooter>
									<Button asChild variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
										<Link href="/resources">
											Access Resource
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>

					<div className="mt-12 text-center">
						<Button asChild size="lg">
							<Link href="/resources">
								View All Resources
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Newsletter */}
			<section className="py-20 bg-black">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
						<p className="text-gray-300 mb-8">
							Get the latest founder resources, community stories, and Accelr8 updates
							delivered directly to your inbox.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Input
								type="email"
								placeholder="Enter your email"
								className="bg-gray-800 border-gray-700 flex-grow"
							/>
							<Button>Subscribe</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 