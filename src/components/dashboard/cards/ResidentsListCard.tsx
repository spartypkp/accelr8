import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";
import { Resident, ResidentCard } from "./ResidentCard";

interface ResidentsListCardProps {
	houseId: string;
	className?: string;
}

const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId] = url.split('/').slice(-2);

	// This would fetch real data in production
	// For now, we'll return mock data
	return mockResidents.map(resident => ({
		...resident,
		id: resident.id.toString(),
		avatarUrl: resident.avatar
	}));
};

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
];

export function ResidentsListCard({ houseId, className }: ResidentsListCardProps) {
	const { data, error, isLoading } = useSWR<Resident[]>(
		`/api/residents/${houseId}`,
		fetcher
	);

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);

	// Filter residents based on search term
	useEffect(() => {
		if (!data) return;

		const filtered = data.filter(resident => {
			const matchName = resident.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchRole = resident.role?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
			const matchCompany = resident.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
			const matchInterests = resident.interests?.some(interest =>
				interest.toLowerCase().includes(searchTerm.toLowerCase())
			) || false;

			return matchName || matchRole || matchCompany || matchInterests;
		});

		setFilteredResidents(filtered);
	}, [data, searchTerm]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleContactResident = (resident: Resident) => {
		// In a real app, this would open a messaging modal or redirect to a messaging page
		console.log(`Contact ${resident.name}`);
		alert(`Contact ${resident.name}`);
	};

	return (
		<DashboardCard
			title="House Community"
			titleIcon={<Users className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			className={className}
		>
			<div className="mb-4">
				<div className="relative w-full">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search residents by name, skills, or interests..."
						className="pl-10"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
				</div>
			</div>

			{filteredResidents && filteredResidents.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{filteredResidents.map((resident) => (
						<ResidentCard
							key={resident.id}
							resident={resident}
							onContact={handleContactResident}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-10">
					<Users className="h-10 w-10 text-muted-foreground/60 mx-auto mb-4" />
					<p className="text-muted-foreground">
						{searchTerm ? "No residents match your search" : "No residents found"}
					</p>
				</div>
			)}
		</DashboardCard>
	);
} 