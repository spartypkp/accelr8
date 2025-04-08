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
	FormField,
	FormItem,
	FormLabel
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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/UserContext";
import { createApplication } from "@/lib/api/applications";
import { ApplicationStatus, SupabaseApplication } from "@/lib/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Application form schema
const applicationSchema = z.object({
	personalInfo: z.object({
		firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
		lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
		email: z.string().email({ message: "Please enter a valid email address." }),
		phone: z.string().min(10, { message: "Please enter a valid phone number." }),
		dob: z.date({ required_error: "Please select your date of birth." }),
	}),
	preferences: z.object({
		location: z.string({ required_error: "Please select a location." }),
		roomType: z.string({ required_error: "Please select a room type." }),
		moveInDate: z.date({ required_error: "Please select your desired move-in date." }),
		duration: z.string({ required_error: "Please select your expected length of stay." }),
	}),
	background: z.object({
		role: z.string().min(2, { message: "Please enter your role." }),
		company: z.string().min(2, { message: "Please enter your company." }),
		linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
		github: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal("")),
		website: z.string().url({ message: "Please enter a valid website URL." }).optional().or(z.literal("")),
		workDescription: z.string().min(10, { message: "Please provide a brief description of your work." }),
		goals: z.string().min(10, { message: "Please describe your goals." }),
	}),
	additional: z.object({
		howHeard: z.string({ required_error: "Please select how you heard about us." }),
		referredBy: z.string().optional(),
		knownResidents: z.string().optional(),
		dietaryRestrictions: z.string().optional(),
		additionalInfo: z.string().optional(),
	}),
	terms: z.boolean().refine((value) => value === true, {
		message: "You must agree to the terms and conditions.",
	}),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

// Transform form values to API structure
function transformFormValuesToApiData(values: ApplicationFormValues): Partial<SupabaseApplication> {
	// Define allowed duration values
	type AllowedDurations = '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';

	// Validate if the duration is one of the allowed types
	const duration = values.preferences.duration;
	const validDuration = ['1-3 months', '3-6 months', '6-12 months', '12+ months'].includes(duration)
		? duration as AllowedDurations
		: undefined;

	return {
		// Map the basic fields
		name: `${values.personalInfo.firstName} ${values.personalInfo.lastName}`,
		email: values.personalInfo.email,
		phone: values.personalInfo.phone,
		status: ApplicationStatus.Submitted,

		// Handle preferences
		preferred_move_in: values.preferences.moveInDate.toISOString(),
		preferred_duration: validDuration,
		preferred_houses: [values.preferences.location],

		// Map role and company
		current_role: values.background.role,
		company: values.background.company,

		// Map URLs
		linkedin_url: values.background.linkedin || undefined,
		github_url: values.background.github || undefined,
		portfolio_url: values.background.website || undefined,

		// Set bio from goals
		bio: values.background.goals,

		// Referral source
		referral_source: values.additional.howHeard,

		// Store all form data in responses for future reference
		responses: {
			personalInfo: {
				...values.personalInfo,
				dob: values.personalInfo.dob.toISOString()
			},
			preferences: {
				...values.preferences,
				moveInDate: values.preferences.moveInDate.toISOString()
			},
			background: values.background,
			additional: values.additional
		}
	};
}

function ApplicationPageContent() {
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user } = useUser();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeStep, setActiveStep] = useState("personal");
	const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");

	// Initialize form with defaults
	const form = useForm<ApplicationFormValues>({
		resolver: zodResolver(applicationSchema),
		defaultValues: {
			personalInfo: {
				firstName: "",
				lastName: "",
				email: user?.email || "",
				phone: "",
				dob: undefined,
			},
			preferences: {
				location: selectedLocation,
				roomType: searchParams.get("roomType") || "",
				moveInDate: undefined,
				duration: "",
			},
			background: {
				role: "",
				company: "",
				linkedin: "",
				github: "",
				website: "",
				workDescription: "",
				goals: "",
			},
			additional: {
				howHeard: "",
				referredBy: "",
				knownResidents: "",
				dietaryRestrictions: "",
				additionalInfo: "",
			},
			terms: false,
		},
	});

	// Function to handle form submission
	async function onSubmit(values: ApplicationFormValues) {
		try {
			setIsSubmitting(true);

			// Transform form values to API data structure
			const applicationData = transformFormValuesToApiData(values);

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

	async function goToNextStep() {
		if (activeStep === "personal") {
			const personalInfoValid = await form.trigger('personalInfo', { shouldFocus: true });
			if (personalInfoValid) {
				setActiveStep("preferences");
			}
		} else if (activeStep === "preferences") {
			const preferencesValid = await form.trigger('preferences', { shouldFocus: true });
			if (preferencesValid) {
				setActiveStep("background");
			}
		} else if (activeStep === "background") {
			const backgroundValid = await form.trigger('background', { shouldFocus: true });
			if (backgroundValid) {
				setActiveStep("additional");
			}
		} else if (activeStep === "additional") {
			const additionalValid = await form.trigger(['additional', 'terms'], { shouldFocus: true });
			if (additionalValid) {
				setActiveStep("review");
			}
		}
	}

	function goToPreviousStep() {
		if (activeStep === "preferences") {
			setActiveStep("personal");
		} else if (activeStep === "background") {
			setActiveStep("preferences");
		} else if (activeStep === "additional") {
			setActiveStep("background");
		} else if (activeStep === "review") {
			setActiveStep("additional");
		}
	}

	return (
		<PublicLayout>
			{/* Hero section */}
			<section className="pt-36 pb-12 bg-gradient-primary">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-foreground">Apply to Join Accelr8</h1>
					<p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
						Join our community of founders, engineers, and innovators.
						Complete the application below to start your journey.
					</p>
				</div>
			</section>

			{/* Application Process */}
			<section className="py-12 bg-background">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap items-start">
						{/* Left side - Application form */}
						<div className="w-full lg:w-8/12 lg:pr-8 mb-8 lg:mb-0">
							<div className="bg-card rounded-lg border border-border overflow-hidden">
								{/* Application Process Steps */}
								<div className="border-b border-border px-4 py-3 bg-card/50">
									<div className="flex items-center justify-between">
										<div className="hidden sm:flex items-center text-sm">
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
													<Check className="h-3 w-3 text-primary-foreground" />
												</div>
												<span className="ml-2 font-medium">Basic Info</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center">
													<span className="text-xs font-medium text-muted-foreground">2</span>
												</div>
												<span className="ml-2 font-medium text-muted-foreground">Background</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center">
													<span className="text-xs font-medium text-muted-foreground">3</span>
												</div>
												<span className="ml-2 font-medium text-muted-foreground">Additional Info</span>
											</div>
											<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
											<div className="flex items-center">
												<div className="h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center">
													<span className="text-xs font-medium text-muted-foreground">4</span>
												</div>
												<span className="ml-2 font-medium text-muted-foreground">Review</span>
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
										<Tabs defaultValue="personal" className="w-full" value={activeStep}>
											<TabsList className="grid w-full grid-cols-4">
												<TabsTrigger value="personal">Personal Info</TabsTrigger>
												<TabsTrigger value="preferences">Preferences</TabsTrigger>
												<TabsTrigger value="background">Background</TabsTrigger>
												<TabsTrigger value="additional">Additional Info</TabsTrigger>
											</TabsList>

											<TabsContent value="personal" className="space-y-6 p-6">
												<div>
													<h2 className="text-2xl font-bold mb-2">Basic Information</h2>
													<p className="text-muted-foreground mb-6">Let's start with some basic details about you.</p>

													<div className="space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<FormField
																control={form.control}
																name="personalInfo.firstName"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
																		<FormControl>
																			<Input placeholder="Your first name" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
															<FormField
																control={form.control}
																name="personalInfo.lastName"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
																		<FormControl>
																			<Input placeholder="Your last name" {...field} />
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<FormField
															control={form.control}
															name="personalInfo.email"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Email <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
																		<Input placeholder="you@example.com" type="email" {...field} />
																	</FormControl>
																	<p className="text-xs text-muted-foreground">We'll use this email for all communications.</p>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="personalInfo.phone"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
																		<Input placeholder="+1 (555) 123-4567" {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="personalInfo.dob"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
																		<Popover>
																			<PopoverTrigger>
																				<FormControl>
																					<Input
																						placeholder="Select date"
																						value={field.value ? format(field.value, 'PP') : ''}
																						readOnly
																					/>
																				</FormControl>
																			</PopoverTrigger>
																			<PopoverContent className="w-auto p-0">
																				<Calendar
																					mode="single"
																					selected={field.value}
																					onSelect={field.onChange}
																					initialFocus
																				/>
																			</PopoverContent>
																		</Popover>
																	</FormControl>
																	<p className="text-xs text-muted-foreground">You must be at least 18 years old.</p>
																</FormItem>
															)}
														/>
													</div>
												</div>

												<div className="flex justify-end">
													<Button type="button" onClick={goToNextStep} className="flex items-center">
														Continue to Preferences
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="preferences" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2" type="button" onClick={goToPreviousStep}>
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Preferences</h2>
													</div>

													<div className="space-y-4">
														<div className="space-y-2">
															<FormField
																control={form.control}
																name="preferences.location"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Preferred Location <span className="text-destructive">*</span></FormLabel>
																		<FormControl>
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
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>

														<FormField
															control={form.control}
															name="preferences.roomType"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Room Preference <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
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
																	</FormControl>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="preferences.moveInDate"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Desired Move-In Date <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
																		<Popover>
																			<PopoverTrigger>
																				<FormControl>
																					<Input
																						placeholder="Select date"
																						value={field.value ? format(field.value, 'PP') : ''}
																						readOnly
																					/>
																				</FormControl>
																			</PopoverTrigger>
																			<PopoverContent className="w-auto p-0">
																				<Calendar
																					mode="single"
																					selected={field.value}
																					onSelect={field.onChange}
																					initialFocus
																				/>
																			</PopoverContent>
																		</Popover>
																	</FormControl>
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name="preferences.duration"
															render={({ field }) => (
																<FormItem className="space-y-2">
																	<FormLabel>Expected Length of Stay <span className="text-destructive">*</span></FormLabel>
																	<FormControl>
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
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
												</div>

												<div className="flex justify-end">
													<Button type="button" onClick={goToNextStep} className="flex items-center">
														Continue to Background
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="background" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2" type="button" onClick={goToPreviousStep}>
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Professional Background</h2>
													</div>

													<div className="space-y-4">
														<div className="space-y-2">
															<FormField
																control={form.control}
																name="background.role"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>What best describes your current role? <span className="text-destructive">*</span></FormLabel>
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
																name="background.company"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Current Company / Project <span className="text-destructive">*</span></FormLabel>
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
																name="background.linkedin"
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
																name="background.website"
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
																name="background.github"
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
																name="background.workDescription"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>Tell us a bit about what you're working on <span className="text-destructive">*</span></FormLabel>
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
																name="background.goals"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>What are you hoping to get out of living at Accelr8? <span className="text-destructive">*</span></FormLabel>
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
													<Button type="button" onClick={goToNextStep} className="flex items-center">
														Continue to Additional Info
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="additional" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2" type="button" onClick={goToPreviousStep}>
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Additional Information</h2>
													</div>

													<div className="space-y-4">
														<div className="space-y-2">
															<FormField
																control={form.control}
																name="additional.howHeard"
																render={({ field }) => (
																	<FormItem className="space-y-2">
																		<FormLabel>How did you hear about Accelr8? <span className="text-destructive">*</span></FormLabel>
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
																name="additional.referredBy"
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
																name="additional.knownResidents"
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
																name="additional.dietaryRestrictions"
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
																name="additional.additionalInfo"
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
																				I agree to the <Link href="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>.
																				<span className="text-destructive"> *</span>
																			</FormLabel>
																		</FormItem>
																	)}
																/>
															</div>
														</div>
													</div>
												</div>

												<div className="flex justify-end">
													<Button type="button" onClick={goToNextStep} className="flex items-center">
														Review Application
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="review" className="p-6 space-y-6">
												<div>
													<div className="flex items-center mb-6">
														<Button variant="ghost" size="sm" className="mr-2" type="button" onClick={goToPreviousStep}>
															<ChevronLeft className="h-4 w-4 mr-1" />
															Back
														</Button>
														<h2 className="text-2xl font-bold">Review Your Application</h2>
													</div>

													<div className="space-y-6">
														<div className="bg-muted/50 p-4 rounded-lg border border-border">
															<h3 className="font-semibold mb-2">Basic Information</h3>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
																<div>
																	<p className="text-muted-foreground">Name:</p>
																	<p>{form.watch('personalInfo.firstName')} {form.watch('personalInfo.lastName')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Email:</p>
																	<p>{form.watch('personalInfo.email')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Phone:</p>
																	<p>{form.watch('personalInfo.phone')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Date of Birth:</p>
																	<p>{form.watch('personalInfo.dob') ? format(form.watch('personalInfo.dob'), 'MMMM d, yyyy') : 'Not provided'}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Preferred Location:</p>
																	<p>{form.watch('preferences.location')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Room Preference:</p>
																	<p>{form.watch('preferences.roomType')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Move-in Date:</p>
																	<p>{form.watch('preferences.moveInDate') ? format(form.watch('preferences.moveInDate'), 'MMMM d, yyyy') : 'Not selected'}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Length of Stay:</p>
																	<p>{form.watch('preferences.duration')}</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveStep("personal")}>
																Edit
															</Button>
														</div>

														<div className="bg-muted/50 p-4 rounded-lg border border-border">
															<h3 className="font-semibold mb-2">Professional Background</h3>
															<div className="space-y-2 text-sm">
																<div>
																	<p className="text-muted-foreground">Current Role:</p>
																	<p>{form.watch('background.role')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Company/Project:</p>
																	<p>{form.watch('background.company')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Social Profiles:</p>
																	<p>
																		{form.watch('background.linkedin') && 'LinkedIn '}
																		{form.watch('background.website') && 'Personal Website '}
																		{form.watch('background.github') && 'GitHub'}
																		{!form.watch('background.linkedin') && !form.watch('background.website') && !form.watch('background.github') && 'None provided'}
																	</p>
																</div>
																<div>
																	<p className="text-muted-foreground">About Your Work:</p>
																	<p className="line-clamp-2">{form.watch('background.workDescription')}</p>
																</div>
																<div>
																	<p className="text-muted-foreground">Goals:</p>
																	<p className="line-clamp-2">{form.watch('background.goals')}</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveStep("background")}>
																Edit
															</Button>
														</div>

														<div className="bg-muted/50 p-4 rounded-lg border border-border">
															<h3 className="font-semibold mb-2">Additional Information</h3>
															<div className="space-y-2 text-sm">
																<div>
																	<p className="text-muted-foreground">How you heard about us:</p>
																	<p>{form.watch('additional.howHeard')}</p>
																</div>
																{form.watch('additional.referredBy') && (
																	<div>
																		<p className="text-muted-foreground">Referrer:</p>
																		<p>{form.watch('additional.referredBy')}</p>
																	</div>
																)}
																{form.watch('additional.dietaryRestrictions') && (
																	<div>
																		<p className="text-muted-foreground">Dietary Restrictions:</p>
																		<p>{form.watch('additional.dietaryRestrictions')}</p>
																	</div>
																)}
																<div>
																	<p className="text-muted-foreground">Agreed to Terms:</p>
																	<p>{form.watch('terms') ? 'Yes' : 'No'}</p>
																</div>
															</div>
															<Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveStep("additional")}>
																Edit
															</Button>
														</div>
													</div>
												</div>

												<div className="flex justify-end">
													<Button
														type="submit"
														className="flex items-center"
														disabled={isSubmitting}
													>
														{isSubmitting ? (
															<>
																<span className="mr-2">Submitting...</span>
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
												<h4 className="font-medium">3. Interview or Tour</h4>
												<p className="text-sm text-muted-foreground">If there's a mutual fit, we'll schedule a video call or in-person tour.</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
												<Home className="h-4 w-4" />
											</div>
											<div>
												<h4 className="font-medium">4. Welcome to Accelr8!</h4>
												<p className="text-sm text-muted-foreground">Once approved, you'll receive move-in details and community onboarding.</p>
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
										<div className="bg-muted rounded-md aspect-video flex items-center justify-center">
											{/* Replace with actual house image */}
											<Building className="h-12 w-12 text-muted-foreground" />
										</div>

										<div className="flex items-center text-sm">
											<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
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
												<a href="mailto:applications@accelr8.io">
													Contact Us
												</a>
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

export default function ApplicationPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ApplicationPageContent />
		</Suspense>
	);
} 