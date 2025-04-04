import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, Mail, Twitter } from "lucide-react";

interface SocialLinks {
	twitter?: string;
	github?: string;
	website?: string;
	email?: string;
}

export interface Resident {
	id: string | number;
	name: string;
	role?: string;
	company?: string;
	bio?: string;
	avatarUrl?: string;
	joinDate?: string;
	room?: string;
	interests?: string[];
	social?: SocialLinks;
}

interface ResidentCardProps {
	resident: Resident;
	onContact?: (resident: Resident) => void;
	className?: string;
}

export function ResidentCard({ resident, onContact, className }: ResidentCardProps) {
	const handleContact = () => {
		if (onContact) {
			onContact(resident);
		}
	};

	return (
		<Card className={`overflow-hidden ${className}`}>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div className="flex items-center">
						<Avatar className="h-12 w-12 mr-3">
							<AvatarImage src={resident.avatarUrl} alt={resident.name} />
							<AvatarFallback>{resident.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-lg">{resident.name}</CardTitle>
							{(resident.role || resident.company) && (
								<CardDescription className="text-sm">
									{resident.role}
									{resident.role && resident.company && " at "}
									{resident.company}
								</CardDescription>
							)}
						</div>
					</div>
					{resident.room && (
						<div className="text-xs text-muted-foreground">
							Room {resident.room}
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{resident.bio && (
					<p className="text-sm text-muted-foreground">{resident.bio}</p>
				)}

				{resident.interests && resident.interests.length > 0 && (
					<div>
						<h4 className="text-xs font-medium text-muted-foreground mb-2">
							Interests
						</h4>
						<div className="flex flex-wrap gap-2">
							{resident.interests.map((interest, index) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{interest}
								</Badge>
							))}
						</div>
					</div>
				)}

				<div className="pt-2 flex items-center justify-between">
					<div className="flex space-x-2">
						{resident.social?.twitter && (
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="h-8 w-8"
							>
								<a
									href={`https://twitter.com/${resident.social.twitter}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Twitter className="h-4 w-4" />
									<span className="sr-only">Twitter</span>
								</a>
							</Button>
						)}

						{resident.social?.github && (
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="h-8 w-8"
							>
								<a
									href={`https://github.com/${resident.social.github}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="h-4 w-4" />
									<span className="sr-only">GitHub</span>
								</a>
							</Button>
						)}

						{resident.social?.website && (
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="h-8 w-8"
							>
								<a
									href={`https://${resident.social.website}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="h-4 w-4" />
									<span className="sr-only">Website</span>
								</a>
							</Button>
						)}

						{resident.social?.email && (
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="h-8 w-8"
							>
								<a href={`mailto:${resident.social.email}`}>
									<Mail className="h-4 w-4" />
									<span className="sr-only">Email</span>
								</a>
							</Button>
						)}
					</div>

					{onContact && (
						<Button
							variant="secondary"
							size="sm"
							onClick={handleContact}
							className="text-xs"
						>
							Contact
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
} 