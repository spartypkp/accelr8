"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/UserContext";
import { createApplication } from "@/lib/api/applications";
import { ApplicationStatus } from "@/lib/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns";
import {
	ArrowRight,
	Building2,
	CalendarCheck,
	Calendar as CalendarIcon,
	Clock,
	HomeIcon,
	InfoIcon,
	Landmark,
	Link as LinkIcon,
	Mail,
	MapPin,
	Phone,
	User
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Application form schema - designed to match API requirements
const applicationSchema = z.object({
	// Basic fields that match API directly
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Please enter a valid email address." }),
	phone: z.string().min(10, { message: "Please provide a valid phone number." }).optional(),

	// Preferences that match API
	preferred_move_in: z.date({ required_error: "Please select your desired move-in date." }),
	preferred_duration: z.enum(['1-3 months', '3-6 months', '6-12 months', '12+ months'], {
		required_error: "Please select your expected length of stay."
	}),
	preferred_location: z.string({ required_error: "Please select a location." }),
	preferred_room_type: z.string({ required_error: "Please select a room type." }),

	// Professional background
	current_role: z.string().min(2, { message: "Please enter your role." }),
	company: z.string().min(2, { message: "Please enter your company." }),
	linkedin_url: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
	github_url: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal("")),
	portfolio_url: z.string().url({ message: "Please enter a valid website URL." }).optional().or(z.literal("")),
	bio: z.string().min(10, { message: "Please provide a brief description of your goals." }),
	work_description: z.string().min(10, { message: "Please provide a brief description of your work." }),

	// Additional info
	referral_source: z.string({ required_error: "Please select how you heard about us." }),
	referral_person: z.string().optional(),
	known_residents: z.string().optional(),
	dietary_restrictions: z.string().optional(),
	additional_info: z.string().optional(),

	// Agreement
	terms: z.boolean().refine((value) => value === true, {
		message: "You must agree to the terms and conditions.",
	}),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

function ApplicationPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useUser();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const selectedLocation = searchParams.get("location") || "";

	// Initialize form with defaults
	const form = useForm<ApplicationFormValues>({
		resolver: zodResolver(applicationSchema),
		defaultValues: {
			name: "",
			email: user?.email || "",
			phone: "",

			preferred_move_in: undefined,
			preferred_duration: undefined,
			preferred_location: selectedLocation,
			preferred_room_type: searchParams.get("roomType") || "",

			current_role: "",
			company: "",
			linkedin_url: "",
			github_url: "",
			portfolio_url: "",
			bio: "",
			work_description: "",

			referral_source: "",
			referral_person: "",
			known_residents: "",
			dietary_restrictions: "",
			additional_info: "",

			terms: false,
		},
	});

	// Function to handle form submission
	async function onSubmit(values: ApplicationFormValues) {
		try {
			setIsSubmitting(true);

			// Prepare data for API
			const applicationData = {
				name: values.name,
				email: values.email,
				phone: values.phone,
				status: ApplicationStatus.Submitted,

				preferred_move_in: values.preferred_move_in.toISOString(),
				preferred_duration: values.preferred_duration,
				preferred_houses: [values.preferred_location],

				current_role: values.current_role,
				company: values.company,
				linkedin_url: values.linkedin_url || undefined,
				github_url: values.github_url || undefined,
				portfolio_url: values.portfolio_url || undefined,
				bio: values.bio,

				referral_source: values.referral_source,

				// Store all form data in responses for future reference
				responses: {
					roomType: values.preferred_room_type,
					workDescription: values.work_description,
					referredBy: values.referral_person,
					knownResidents: values.known_residents,
					dietaryRestrictions: values.dietary_restrictions,
					additionalInfo: values.additional_info
				}
			};

			// Call API to create application
			const application = await createApplication(applicationData);

			toast({
				title: "Application Submitted",
				description: "Your application has been submitted successfully!",
				variant: "default",
			});

			// Redirect to success page
			router.push(`/apply/success?id=${application.id}`);
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "There was an error submitting your application. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<PublicLayout>
			{/* Hero section */}
			<section className="pt-36 pb-12 bg-gradient-primary">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-foreground">Join Accelr8 Community</h1>
					<p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
						Apply to live and build with exceptional founders in San Francisco.
						Complete the application below to start your journey.
					</p>
				</div>
			</section>

			{/* Application Form */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap items-start gap-8">
						{/* Main Form Column */}
						<div className="w-full lg:w-8/12 lg:pr-8">
							<Card className="border border-border shadow-sm">
								<CardHeader className="bg-muted/30">
									<CardTitle className="text-2xl">Application Form</CardTitle>
									<CardDescription>Please complete all fields marked with an asterisk (*)</CardDescription>
								</CardHeader>
								<CardContent className="pt-6">
									<Form {...form}>
										<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
											{/* Personal Information */}
											<div className="space-y-6">
												<div className="inline-flex items-center gap-2 font-medium text-lg text-primary mb-2">
													<User className="h-5 w-5" />
													<h2>Personal Information</h2>
												</div>
												<Separator />

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="name"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
																<FormControl>
																	<Input placeholder="Your full name" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="email"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Email <span className="text-destructive">*</span></FormLabel>
																<FormControl>
																	<div className="flex">
																		<div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
																			<Mail className="h-4 w-4 text-muted-foreground" />
																		</div>
																		<Input
																			className="rounded-l-none"
																			placeholder="your.email@example.com"
																			type="email"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormDescription>We'll use this email for all communications.</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="phone"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Phone Number</FormLabel>
																<FormControl>
																	<div className="flex">
																		<div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
																			<Phone className="h-4 w-4 text-muted-foreground" />
																		</div>
																		<Input
																			className="rounded-l-none"
																			placeholder="+1 (555) 123-4567"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Housing Preferences */}
											<div className="space-y-6">
												<div className="inline-flex items-center gap-2 font-medium text-lg text-primary mb-2">
													<HomeIcon className="h-5 w-5" />
													<h2>Housing Preferences</h2>
												</div>
												<Separator />

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="preferred_location"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Preferred Location <span className="text-destructive">*</span></FormLabel>
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
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="preferred_room_type"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Room Preference <span className="text-destructive">*</span></FormLabel>
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
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="preferred_move_in"
														render={({ field }) => (
															<FormItem className="flex flex-col">
																<FormLabel>Desired Move-In Date <span className="text-destructive">*</span></FormLabel>
																<Popover>
																	<PopoverTrigger asChild>
																		<FormControl>
																			<Button
																				variant={"outline"}
																				className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
																			>
																				{field.value ? (
																					format(field.value, "PPP")
																				) : (
																					<span>Select a date</span>
																				)}
																				<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																			</Button>
																		</FormControl>
																	</PopoverTrigger>
																	<PopoverContent className="w-auto p-0" align="start">
																		<Calendar
																			mode="single"
																			selected={field.value}
																			onSelect={field.onChange}
																			initialFocus
																			disabled={(date) => date < new Date()}
																		/>
																	</PopoverContent>
																</Popover>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="preferred_duration"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Expected Length of Stay <span className="text-destructive">*</span></FormLabel>
																<Select onValueChange={field.onChange} defaultValue={field.value}>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select duration" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value="1-3 months">1-3 months</SelectItem>
																		<SelectItem value="3-6 months">3-6 months</SelectItem>
																		<SelectItem value="6-12 months">6-12 months</SelectItem>
																		<SelectItem value="12+ months">12+ months</SelectItem>
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Professional Background */}
											<div className="space-y-6">
												<div className="inline-flex items-center gap-2 font-medium text-lg text-primary mb-2">
													<Landmark className="h-5 w-5" />
													<h2>Professional Background</h2>
												</div>
												<Separator />

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="current_role"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Professional Role <span className="text-destructive">*</span></FormLabel>
																<Select onValueChange={field.onChange} defaultValue={field.value}>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select your role" />
																		</SelectTrigger>
																	</FormControl>
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
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="company"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Company / Project <span className="text-destructive">*</span></FormLabel>
																<FormControl>
																	<div className="flex">
																		<div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
																			<Building2 className="h-4 w-4 text-muted-foreground" />
																		</div>
																		<Input
																			className="rounded-l-none"
																			placeholder="Company or project name"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="linkedin_url"
														render={({ field }) => (
															<FormItem>
																<FormLabel>LinkedIn Profile</FormLabel>
																<FormControl>
																	<div className="flex">
																		<div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
																			<LinkIcon className="h-4 w-4 text-muted-foreground" />
																		</div>
																		<Input
																			className="rounded-l-none"
																			placeholder="https://linkedin.com/in/yourusername"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<FormField
															control={form.control}
															name="github_url"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>GitHub</FormLabel>
																	<FormControl>
																		<Input placeholder="https://github.com/username" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="portfolio_url"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Website / Portfolio</FormLabel>
																	<FormControl>
																		<Input placeholder="https://yourwebsite.com" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name="work_description"
														render={({ field }) => (
															<FormItem className="col-span-2">
																<FormLabel>What are you working on? <span className="text-destructive">*</span></FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Describe your current project, company, or professional interests"
																		className="min-h-[120px]"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="bio"
														render={({ field }) => (
															<FormItem className="col-span-2">
																<FormLabel>What are you hoping to get out of Accelr8? <span className="text-destructive">*</span></FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Tell us about your goals and what you're looking for in a community"
																		className="min-h-[120px]"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Additional Information */}
											<div className="space-y-6">
												<div className="inline-flex items-center gap-2 font-medium text-lg text-primary mb-2">
													<InfoIcon className="h-5 w-5" />
													<h2>Additional Information</h2>
												</div>
												<Separator />

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={form.control}
														name="referral_source"
														render={({ field }) => (
															<FormItem>
																<FormLabel>How did you hear about us? <span className="text-destructive">*</span></FormLabel>
																<Select onValueChange={field.onChange} defaultValue={field.value}>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select an option" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value="referral">Referred by a friend</SelectItem>
																		<SelectItem value="search">Google Search</SelectItem>
																		<SelectItem value="social">Social Media</SelectItem>
																		<SelectItem value="event">Event or Conference</SelectItem>
																		<SelectItem value="press">Press or Media</SelectItem>
																		<SelectItem value="other">Other</SelectItem>
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="referral_person"
														render={({ field }) => (
															<FormItem>
																<FormLabel>If referred, who referred you?</FormLabel>
																<FormControl>
																	<Input placeholder="Name of person who referred you" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="known_residents"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Do you know anyone currently living at Accelr8?</FormLabel>
																<FormControl>
																	<Input placeholder="Names of current residents you know" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="dietary_restrictions"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Dietary Restrictions or Preferences</FormLabel>
																<FormControl>
																	<Input placeholder="Let us know about any dietary needs" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="additional_info"
														render={({ field }) => (
															<FormItem className="col-span-2">
																<FormLabel>Anything else you'd like us to know?</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Any additional information you'd like to share"
																		className="min-h-[100px]"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="terms"
														render={({ field }) => (
															<FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0 py-4">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
																<div className="space-y-1 leading-none">
																	<FormLabel className="font-normal">
																		I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. <span className="text-destructive">*</span>
																	</FormLabel>
																	<FormMessage />
																</div>
															</FormItem>
														)}
													/>
												</div>
											</div>

											{/* Submit Button */}
											<div className="pt-4 border-t border-border">
												<Button
													type="submit"
													className="w-full sm:w-auto bg-gradient-primary text-primary-foreground"
													size="lg"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														<>
															<span className="mr-2">Submitting Application...</span>
															<div className="h-4 w-4 border-t-2 border-primary-foreground animate-spin rounded-full" />
														</>
													) : (
														<>
															Submit Application
															<ArrowRight className="ml-2 h-4 w-4" />
														</>
													)}
												</Button>
											</div>
										</form>
									</Form>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="w-full lg:w-3/12 space-y-6">
							<div className="sticky top-24">
								<Card>
									<CardHeader>
										<CardTitle className="text-xl">Application Process</CardTitle>
										<CardDescription>Here's what to expect</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
												<User className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">1. Submit Application</h4>
												<p className="text-sm text-muted-foreground">Complete this form with your information and preferences.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
												<Clock className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">2. Application Review</h4>
												<p className="text-sm text-muted-foreground">We'll review your application within 2-3 business days.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
												<CalendarCheck className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">3. Interview</h4>
												<p className="text-sm text-muted-foreground">If there's a mutual fit, we'll schedule a video call or in-person tour.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
												<HomeIcon className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">4. Welcome to Accelr8!</h4>
												<p className="text-sm text-muted-foreground">Once approved, you'll receive move-in details and community onboarding.</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle className="text-xl">Need Help?</CardTitle>
										<CardDescription>Questions about the process?</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground mb-4">
											If you have any questions about the application process or need assistance, please reach out to our team.
										</p>
										<div className="space-y-2">
											<Button variant="outline" size="sm" asChild className="w-full">
												<Link href="/faq">
													<InfoIcon className="h-4 w-4 mr-2" />
													Read FAQs
												</Link>
											</Button>
											<Button variant="outline" size="sm" asChild className="w-full">
												<a href="mailto:applications@accelr8.io">
													<Mail className="h-4 w-4 mr-2" />
													Contact Us
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader className="pb-3">
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											<CardDescription>Featured Location</CardDescription>
										</div>
										<CardTitle className="text-lg">San Francisco - Nob Hill</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
											<Building2 className="h-8 w-8 text-muted-foreground" />
										</div>
										<p className="text-sm text-muted-foreground mb-3">Our flagship house located in the heart of San Francisco with stunning views and access to the tech ecosystem.</p>
										<Button variant="outline" size="sm" asChild className="w-full">
											<Link href="/houses/sf-nob-hill">
												View Details
											</Link>
										</Button>
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

export default function ApplicationPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ApplicationPageContent />
		</Suspense>
	);
} 