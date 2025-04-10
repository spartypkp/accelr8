"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createHouse } from "@/lib/api/houses";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema for house creation
const formSchema = z.object({
	// Basic Information
	name: z.string().min(3, "Name must be at least 3 characters"),
	slug: z.string().min(3, "Slug must be at least 3 characters")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),

	// Status and Operations
	status: z.enum(["open", "planned", "closed"]),
	active: z.boolean().default(true),
	current_occupancy: z.number().int().min(0),
	capacity: z.number().int().min(1).optional(),

	// Descriptions
	shortDescription: z.string().max(240, "Short description should be less than 240 characters").optional(),

	// Location
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().default("USA"),

	// Operational Data
	wifi_network: z.string().optional(),
	wifi_password: z.string().optional(),
	access_code: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HouseExpansionPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	// Initialize form with default values
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			status: "planned",
			active: true,
			current_occupancy: 0,
			capacity: 10,
			shortDescription: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			country: "USA",
			wifi_network: "",
			wifi_password: "",
			access_code: "",
		},
	});

	// Auto-generate slug from name
	const generateSlug = (name: string) => {
		return name.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	// Update slug when name changes
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		form.setValue("name", name);

		// Only auto-generate slug if it hasn't been manually edited
		const currentSlug = form.getValues("slug");
		if (!currentSlug || currentSlug === generateSlug(form.getValues("name").slice(0, -1))) {
			form.setValue("slug", generateSlug(name));
		}
	};

	// Handle form submission
	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		try {
			// Prepare location data for Sanity
			const locationData = {
				address: values.address,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
				country: values.country,
			};

			// Prepare data for API
			const houseData = {
				name: values.name,
				status: values.status,
				current_occupancy: values.current_occupancy,
				wifi_network: values.wifi_network,
				wifi_password: values.wifi_password,
				access_code: values.access_code,
				// Additional data for Sanity
				slug: values.slug,
				active: values.active,
				capacity: values.capacity,
				shortDescription: values.shortDescription,
				location: locationData,
			};

			const newHouse = await createHouse(houseData);

			toast({
				title: "House created",
				description: `${values.name} has been successfully created.`,
			});

			// Redirect to dashboard
			router.push("/dashboard/superAdmin");
		} catch (error) {
			console.error("Error creating house:", error);
			toast({
				title: "Error",
				description: "Failed to create the house. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex items-center">
					<Button variant="outline" size="icon" asChild className="mr-4">
						<Link href="/dashboard/superAdmin">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Add New House</h1>
						<p className="text-muted-foreground">Create a new Accelr8 house location</p>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Tabs defaultValue="basic" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="basic">Basic Information</TabsTrigger>
								<TabsTrigger value="location">Location</TabsTrigger>
								<TabsTrigger value="operations">Operations</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>House Details</CardTitle>
										<CardDescription>
											Enter the basic information for the new house location.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>House Name*</FormLabel>
													<FormControl>
														<Input
															placeholder="San Francisco - Nob Hill"
															{...field}
															onChange={handleNameChange}
														/>
													</FormControl>
													<FormDescription>
														Include both city and neighborhood/area for clarity.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="slug"
											render={({ field }) => (
												<FormItem>
													<FormLabel>URL Slug*</FormLabel>
													<FormControl>
														<Input
															placeholder="san-francisco-nob-hill"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Used for the house URL. Auto-generated but can be edited.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="shortDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Short Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="A brief description of the house..."
															className="min-h-24"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Brief summary for marketing purposes (max 240 characters).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="capacity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Total Capacity</FormLabel>
														<FormControl>
															<Input
																type="number"
																min="1"
																placeholder="10"
																{...field}
																value={field.value || ""}
																onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
															/>
														</FormControl>
														<FormDescription>
															Maximum number of residents.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="active"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Visibility</FormLabel>
														<Select
															onValueChange={(value) => field.onChange(value === "true")}
															defaultValue={field.value ? "true" : "false"}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select visibility" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="true">Visible on Website</SelectItem>
																<SelectItem value="false">Hidden</SelectItem>
															</SelectContent>
														</Select>
														<FormDescription>
															Controls visibility on the public website.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="location" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Location Details</CardTitle>
										<CardDescription>
											Enter the physical location information for the house.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Street Address</FormLabel>
													<FormControl>
														<Input placeholder="123 Main Street" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="city"
												render={({ field }) => (
													<FormItem>
														<FormLabel>City</FormLabel>
														<FormControl>
															<Input placeholder="San Francisco" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="state"
												render={({ field }) => (
													<FormItem>
														<FormLabel>State</FormLabel>
														<FormControl>
															<Input placeholder="CA" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="zipCode"
												render={({ field }) => (
													<FormItem>
														<FormLabel>ZIP Code</FormLabel>
														<FormControl>
															<Input placeholder="94109" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="country"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Country</FormLabel>
														<FormControl>
															<Input placeholder="USA" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="operations" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Operational Information</CardTitle>
										<CardDescription>
											Enter key operational details for house management.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="status"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Operational Status*</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="planned">Planned</SelectItem>
															<SelectItem value="open">Open</SelectItem>
															<SelectItem value="closed">Closed</SelectItem>
														</SelectContent>
													</Select>
													<FormDescription>
														Current operational status of the house.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="current_occupancy"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Current Occupancy*</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															placeholder="0"
															{...field}
															onChange={e => field.onChange(Number(e.target.value))}
														/>
													</FormControl>
													<FormDescription>
														Number of current residents (usually 0 for a new house).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="wifi_network"
											render={({ field }) => (
												<FormItem>
													<FormLabel>WiFi Network</FormLabel>
													<FormControl>
														<Input placeholder="Accelr8-SF" {...field} />
													</FormControl>
													<FormDescription>
														Name of the WiFi network (can be updated later).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="wifi_password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>WiFi Password</FormLabel>
													<FormControl>
														<Input type="password" placeholder="••••••••" {...field} />
													</FormControl>
													<FormDescription>
														Password for the WiFi network (can be updated later).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="access_code"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Access Code</FormLabel>
													<FormControl>
														<Input placeholder="1234" {...field} />
													</FormControl>
													<FormDescription>
														Door code or access information (can be updated later).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>

						<div className="flex justify-end space-x-4">
							<Button variant="outline" asChild>
								<Link href="/dashboard/superAdmin">Cancel</Link>
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Creating..." : "Create House"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</AdminLayout>
	);
} 