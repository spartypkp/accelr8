"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Tabs,
	TabsContent
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import {
	ArrowRight,
	Building,
	CalendarCheck,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Home,
	Info,
	MapPin,
	User
} from "lucide-react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define schema with zod for form validation
const formSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Please enter a valid email"),
	phone: z.string().min(1, "Phone number is required"),
	dob: z.string().min(1, "Date of birth is required"),
	preferredLocation: z.string().optional(),
	roomType: z.string().optional(),
	moveInDate: z.string().optional(),
	stayDuration: z.string().optional(),
	// Background fields
	role: z.string().optional(),
	company: z.string().optional(),
	linkedin: z.string().optional(),
	website: z.string().optional(),
	github: z.string().optional(),
	workDescription: z.string().optional(),
	goals: z.string().optional(),
	// Additional fields
	howHeard: z.string().optional(),
	referredBy: z.string().optional(),
	knownResidents: z.string().optional(),
	dietaryRestrictions: z.string().optional(),
	additionalInfo: z.string().optional(),
	terms: z.boolean().optional(),
	notifications: z.boolean().optional()
});

export default function ApplyPage() {
	// Initialize form with react-hook-form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			dob: "",
			preferredLocation: "",
			roomType: "",
			moveInDate: "",
			stayDuration: "",
			role: "",
			company: "",
			linkedin: "",
			website: "",
			github: "",
			workDescription: "",
			goals: "",
			howHeard: "",
			referredBy: "",
			knownResidents: "",
			dietaryRestrictions: "",
			additionalInfo: "",
			terms: false,
			notifications: true
		}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
		console.log(values);
		// In production, would submit to API
		alert("Application submitted successfully!");
	}

	return (
		<PublicLayout>
			{/* Hero section */}
			<section className="pt-36 pb-12 bg-gradient-to-b from-black to-gray-950">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-bold mb-4">Apply to Join Accelr8</h1>
					<p className="text-gray-300 max-w-2xl mx-auto text-lg">
						Join our community of founders, engineers, and innovators.
						Complete the application below to start your journey.
					</p>
				</div>
			</section>

			{/* Application Process */}
			<section className="py-12 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap items-start">
						{/* Left side - Application form */}
						<div className="w-full lg:w-8/12 lg:pr-8 mb-8 lg:mb-0">
							<div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
								{/* Application Process Steps */}
								<div className="border-b border-gray-800 px-4 py-3 bg-gray-900/50">
									<div className="flex items-center justify-between">
										<div className="hidden sm:flex items-center text-sm">
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
													<Check className="h-3 w-3 text-white" />
												</div>
												<span className="ml-2 font-medium">Basic Info</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-gray-600 bg-gray-800 flex items-center justify-center">
													<span className="text-xs font-medium text-gray-300">2</span>
												</div>
												<span className="ml-2 font-medium text-gray-400">Background</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-gray-600 bg-gray-800 flex items-center justify-center">
													<span className="text-xs font-medium text-gray-300">3</span>
												</div>
												<span className="ml-2 font-medium text-gray-400">Additional Info</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-gray-600 bg-gray-800 flex items-center justify-center">
													<span className="text-xs font-medium text-gray-300">4</span>
												</div>
												<span className="ml-2 font-medium text-gray-400">Review</span>
											</div>
										</div>
										<div className="sm:hidden text-center w-full">
											<span className="font-medium">Step 1 of 4: Basic Info</span>
										</div>
									</div>
								</div>

								{/* Form Tabs */}
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)}>
										<Tabs defaultValue="basic-info" className="w-full">
											<TabsContent value="basic-info" className="space-y-6 p-6">
												<div>
													<h2 className="text-2xl font-bold mb-2">Basic Information</h2>
													<p className="text-gray-400 mb-6">Let's start with some basic details about you.</p>

													<div className="space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<FormField
																control={form.control}
																name="firstName"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Input placeholder="Your first name" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
															<FormField
																control={form.control}
																name="lastName"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Input placeholder="Your last name" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<FormField
															control={form.control}
															name="email"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Email <span className="text-red-500">*</span></FormLabel>
																	<FormControl>
																		<Input placeholder="you@example.com" type="email" {...field} />
																	</FormControl>
																	<p className="text-xs text-gray-400">We'll use this email for all communications.</p>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="phone"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
																	<FormControl>
																		<Input placeholder="+1 (555) 123-4567" {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="dob"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
																	<FormControl>
																		<Input type="date" {...field} />
																	</FormControl>
																	<p className="text-xs text-gray-400">You must be at least 18 years old.</p>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="preferredLocation"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Preferred Location <span className="text-red-500">*</span></FormLabel>
																	<Select onValueChange={field.onChange} defaultValue={field.value}>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select a house location" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="sf-nob-hill">San Francisco - Nob Hill</SelectItem>
																			<SelectItem value="sf-soma">San Francisco - SoMa</SelectItem>
																		</SelectContent>
																	</Select>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="roomType"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Room Preference <span className="text-red-500">*</span></FormLabel>
																	<Select onValueChange={field.onChange} defaultValue={field.value}>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select a room type" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="private">Private Room</SelectItem>
																			<SelectItem value="shared">Shared Room (2 people)</SelectItem>
																			<SelectItem value="any">No Preference</SelectItem>
																		</SelectContent>
																	</Select>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="moveInDate"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Desired Move-In Date <span className="text-red-500">*</span></FormLabel>
																	<FormControl>
																		<Input type="date" {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="stayDuration"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Expected Length of Stay <span className="text-red-500">*</span></FormLabel>
																	<Select onValueChange={field.onChange} defaultValue={field.value}>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select duration" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="1-month">1 month</SelectItem>
																			<SelectItem value="3-months">3 months</SelectItem>
																			<SelectItem value="6-months">6 months</SelectItem>
																			<SelectItem value="12-months">12 months or longer</SelectItem>
																		</SelectContent>
																	</Select>
																</FormItem>
															)}
														/>
													</div>
												</div>

												<div className="flex justify-end">
													<Button type="submit" className="flex items-center">
														Continue to Background
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="background" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2">
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Professional Background</h2>
													</div>

													<div className="space-y-4">
														<div className="space-y-2">
															<FormField
																control={form.control}
																name="role"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>What best describes your current role? <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Select onValueChange={field.onChange} defaultValue={field.value}>
																				<SelectTrigger className="w-full">
																					<SelectValue placeholder="Select your role" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem value="founder">Founder / Co-founder</SelectItem>
																					<SelectItem value="engineer">Software Engineer</SelectItem>
																					<SelectItem value="product">Product Manager</SelectItem>
																					<SelectItem value="design">Designer</SelectItem>
																					<SelectItem value="marketing">Marketing / Growth</SelectItem>
																					<SelectItem value="business">Business Development</SelectItem>
																					<SelectItem value="student">Student</SelectItem>
																					<SelectItem value="other">Other</SelectItem>
																				</SelectContent>
																			</Select>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="company"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Current Company / Project <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Input placeholder="Company or project name" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="linkedin"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>LinkedIn Profile</FormLabel>
																		<FormControl>
																			<Input placeholder="https://linkedin.com/in/yourusername" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="website"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Personal Website / Portfolio</FormLabel>
																		<FormControl>
																			<Input placeholder="https://yourwebsite.com" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="github"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>GitHub / Twitter</FormLabel>
																		<FormControl>
																			<Input placeholder="@username or URL" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="workDescription"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Tell us a bit about what you're working on <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Textarea
																				placeholder="Describe your current project, company, or professional interests"
																				rows={4}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="goals"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>What are you hoping to get out of living at Accelr8? <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Textarea
																				placeholder="Tell us about your goals and what you're looking for in a community"
																				rows={4}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>
													</div>
												</div>

												<div className="flex justify-end">
													<Button className="flex items-center">
														Continue to Additional Info
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="additional" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2">
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Additional Information</h2>
													</div>

													<div className="space-y-4">
														<div className="space-y-2">
															<FormField
																control={form.control}
																name="howHeard"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>How did you hear about Accelr8? <span className="text-red-500">*</span></FormLabel>
																		<FormControl>
																			<Select onValueChange={field.onChange} defaultValue={field.value}>
																				<SelectTrigger className="w-full">
																					<SelectValue placeholder="Select an option" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem value="referral">Referred by a friend</SelectItem>
																					<SelectItem value="search">Google Search</SelectItem>
																					<SelectItem value="social">Social Media</SelectItem>
																					<SelectItem value="event">Event or Conference</SelectItem>
																					<SelectItem value="press">Press or Media</SelectItem>
																					<SelectItem value="other">Other</SelectItem>
																				</SelectContent>
																			</Select>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="referredBy"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>If referred, who referred you?</FormLabel>
																		<FormControl>
																			<Input placeholder="Name of person who referred you" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="knownResidents"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Do you know anyone currently living at Accelr8?</FormLabel>
																		<FormControl>
																			<Input placeholder="Names of current residents you know" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="dietaryRestrictions"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Dietary Restrictions or Preferences</FormLabel>
																		<FormControl>
																			<Textarea
																				placeholder="Let us know about any dietary needs (for community meals and events)"
																				rows={2}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="space-y-2">
															<FormField
																control={form.control}
																name="additionalInfo"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Anything else you'd like us to know?</FormLabel>
																		<FormControl>
																			<Textarea
																				placeholder="Any additional information you'd like to share"
																				rows={3}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<div className="pt-2">
															<div className="flex items-start space-x-2">
																<FormField
																	control={form.control}
																	name="terms"
																	render={({ field }) => (
																		<FormItem className="flex items-start space-x-2">
																			<FormControl>
																				<Checkbox
																					id="terms"
																					checked={field.value}
																					onCheckedChange={field.onChange}
																				/>
																			</FormControl>
																			<FormLabel htmlFor="terms" className="font-normal text-sm cursor-pointer">
																				I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> and <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>.
																				<span className="text-red-500"> *</span>
																			</FormLabel>
																		</FormItem>
																	)}
																/>
															</div>
														</div>

														<div className="flex items-start space-x-2">
															<FormField
																control={form.control}
																name="notifications"
																render={({ field }) => (
																	<FormItem className="flex items-start space-x-2">
																		<FormControl>
																			<Checkbox
																				id="notifications"
																				checked={field.value}
																				onCheckedChange={field.onChange}
																			/>
																		</FormControl>
																		<FormLabel htmlFor="notifications" className="font-normal text-sm cursor-pointer">
																			I would like to receive updates about events, openings, and news from Accelr8.
																		</FormLabel>
																	</FormItem>
																)}
															/>
														</div>
													</div>
												</div>

												<div className="flex justify-end">
													<Button className="flex items-center">
														Review Application
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="review" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2">
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Review Your Application</h2>
													</div>

													<div className="space-y-6">
														<div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
															<h3 className="font-semibold mb-2">Basic Information</h3>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
																<div>
																	<p className="text-gray-400">Name:</p>
																	<p>John Smith</p>
																</div>
																<div>
																	<p className="text-gray-400">Email:</p>
																	<p>john@example.com</p>
																</div>
																<div>
																	<p className="text-gray-400">Phone:</p>
																	<p>+1 (555) 123-4567</p>
																</div>
																<div>
																	<p className="text-gray-400">Date of Birth:</p>
																	<p>March 15, 1990</p>
																</div>
																<div>
																	<p className="text-gray-400">Preferred Location:</p>
																	<p>San Francisco - Nob Hill</p>
																</div>
																<div>
																	<p className="text-gray-400">Room Preference:</p>
																	<p>Shared Room</p>
																</div>
																<div>
																	<p className="text-gray-400">Move-in Date:</p>
																	<p>December 1, 2023</p>
																</div>
																<div>
																	<p className="text-gray-400">Length of Stay:</p>
																	<p>3 months</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2">
																Edit
															</Button>
														</div>

														<div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
															<h3 className="font-semibold mb-2">Professional Background</h3>
															<div className="space-y-2 text-sm">
																<div>
																	<p className="text-gray-400">Current Role:</p>
																	<p>Software Engineer</p>
																</div>
																<div>
																	<p className="text-gray-400">Company/Project:</p>
																	<p>TechStartup Inc.</p>
																</div>
																<div>
																	<p className="text-gray-400">Social Profiles:</p>
																	<p>LinkedIn, Personal Website, GitHub</p>
																</div>
																<div>
																	<p className="text-gray-400">About Your Work:</p>
																	<p className="line-clamp-2">Building a SaaS platform for small businesses that helps with customer relationship management and sales automation...</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2">
																Edit
															</Button>
														</div>

														<div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
															<h3 className="font-semibold mb-2">Additional Information</h3>
															<div className="space-y-2 text-sm">
																<div>
																	<p className="text-gray-400">How you heard about us:</p>
																	<p>Referred by a friend</p>
																</div>
																<div>
																	<p className="text-gray-400">Referrer:</p>
																	<p>Sarah Johnson</p>
																</div>
																<div>
																	<p className="text-gray-400">Agreed to Terms:</p>
																	<p>Yes</p>
																</div>
																<div>
																	<p className="text-gray-400">Subscribe to Updates:</p>
																	<p>Yes</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2">
																Edit
															</Button>
														</div>
													</div>
												</div>

												<div className="flex justify-end">
													<Button className="flex items-center">
														Submit Application
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>
										</Tabs>
									</form>
								</Form>
							</div>
						</div>

						{/* Right side - Additional Info */}
						<div className="w-full lg:w-4/12">
							<div className="sticky top-24 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Application Process</CardTitle>
										<CardDescription>Here's what to expect</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
												<User className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">1. Submit Application</h4>
												<p className="text-sm text-gray-400">Complete this form with your information and preferences.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
												<Clock className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">2. Application Review</h4>
												<p className="text-sm text-gray-400">We'll review your application within 2-3 business days.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
												<CalendarCheck className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">3. Interview or Tour</h4>
												<p className="text-sm text-gray-400">If there's a mutual fit, we'll schedule a video call or in-person tour.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
												<Home className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">4. Welcome to Accelr8!</h4>
												<p className="text-sm text-gray-400">Once approved, you'll receive move-in details and community onboarding.</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Selected Location</CardTitle>
										<CardDescription>San Francisco - Nob Hill</CardDescription>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="bg-gray-800 rounded-md aspect-video flex items-center justify-center">
											{/* Replace with actual house image */}
											<Building className="h-12 w-12 text-gray-600" />
										</div>

										<div className="flex items-center text-sm">
											<MapPin className="h-4 w-4 mr-2 text-gray-400" />
											<span>1551 Larkin Street, San Francisco, CA 94109</span>
										</div>

										<div className="pt-2">
											<Button variant="outline" size="sm" asChild className="w-full">
												<Link href="/houses/sf-nob-hill">
													View House Details
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Need Help?</CardTitle>
										<CardDescription>We're here to assist you</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm">
											If you have any questions about the application process or need assistance, please reach out to our team.
										</p>
										<div className="space-y-2">
											<Button variant="outline" size="sm" asChild className="w-full">
												<Link href="/faq">
													<Info className="h-4 w-4 mr-2" />
													Read FAQs
												</Link>
											</Button>
											<Button variant="outline" size="sm" asChild className="w-full">
												<Link href="/contact">
													Contact Us
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 