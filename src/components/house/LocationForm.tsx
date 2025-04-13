import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "ZIP code is required"),
	country: z.string().min(1, "Country is required"),
	lat: z.string().optional(),
	lng: z.string().optional(),
});

type LocationFormValues = z.infer<typeof formSchema>;

interface LocationFormProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: LocationFormValues) => void;
}

export function LocationForm({ house, isLoading, onSubmit }: LocationFormProps) {
	// Set up the form with default values
	const form = useForm<LocationFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: house?.sanityHouse?.location?.address || "",
			city: house?.sanityHouse?.location?.city || "",
			state: house?.sanityHouse?.location?.state || "",
			zipCode: house?.sanityHouse?.location?.zipCode || "",
			country: house?.sanityHouse?.location?.country || "",
			lat: house?.sanityHouse?.location?.coordinates?.lat?.toString() || "",
			lng: house?.sanityHouse?.location?.coordinates?.lng?.toString() || "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Street Address */}
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Street Address</FormLabel>
							<FormControl>
								<Input placeholder="Enter street address" {...field} disabled={isLoading} />
							</FormControl>
							<FormDescription>The physical street address of the house</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* City, State, ZIP */}
				<div className="grid gap-6 md:grid-cols-3">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input placeholder="City" {...field} disabled={isLoading} />
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
								<FormLabel>State/Province</FormLabel>
								<FormControl>
									<Input placeholder="State/Province" {...field} disabled={isLoading} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="zipCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ZIP/Postal Code</FormLabel>
								<FormControl>
									<Input placeholder="ZIP Code" {...field} disabled={isLoading} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Country */}
				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Country</FormLabel>
							<FormControl>
								<Input placeholder="Country" {...field} disabled={isLoading} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Map Coordinates (optional) */}
				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="lat"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Latitude (optional)</FormLabel>
								<FormControl>
									<Input placeholder="Latitude" {...field} disabled={isLoading} />
								</FormControl>
								<FormDescription>For map positioning</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lng"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Longitude (optional)</FormLabel>
								<FormControl>
									<Input placeholder="Longitude" {...field} disabled={isLoading} />
								</FormControl>
								<FormDescription>For map positioning</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save Location
				</Button>
			</form>
		</Form>
	);
} 