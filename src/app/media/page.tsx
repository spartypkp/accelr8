import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
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
	Filter,
	Image as ImageIcon,
	Newspaper,
	Play,
	Search
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Media & Resources | Accelr8",
	description: "News, insights, stories, and resources for founders and innovators in the Accelr8 community.",
};

// Mock data for media content
const featuredMedia = [
	{
		id: 1,
		title: "Inside Accelr8: SF House Tour",
		type: "video",
		thumbnail: "/placeholder-media-1.jpg",
		category: "House Tour",
		date: "June 10, 2023",
		featured: true,
	},
	{
		id: 2,
		title: "Founder Spotlight: Jane Rodriguez",
		type: "image",
		thumbnail: "/placeholder-media-2.jpg",
		category: "Community",
		date: "June 5, 2023",
		featured: true,
	},
	{
		id: 3,
		title: "From Idea to $1M Seed Round",
		type: "article",
		thumbnail: "/placeholder-media-3.jpg",
		category: "Success Story",
		date: "May 28, 2023",
		featured: true,
	},
];

const mediaItems = [
	{
		id: 4,
		title: "Accelr8 AI Hackathon Winners",
		type: "image",
		thumbnail: "/placeholder-media-4.jpg",
		category: "Events",
		date: "June 15, 2023"
	},
	{
		id: 5,
		title: "Pitch Day Highlights",
		type: "video",
		thumbnail: "/placeholder-media-5.jpg",
		category: "Events",
		date: "June 12, 2023"
	},
	{
		id: 6,
		title: "Startup Founder Roundtable",
		type: "video",
		thumbnail: "/placeholder-media-6.jpg",
		category: "Community",
		date: "June 8, 2023"
	},
	{
		id: 7,
		title: "Accelr8 NYC House Announcement",
		type: "article",
		thumbnail: "/placeholder-media-7.jpg",
		category: "News",
		date: "June 7, 2023"
	},
	{
		id: 8,
		title: "Summer Rooftop Networking Event",
		type: "image",
		thumbnail: "/placeholder-media-8.jpg",
		category: "Events",
		date: "June 5, 2023"
	},
	{
		id: 9,
		title: "Tech Talk: Future of AI",
		type: "video",
		thumbnail: "/placeholder-media-9.jpg",
		category: "Events",
		date: "June 3, 2023"
	},
	{
		id: 10,
		title: "Founder Interview: Michael Chen",
		type: "video",
		thumbnail: "/placeholder-media-10.jpg",
		category: "Founders",
		date: "June 1, 2023"
	},
	{
		id: 11,
		title: "Accelr8 San Francisco Community Dinner",
		type: "image",
		thumbnail: "/placeholder-media-11.jpg",
		category: "Community",
		date: "May 30, 2023"
	},
	{
		id: 12,
		title: "How We Built Our MVP in 4 Weeks",
		type: "article",
		thumbnail: "/placeholder-media-12.jpg",
		category: "Founder Resources",
		date: "May 28, 2023"
	},
];

// Media types and categories
const mediaTypes = ["All Types", "Video", "Image", "Article"];
const categories = ["All Categories", "Events", "Community", "News", "Founders", "Success Story", "House Tour", "Founder Resources"];

export default function MediaPage() {
	const getMediaTypeIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'video':
				return <Play className="h-8 w-8 text-primary-foreground" />;
			case 'article':
				return <Newspaper className="h-8 w-8 text-primary-foreground" />;
			case 'image':
				return <ImageIcon className="h-8 w-8 text-primary-foreground" />;
			default:
				return null;
		}
	};

	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-background z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Accelr8 <span className="gradient-text">Media</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8">
							News, stories, advice, and resources from the Accelr8 community
							and startup ecosystem.
						</p>
					</div>
				</div>
			</section>

			{/* Media Content */}
			<section className="py-16 bg-card/30">
				<div className="container mx-auto px-4">
					{/* Search and Filter */}
					<div className="mb-12 p-4 bg-card rounded-lg border border-border">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										placeholder="Search media..."
										className="pl-10 bg-background border-border"
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-4">
								<Select defaultValue="all-types">
									<SelectTrigger className="w-[150px] bg-background border-border">
										<SelectValue placeholder="Media Type" />
									</SelectTrigger>
									<SelectContent>
										{mediaTypes.map((type, index) => (
											<SelectItem key={index} value={index === 0 ? "all-types" : type.toLowerCase()}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select defaultValue="all-categories">
									<SelectTrigger className="w-[180px] bg-background border-border">
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category, index) => (
											<SelectItem key={index} value={index === 0 ? "all-categories" : category.toLowerCase().replace(" ", "-")}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon" className="bg-background border-border">
									<Filter className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Featured Media */}
					<div className="mb-16">
						<h2 className="text-3xl font-bold mb-8 text-foreground">Featured Media</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{featuredMedia.map((item) => (
								<div key={item.id} className="group relative overflow-hidden rounded-xl aspect-video bg-card border border-border hover:border-primary transition-all duration-300">
									{/* Placeholder for media thumbnail */}
									<div className="absolute inset-0 bg-background">
										{/* Will be replaced with actual images */}
										<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/70 to-transparent">
											{getMediaTypeIcon(item.type)}
										</div>
									</div>

									{/* Overlay content */}
									<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 via-background/70 to-transparent">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
												{item.category}
											</span>
											{item.type === 'video' && (
												<span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded-full flex items-center">
													<Play className="h-3 w-3 mr-1" /> Video
												</span>
											)}
										</div>
										<h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
											{item.title}
										</h3>
										<p className="text-sm text-muted-foreground mt-1">{item.date}</p>
									</div>

									{/* View button appears on hover */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
										<Button asChild variant="outline" className="bg-background/50 border-border hover:bg-primary/20 hover:border-primary">
											<Link href={`/media/${item.id}`}>
												View {item.type === 'video' ? 'Video' : item.type === 'article' ? 'Article' : 'Gallery'}
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Media Gallery */}
					<div>
						<div className="flex justify-between items-center mb-8">
							<h2 className="text-3xl font-bold text-foreground">Media Gallery</h2>
							<Tabs defaultValue="recent" className="w-[300px]">
								<TabsList className="bg-card border border-border">
									<TabsTrigger value="recent">Recent</TabsTrigger>
									<TabsTrigger value="popular">Popular</TabsTrigger>
									<TabsTrigger value="videos">Videos</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Media Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
							{mediaItems.map((item) => (
								<Link key={item.id} href={`/media/${item.id}`} className="group">
									<div className="relative overflow-hidden rounded-lg aspect-square bg-card border border-border hover:border-secondary transition-all duration-300">
										{/* Placeholder for media thumbnail */}
										<div className="absolute inset-0 bg-background">
											{/* Will be replaced with actual images */}
											<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/70 to-transparent">
												{getMediaTypeIcon(item.type)}
											</div>
										</div>

										{/* Type indicator */}
										<div className="absolute top-2 right-2 z-10">
											<span className={`rounded-full w-8 h-8 flex items-center justify-center ${item.type === 'video' ? 'bg-destructive/80' :
												item.type === 'article' ? 'bg-primary/80' : 'bg-secondary/80'
												}`}>
												{getMediaTypeIcon(item.type)}
											</span>
										</div>

										{/* Info overlay */}
										<div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
											<h3 className="text-sm font-bold text-foreground truncate">
												{item.title}
											</h3>
											<div className="flex justify-between items-center mt-1">
												<span className="text-xs text-muted-foreground">{item.category}</span>
												<span className="text-xs text-muted-foreground">{item.date}</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>

						<div className="mt-12 text-center">
							<Button variant="outline" size="lg">
								Load More
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter */}
			<section className="py-20 bg-card/10">
				<div className="container mx-auto px-4">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4 text-foreground">Subscribe to Our Updates</h2>
						<p className="text-muted-foreground mb-8">
							Get the latest media content, founder resources, and Accelr8 updates
							delivered directly to your inbox.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Input
								type="email"
								placeholder="Enter your email"
								className="bg-background border-border flex-grow"
							/>
							<Button>Subscribe</Button>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 