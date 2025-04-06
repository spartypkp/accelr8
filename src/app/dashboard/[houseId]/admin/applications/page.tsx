import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Calendar,
	CheckCircle,
	Download,
	Eye,
	Filter,
	Mail,
	MoreHorizontal,
	UserPlus,
	XCircle
} from 'lucide-react';

// Mock application data with different statuses
const APPLICATIONS = [
	{
		id: '1',
		name: 'Alex Rodriguez',
		email: 'alex@example.com',
		applied: '2023-08-10',
		status: 'review',
		bio: 'AI engineer working on LLMs',
		company: 'GenAI Studio',
		preferredRoom: 'Single',
		source: 'Referral',
	},
	{
		id: '2',
		name: 'Taylor Kim',
		email: 'taylor@example.com',
		applied: '2023-08-12',
		status: 'interview_scheduled',
		bio: 'Building smart contract infrastructure',
		company: 'Smart Contract Labs',
		preferredRoom: 'Single',
		source: 'Website',
		interviewDate: '2023-08-18',
	},
	{
		id: '3',
		name: 'Jordan Patel',
		email: 'jordan@example.com',
		applied: '2023-08-05',
		status: 'accepted',
		bio: 'Founder of a decentralized marketplace',
		company: 'DMarket',
		preferredRoom: 'Double',
		source: 'Event',
		moveInDate: '2023-09-01',
	},
	{
		id: '4',
		name: 'Morgan Lewis',
		email: 'morgan@example.com',
		applied: '2023-08-08',
		status: 'rejected',
		bio: 'Working on AI for robotics',
		company: 'RoboAI',
		preferredRoom: 'Any',
		source: 'Website',
		rejectionReason: 'Not aligned with community focus',
	},
	{
		id: '5',
		name: 'Riley Zhang',
		email: 'riley@example.com',
		applied: '2023-08-15',
		status: 'review',
		bio: 'Building a crypto wallet',
		company: 'SecureWallet',
		preferredRoom: 'Double',
		source: 'Website',
	},
	{
		id: '6',
		name: 'Casey Williams',
		email: 'casey@example.com',
		applied: '2023-08-13',
		status: 'interview_scheduled',
		bio: 'Working on AI-powered marketing',
		company: 'MarketAI',
		preferredRoom: 'Single',
		source: 'Referral',
		interviewDate: '2023-08-20',
	},
];

// Mock full application details for the selected applicant
const SELECTED_APPLICANT = {
	id: '2',
	name: 'Taylor Kim',
	email: 'taylor@example.com',
	phone: '(555) 123-4567',
	applied: '2023-08-12',
	status: 'interview_scheduled',
	bio: 'Building smart contract infrastructure for DeFi applications. Previously at Ethereum Foundation and multiple Web3 startups. Looking to collaborate with other founders in the Web3 space.',
	company: 'Smart Contract Labs',
	companyStage: 'Seed',
	website: 'https://smartcontractlabs.io',
	preferredRoom: 'Single',
	preferredDuration: '6 months',
	source: 'Website',
	twitter: '@taylorkim',
	github: 'taylorkim',
	linkedin: 'taylorkim',
	interviewDate: '2023-08-18',
	interviewTime: '14:00',
	interviewNotes: 'Taylor has a strong background in smart contract development. Ask about previous projects and how they plan to integrate with the community.',
	skills: ['Solidity', 'Ethereum', 'DeFi', 'Smart Contracts', 'TypeScript', 'React'],
	references: [
		{
			name: 'Alex Johnson',
			relation: 'Former colleague',
			email: 'alex@ethereum.org',
			phone: '(555) 987-6543',
		}
	],
	questions: [
		{
			question: 'Why do you want to join Accelr8?',
			answer: 'I want to be surrounded by other founders who are building cutting-edge tech in Web3 and AI. I believe the community will help accelerate my product development and connect me with potential partners and investors.'
		},
		{
			question: 'What can you contribute to the community?',
			answer: 'I have deep expertise in smart contract security and development. I can help other founders who are building on blockchain technology and host workshops on secure contract development.'
		},
		{
			question: 'What are your goals for the next 6 months?',
			answer: 'Launch our MVP, attract early adopters, and raise a seed round to scale our infrastructure. I also want to build partnerships with other DeFi protocols.'
		}
	]
};

export default function ApplicationsManagement({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Applications Management</h1>
				<div className="flex gap-2">
					<Button variant="outline">
						<Filter className="mr-2 h-4 w-4" />
						Filter
					</Button>
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Review
						</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{APPLICATIONS.filter(app => app.status === 'review').length}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							Awaiting initial assessment
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Interviews Scheduled
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{APPLICATIONS.filter(app => app.status === 'interview_scheduled').length}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							Next: {
								APPLICATIONS.filter(app => app.status === 'interview_scheduled')
									.sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime())[0]?.interviewDate
							}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Acceptance Rate
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round((APPLICATIONS.filter(app => app.status === 'accepted').length /
								(APPLICATIONS.filter(app => app.status === 'accepted').length +
									APPLICATIONS.filter(app => app.status === 'rejected').length)) * 100)}%
						</div>
						<Progress
							value={(APPLICATIONS.filter(app => app.status === 'accepted').length /
								(APPLICATIONS.filter(app => app.status === 'accepted').length +
									APPLICATIONS.filter(app => app.status === 'rejected').length)) * 100}
							className="mt-2"
						/>
						<p className="text-xs text-muted-foreground mt-2">
							Based on {APPLICATIONS.filter(app => app.status === 'accepted' || app.status === 'rejected').length} decisions
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Move-ins
						</CardTitle>
						<UserPlus className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{APPLICATIONS.filter(app => app.status === 'accepted').length}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							Next move-in: {
								APPLICATIONS.filter(app => app.status === 'accepted')
									.sort((a, b) => new Date(a.moveInDate!).getTime() - new Date(b.moveInDate!).getTime())[0]?.moveInDate
							}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<div className="space-y-4 md:col-span-1">
					<div className="flex items-center mb-4">
						<Input
							placeholder="Search applications..."
							className="max-w-full"
						/>
					</div>

					<Tabs defaultValue="review" className="space-y-4">
						<TabsList className="w-full grid grid-cols-4">
							<TabsTrigger value="review">Review</TabsTrigger>
							<TabsTrigger value="scheduled">Interviews</TabsTrigger>
							<TabsTrigger value="accepted">Accepted</TabsTrigger>
							<TabsTrigger value="rejected">Rejected</TabsTrigger>
						</TabsList>

						<div className="bg-card border rounded-md">
							{APPLICATIONS.filter(app => {
								if (app.status === 'review') return true;
								return false;
							}).map(application => (
								<div key={application.id} className="p-4 border-b last:border-0">
									<div className="flex justify-between items-start">
										<div className="flex gap-3">
											<Avatar>
												<AvatarFallback>{application.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-medium text-sm">{application.name}</h3>
												<p className="text-xs text-muted-foreground">{application.company}</p>
												<p className="text-xs text-muted-foreground mt-1">Applied: {application.applied}</p>
											</div>
										</div>
										<Badge
											variant={application.status === 'review' ? 'outline' : 'secondary'}
											className={
												application.status === 'review'
													? 'border-blue-500 text-blue-500'
													: ''
											}
										>
											Review
										</Badge>
									</div>
									<p className="text-xs mt-2 line-clamp-2">{application.bio}</p>
								</div>
							))}
						</div>
					</Tabs>
				</div>

				<Card className="md:col-span-2">
					<CardHeader>
						<div className="flex justify-between items-center">
							<div>
								<CardTitle>Applicant Review</CardTitle>
								<CardDescription>
									Evaluate application details
								</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" size="sm">
									<Calendar className="h-4 w-4 mr-2" />
									Schedule Interview
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<CheckCircle className="h-4 w-4 mr-2" />
											Accept
										</DropdownMenuItem>
										<DropdownMenuItem>
											<XCircle className="h-4 w-4 mr-2" />
											Reject
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Mail className="h-4 w-4 mr-2" />
											Send Email
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="flex gap-4 items-start">
								<Avatar className="h-16 w-16">
									<AvatarFallback className="text-lg">
										{SELECTED_APPLICANT.name.split(' ').map(n => n[0]).join('')}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-xl font-bold">{SELECTED_APPLICANT.name}</h2>
									<p className="text-sm text-muted-foreground">{SELECTED_APPLICANT.company} • {SELECTED_APPLICANT.companyStage}</p>
									<div className="flex gap-2 mt-2">
										<Badge variant="secondary">Web3</Badge>
										<Badge variant="secondary">Founder</Badge>
										<Badge variant="secondary">{SELECTED_APPLICANT.preferredRoom}</Badge>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium mb-1">Bio</h3>
								<p className="text-sm">{SELECTED_APPLICANT.bio}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium mb-1">Contact Information</h3>
									<div className="space-y-1">
										<p className="text-sm flex items-center">
											<Mail className="h-3 w-3 mr-2" /> {SELECTED_APPLICANT.email}
										</p>
										<p className="text-sm">{SELECTED_APPLICANT.phone}</p>
									</div>
								</div>

								<div>
									<h3 className="text-sm font-medium mb-1">Application Details</h3>
									<div className="space-y-1 text-sm">
										<div className="flex justify-between">
											<span>Applied:</span>
											<span>{SELECTED_APPLICANT.applied}</span>
										</div>
										<div className="flex justify-between">
											<span>Source:</span>
											<span>{SELECTED_APPLICANT.source}</span>
										</div>
										<div className="flex justify-between">
											<span>Preferred Duration:</span>
											<span>{SELECTED_APPLICANT.preferredDuration}</span>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium mb-2">Skills</h3>
								<div className="flex flex-wrap gap-1">
									{SELECTED_APPLICANT.skills.map(skill => (
										<Badge key={skill} variant="outline">{skill}</Badge>
									))}
								</div>
							</div>

							<Separator />

							<div>
								<h3 className="text-sm font-medium mb-2">Interview</h3>
								<div className="p-4 border rounded-md">
									<div className="flex justify-between mb-2">
										<div>
											<p className="font-medium">Scheduled Interview</p>
											<p className="text-sm">{SELECTED_APPLICANT.interviewDate} at {SELECTED_APPLICANT.interviewTime}</p>
										</div>
										<Button variant="outline" size="sm">
											<Calendar className="h-4 w-4 mr-2" />
											Reschedule
										</Button>
									</div>
									<div className="mt-4">
										<h4 className="text-sm font-medium">Interview Notes</h4>
										<p className="text-sm mt-1">{SELECTED_APPLICANT.interviewNotes}</p>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium mb-2">Application Questions</h3>
								<div className="space-y-4">
									{SELECTED_APPLICANT.questions.map((q, i) => (
										<div key={i} className="p-4 border rounded-md">
											<p className="font-medium text-sm">{q.question}</p>
											<p className="text-sm mt-2">{q.answer}</p>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium mb-2">References</h3>
								<div className="p-4 border rounded-md">
									{SELECTED_APPLICANT.references.map((ref, i) => (
										<div key={i}>
											<p className="font-medium text-sm">{ref.name} ({ref.relation})</p>
											<p className="text-sm">{ref.email} • {ref.phone}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between pt-4">
						<Button variant="outline">
							<XCircle className="h-4 w-4 mr-2" />
							Reject
						</Button>
						<Button>
							<CheckCircle className="h-4 w-4 mr-2" />
							Accept Application
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
} 