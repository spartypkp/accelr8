import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { DashboardCard } from "./dashboard-card";

interface QuickLink {
	href: string;
	title: string;
	description: string;
	icon?: ReactNode;
}

interface QuickLinksCardProps {
	houseId: string;
	links?: QuickLink[];
	className?: string;
}

export function QuickLinksCard({
	houseId,
	links,
	className
}: QuickLinksCardProps) {
	// Default links if none are provided
	const defaultLinks: QuickLink[] = [
		{
			href: `/dashboard/${houseId}/community`,
			title: "Community Directory",
			description: "Meet the other house residents",
		},
		{
			href: `/dashboard/${houseId}/resources`,
			title: "House Resources",
			description: "Book meeting rooms and equipment",
		},
		{
			href: `/dashboard/${houseId}/info`,
			title: "House Information",
			description: "Find important house details and policies",
		},
		{
			href: `/dashboard/${houseId}/billing`,
			title: "Billing & Payments",
			description: "Manage your payments and billing info",
		},
	];

	const linksToShow = links || defaultLinks;

	return (
		<DashboardCard
			title="Quick Links"
			titleIcon={<InfoIcon className="h-4 w-4" />}
			fullHeight
			className={className}
		>
			<div className="space-y-2">
				{linksToShow.map((link, index) => (
					<LinkItem
						key={index}
						href={link.href}
						title={link.title}
						description={link.description}
						icon={link.icon}
					/>
				))}
			</div>
		</DashboardCard>
	);
}

// Helper component for individual links
function LinkItem({
	href,
	title,
	description,
	icon
}: {
	href: string;
	title: string;
	description: string;
	icon?: ReactNode;
}) {
	return (
		<Link href={href} className="block p-3 rounded-lg hover:bg-muted transition-colors">
			<div className="flex items-start gap-3">
				{icon && <div className="mt-0.5">{icon}</div>}
				<div>
					<h3 className="font-medium text-sm">{title}</h3>
					<p className="text-xs text-muted-foreground mt-0.5">{description}</p>
				</div>
			</div>
		</Link>
	);
} 