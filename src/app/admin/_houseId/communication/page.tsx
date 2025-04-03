"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Bell,
	Edit,
	Info,
	Mail,
	MessageCircle,
	Plus,
	Send,
	Trash
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock announcements data
const ANNOUNCEMENTS = [
	{
		id: "1",
		title: "Weekly House Meeting - Wednesday 7pm",
		content: "Join us for our weekly house meeting in the common area to discuss upcoming events and house matters.",
		date: "2023-08-28",
		type: "general",
		author: "Admin",
		priority: "normal"
	},
	{
		id: "2",
		title: "Internet Maintenance - Thursday 2-4pm",
		content: "Our ISP will be performing maintenance on Thursday. Internet may be intermittent during this time.",
		date: "2023-08-27",
		type: "maintenance",
		author: "Admin",
		priority: "high"
	},
	{
		id: "3",
		title: "New Resident Welcome - Jamie Smith",
		content: "Please welcome our new resident Jamie Smith who will be moving in this weekend!",
		date: "2023-08-25",
		type: "community",
		author: "Admin",
		priority: "normal"
	},
	{
		id: "4",
		title: "Startup Pitch Practice - Friday 6pm",
		content: "Join us for startup pitch practice in the meeting room. Great opportunity to get feedback!",
		date: "2023-08-24",
		type: "event",
		author: "Community Manager",
		priority: "normal"
	},
	{
		id: "5",
		title: "Kitchen Clean-up Reminder",
		content: "A friendly reminder to clean up after yourself in the kitchen. We've noticed some dishes being left out.",
		date: "2023-08-20",
		type: "house_rules",
		author: "Admin",
		priority: "normal"
	}
];

// Mock messages data
const MESSAGES = [
	{
		id: "1",
		to: "Taylor Williams",
		subject: "Regarding your maintenance request",
		content: "Hi Taylor, I've scheduled the repair for your AC unit tomorrow morning at 10am. The technician will need access to your room.",
		date: "2023-08-28",
		read: true,
		replied: true
	},
	{
		id: "2",
		to: "Jordan Miller",
		subject: "Welcome to Accelr8!",
		content: "Hi Jordan, I wanted to personally welcome you to our community. Please let me know if you need anything as you get settled in.",
		date: "2023-08-25",
		read: true,
		replied: false
	},
	{
		id: "3",
		to: "Riley Garcia",
		subject: "Follow-up on your event proposal",
		content: "Hi Riley, I've reviewed your proposal for the networking event and I think it's a great idea. Let's discuss the details further.",
		date: "2023-08-24",
		read: false,
		replied: false
	},
	{
		id: "4",
		to: "Alex Johnson",
		subject: "Rent payment confirmation",
		content: "Hi Alex, This is to confirm that we've received your rent payment for September. Thank you for your promptness.",
		date: "2023-08-20",
		read: true,
		replied: false
	}
];

// Mock residents
const RESIDENTS = [
	{ id: "1", name: "Alex Johnson", email: "alex@example.com", room: "101" },
	{ id: "2", name: "Jamie Smith", email: "jamie@example.com", room: "102" },
	{ id: "3", name: "Taylor Williams", email: "taylor@example.com", room: "103" },
	{ id: "4", name: "Morgan Davis", email: "morgan@example.com", room: "104" },
	{ id: "5", name: "Riley Garcia", email: "riley@example.com", room: "105" },
	{ id: "6", name: "Jordan Miller", email: "jordan@example.com", room: "106" }
];

export default function CommunicationToolsPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	// State for new announcement form
	const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
	const [newAnnouncementContent, setNewAnnouncementContent] = useState("");

	// State for new message form
	const [newMessageTo, setNewMessageTo] = useState("");
	const [newMessageSubject, setNewMessageSubject] = useState("");
	const [newMessageContent, setNewMessageContent] = useState("");

	// Handler for submitting new announcement (mock)
	const handleSubmitAnnouncement = () => {
		// Would normally send to backend API
		alert(`New announcement submitted: ${newAnnouncementTitle}`);
		// Reset form
		setNewAnnouncementTitle("");
		setNewAnnouncementContent("");
	};

	// Handler for submitting new message (mock)
	const handleSubmitMessage = () => {
		// Would normally send to backend API
		alert(`New message submitted to: ${newMessageTo}`);
		// Reset form
		setNewMessageTo("");
		setNewMessageSubject("");
		setNewMessageContent("");
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Communication Tools</h1>
						<p className="text-muted-foreground">
							Manage all communications for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Announcements</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{ANNOUNCEMENTS.length}</div>
							<p className="text-xs text-muted-foreground">
								Last posted: {new Date(ANNOUNCEMENTS[0].date).toLocaleDateString()}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Messages</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{MESSAGES.length}</div>
							<p className="text-xs text-muted-foreground">
								{MESSAGES.filter(m => !m.read).length} unread
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Residents</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{RESIDENTS.length}</div>
							<p className="text-xs text-muted-foreground">
								Active communications
							</p>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="announcements" className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="announcements">Announcements</TabsTrigger>
						<TabsTrigger value="messages">Messages</TabsTrigger>
					</TabsList>

					<TabsContent value="announcements">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="md:col-span-2">
								<Card>
									<CardHeader className="pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
										<div>
											<CardTitle>House Announcements</CardTitle>
											<CardDescription>
												Manage announcements for residents
											</CardDescription>
										</div>
										<Button className="mt-2 md:mt-0">
											<Plus className="mr-2 h-4 w-4" />
											New Announcement
										</Button>
									</CardHeader>
									<CardContent>
										<div className="rounded-md border">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Title</TableHead>
														<TableHead>Date</TableHead>
														<TableHead>Type</TableHead>
														<TableHead>Priority</TableHead>
														<TableHead className="w-[80px]"></TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{ANNOUNCEMENTS.map((announcement) => (
														<TableRow key={announcement.id}>
															<TableCell>
																<div className="font-medium">{announcement.title}</div>
																<div className="text-sm text-muted-foreground truncate max-w-[200px]">
																	{announcement.content}
																</div>
															</TableCell>
															<TableCell>{new Date(announcement.date).toLocaleDateString()}</TableCell>
															<TableCell>
																<Badge
																	variant="outline"
																	className="capitalize"
																>
																	{announcement.type.replace("_", " ")}
																</Badge>
															</TableCell>
															<TableCell>
																<Badge
																	variant={announcement.priority === "high" ? "destructive" : "default"}
																	className="capitalize"
																>
																	{announcement.priority}
																</Badge>
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="icon">
																		<Edit className="h-4 w-4" />
																		<span className="sr-only">Edit</span>
																	</Button>
																	<Button variant="ghost" size="icon">
																		<Trash className="h-4 w-4" />
																		<span className="sr-only">Delete</span>
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</CardContent>
								</Card>
							</div>

							<div>
								<Card>
									<CardHeader>
										<CardTitle>Create Announcement</CardTitle>
										<CardDescription>
											Post a new announcement to residents
										</CardDescription>
									</CardHeader>
									<CardContent>
										<form className="space-y-4">
											<div className="space-y-2">
												<label htmlFor="title" className="text-sm font-medium">
													Title
												</label>
												<Input
													id="title"
													placeholder="Announcement title"
													value={newAnnouncementTitle}
													onChange={(e) => setNewAnnouncementTitle(e.target.value)}
												/>
											</div>

											<div className="space-y-2">
												<label htmlFor="type" className="text-sm font-medium">
													Type
												</label>
												<select
													id="type"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												>
													<option value="general">General</option>
													<option value="maintenance">Maintenance</option>
													<option value="community">Community</option>
													<option value="event">Event</option>
													<option value="house_rules">House Rules</option>
												</select>
											</div>

											<div className="space-y-2">
												<label htmlFor="priority" className="text-sm font-medium">
													Priority
												</label>
												<select
													id="priority"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												>
													<option value="normal">Normal</option>
													<option value="high">High</option>
												</select>
											</div>

											<div className="space-y-2">
												<label htmlFor="content" className="text-sm font-medium">
													Content
												</label>
												<Textarea
													id="content"
													placeholder="Announcement details"
													rows={5}
													value={newAnnouncementContent}
													onChange={(e) => setNewAnnouncementContent(e.target.value)}
												/>
											</div>

											<div className="flex justify-end">
												<Button
													type="button"
													onClick={handleSubmitAnnouncement}
													disabled={!newAnnouncementTitle || !newAnnouncementContent}
												>
													<Bell className="mr-2 h-4 w-4" />
													Post Announcement
												</Button>
											</div>
										</form>
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle>Announcement Tips</CardTitle>
										<CardDescription>
											Best practices for house communications
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-start gap-2">
												<Info className="h-5 w-5 text-muted-foreground mt-0.5" />
												<p className="text-sm text-muted-foreground">
													Keep announcements clear and concise with actionable information.
												</p>
											</div>
											<div className="flex items-start gap-2">
												<Info className="h-5 w-5 text-muted-foreground mt-0.5" />
												<p className="text-sm text-muted-foreground">
													Use high priority sparingly for truly urgent matters.
												</p>
											</div>
											<div className="flex items-start gap-2">
												<Info className="h-5 w-5 text-muted-foreground mt-0.5" />
												<p className="text-sm text-muted-foreground">
													Include date, time, and location for event announcements.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="messages">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="md:col-span-2">
								<Card>
									<CardHeader className="pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
										<div>
											<CardTitle>Resident Messages</CardTitle>
											<CardDescription>
												Individual communications with residents
											</CardDescription>
										</div>
										<Button className="mt-2 md:mt-0">
											<Mail className="mr-2 h-4 w-4" />
											New Message
										</Button>
									</CardHeader>
									<CardContent>
										<div className="rounded-md border">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>To</TableHead>
														<TableHead>Subject</TableHead>
														<TableHead>Date</TableHead>
														<TableHead>Status</TableHead>
														<TableHead className="w-[80px]"></TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{MESSAGES.map((message) => (
														<TableRow key={message.id}>
															<TableCell>{message.to}</TableCell>
															<TableCell>
																<div className="font-medium">{message.subject}</div>
																<div className="text-sm text-muted-foreground truncate max-w-[200px]">
																	{message.content}
																</div>
															</TableCell>
															<TableCell>{new Date(message.date).toLocaleDateString()}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Badge
																		variant={message.read ? "outline" : "default"}
																	>
																		{message.read ? "Read" : "Unread"}
																	</Badge>
																	{message.replied && (
																		<Badge
																			variant="success"
																		>
																			Replied
																		</Badge>
																	)}
																</div>
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="icon">
																		<MessageCircle className="h-4 w-4" />
																		<span className="sr-only">Reply</span>
																	</Button>
																	<Button variant="ghost" size="icon">
																		<Trash className="h-4 w-4" />
																		<span className="sr-only">Delete</span>
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle>Resident Directory</CardTitle>
										<CardDescription>
											All residents in the house
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{RESIDENTS.map((resident) => (
												<div key={resident.id} className="flex items-center gap-3 p-3 rounded-lg border">
													<Avatar>
														<AvatarFallback>
															{resident.name.split(' ').map(n => n[0]).join('')}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 min-w-0">
														<p className="font-medium truncate">{resident.name}</p>
														<p className="text-sm text-muted-foreground truncate">Room {resident.room}</p>
													</div>
													<Button variant="ghost" size="icon">
														<Mail className="h-4 w-4" />
														<span className="sr-only">Message</span>
													</Button>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							<div>
								<Card>
									<CardHeader>
										<CardTitle>Send Message</CardTitle>
										<CardDescription>
											Message an individual resident
										</CardDescription>
									</CardHeader>
									<CardContent>
										<form className="space-y-4">
											<div className="space-y-2">
												<label htmlFor="to" className="text-sm font-medium">
													To
												</label>
												<select
													id="to"
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
													value={newMessageTo}
													onChange={(e) => setNewMessageTo(e.target.value)}
												>
													<option value="">Select recipient</option>
													{RESIDENTS.map(resident => (
														<option key={resident.id} value={resident.name}>
															{resident.name} (Room {resident.room})
														</option>
													))}
												</select>
											</div>

											<div className="space-y-2">
												<label htmlFor="subject" className="text-sm font-medium">
													Subject
												</label>
												<Input
													id="subject"
													placeholder="Message subject"
													value={newMessageSubject}
													onChange={(e) => setNewMessageSubject(e.target.value)}
												/>
											</div>

											<div className="space-y-2">
												<label htmlFor="message-content" className="text-sm font-medium">
													Message
												</label>
												<Textarea
													id="message-content"
													placeholder="Your message"
													rows={5}
													value={newMessageContent}
													onChange={(e) => setNewMessageContent(e.target.value)}
												/>
											</div>

											<div className="flex justify-end">
												<Button
													type="button"
													onClick={handleSubmitMessage}
													disabled={!newMessageTo || !newMessageSubject || !newMessageContent}
												>
													<Send className="mr-2 h-4 w-4" />
													Send Message
												</Button>
											</div>
										</form>
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle>Message Templates</CardTitle>
										<CardDescription>
											Quick message templates
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
												<p className="font-medium">Maintenance Follow-up</p>
												<p className="text-sm text-muted-foreground truncate">
													Follow up on the maintenance request for your room...
												</p>
											</div>
											<div className="rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
												<p className="font-medium">Welcome Message</p>
												<p className="text-sm text-muted-foreground truncate">
													Welcome to our community! We're excited to have you...
												</p>
											</div>
											<div className="rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
												<p className="font-medium">Payment Reminder</p>
												<p className="text-sm text-muted-foreground truncate">
													This is a friendly reminder that your monthly payment...
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
} 