import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema for basic house information
const formSchema = z.object({
	name: z.string().min(1, "House name is required"),
	shortDescription: z.string().max(280, "Short description should be under 280 characters"),
	active: z.boolean().default(true),
	status: z.enum(["open", "planned", "closed"]),
	capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

type BasicInfoFormValues = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: BasicInfoFormValues) => void;
}

export function BasicInfoForm({ house, isLoading, onSubmit }: BasicInfoFormProps) {
	// Set up the form with default values from the house data
	const form = useForm<BasicInfoFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: house?.sanityHouse?.name || "",
			shortDescription: house?.sanityHouse?.shortDescription || "",
			active: house?.sanityHouse?.active || true,
			status: house?.status || "open",
			capacity: house?.sanityHouse?.capacity || 0,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					{/* House Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>House Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter house name" {...field} disabled={isLoading} />
								</FormControl>
								<FormDescription>
									The name of your house as it will appear on the website
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* House Status */}
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Operational Status</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="open">Open</SelectItem>
										<SelectItem value="planned">Planned</SelectItem>
										<SelectItem value="closed">Closed</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									The current operational status of this house
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* House Capacity */}
				<FormField
					control={form.control}
					name="capacity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total Capacity</FormLabel>
							<FormControl>
								<Input
									type="number"
									min={1}
									placeholder="Enter total capacity"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription>
								The maximum number of residents this house can accommodate
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* House Short Description */}
				<FormField
					control={form.control}
					name="shortDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter a brief description of the house (max 280 characters)"
									{...field}
									disabled={isLoading}
									className="resize-none"
									rows={3}
								/>
							</FormControl>
							<FormDescription>
								A brief summary that appears in house listings
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Active Status */}
				<FormField
					control={form.control}
					name="active"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Active Status</FormLabel>
								<FormDescription>
									When active, this house will be visible on the public website
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save Basic Information
				</Button>
			</form>
		</Form>
	);
} 