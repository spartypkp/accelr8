"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
	name: z.string().min(3, "Name must be at least 3 characters"),
	status: z.enum(["open", "planned", "closed"]),
	current_occupancy: z.number().int().min(0),
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
			status: "planned",
			current_occupancy: 0,
			wifi_network: "",
			wifi_password: "",
			access_code: "",
		},
	});

	// Handle form submission
	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		try {
			const newHouse = await createHouse(values);

			toast({
				title: "House created",
				description: `${values.name} has been successfully created.`,
			});

			// Redirect to admin home
			router.push("/superAdmin");
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
						<Link href="/superAdmin">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Add New House</h1>
						<p className="text-muted-foreground">Create a new Accelr8 house location</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>House Details</CardTitle>
						<CardDescription>
							Enter the basic information for the new house location.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>House Name*</FormLabel>
											<FormControl>
												<Input placeholder="San Francisco - Nob Hill" {...field} />
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
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status*</FormLabel>
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

								<CardFooter className="px-0 pb-0">
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Creating..." : "Create House"}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
} 