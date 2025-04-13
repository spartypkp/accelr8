import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Define a schema for individual amenities
const amenitySchema = z.object({
	name: z.string().min(1, "Amenity name is required"),
	category: z.string().min(1, "Category is required"),
	icon: z.string().optional(),
});

// Define the form schema
const formSchema = z.object({
	amenities: z.array(amenitySchema).min(0),
});

type AmenitiesFormValues = z.infer<typeof formSchema>;

interface AmenitiesManagerProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: AmenitiesFormValues) => void;
}

// Available amenity categories
const AMENITY_CATEGORIES = [
	{ value: "technology", label: "Technology" },
	{ value: "workspace", label: "Workspace" },
	{ value: "comfort", label: "Comfort" },
	{ value: "kitchen", label: "Kitchen" },
	{ value: "entertainment", label: "Entertainment" },
	{ value: "services", label: "Services" },
	{ value: "other", label: "Other" },
];

// Some common amenity icons (using Lucide icon names)
const COMMON_ICONS = [
	{ value: "wifi", label: "WiFi" },
	{ value: "coffee", label: "Coffee" },
	{ value: "tv", label: "TV" },
	{ value: "printer", label: "Printer" },
	{ value: "chefHat", label: "Kitchen" },
	{ value: "bath", label: "Bath" },
	{ value: "bed", label: "Bed" },
	{ value: "car", label: "Parking" },
	{ value: "dumbbell", label: "Gym" },
	{ value: "swimming", label: "Pool" },
];

export function AmenitiesManager({ house, isLoading, onSubmit }: AmenitiesManagerProps) {
	// Transform house amenities data to form values format
	const defaultAmenities = house?.sanityHouse?.amenities?.map(amenity => ({
		name: amenity.name || "",
		category: amenity.category || "other",
		icon: amenity.icon || "",
	})) || [];

	// Set up the form
	const form = useForm<AmenitiesFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amenities: defaultAmenities.length > 0 ? defaultAmenities : [],
		},
	});

	// Set up field array for dynamic amenities
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "amenities",
	});

	// Add a new empty amenity
	const addAmenity = () => {
		append({ name: "", category: "other", icon: "" });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium">House Amenities</h3>
						<Button
							type="button"
							onClick={addAmenity}
							disabled={isLoading}
							variant="outline"
							size="sm"
						>
							<Plus className="h-4 w-4 mr-2" /> Add Amenity
						</Button>
					</div>

					<div className="grid gap-4">
						{fields.length === 0 ? (
							<Card>
								<CardContent className="p-6 flex flex-col items-center justify-center text-center">
									<p className="text-muted-foreground mb-4">No amenities added yet</p>
									<Button
										type="button"
										onClick={addAmenity}
										variant="outline"
										disabled={isLoading}
									>
										<PlusCircle className="h-4 w-4 mr-2" /> Add Your First Amenity
									</Button>
								</CardContent>
							</Card>
						) : (
							fields.map((field, index) => (
								<Card key={field.id} className="overflow-hidden">
									<CardContent className="p-4 relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-2 top-2"
											onClick={() => remove(index)}
											disabled={isLoading}
										>
											<X className="h-4 w-4" />
										</Button>

										<div className="grid gap-4 md:grid-cols-3 mt-2">
											{/* Amenity Name */}
											<FormField
												control={form.control}
												name={`amenities.${index}.name`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Amenity Name</FormLabel>
														<FormControl>
															<Input placeholder="e.g. High-Speed WiFi" {...field} disabled={isLoading} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Amenity Category */}
											<FormField
												control={form.control}
												name={`amenities.${index}.category`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Category</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={isLoading}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select category" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{AMENITY_CATEGORIES.map((category) => (
																	<SelectItem key={category.value} value={category.value}>
																		{category.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											{/* Amenity Icon */}
											<FormField
												control={form.control}
												name={`amenities.${index}.icon`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Icon (optional)</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={isLoading}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select icon" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="">No Icon</SelectItem>
																{COMMON_ICONS.map((icon) => (
																	<SelectItem key={icon.value} value={icon.value}>
																		{icon.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormDescription>
															Visual icon for this amenity
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save Amenities
				</Button>
			</form>
		</Form>
	);
} 