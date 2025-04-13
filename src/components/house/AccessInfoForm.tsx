import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
	wifi_network: z.string().optional(),
	wifi_password: z.string().optional(),
	access_code: z.string().optional(),
	emergency_contacts: z.string().optional(),
	maintenance_contacts: z.string().optional(),
	operational_notes: z.string().optional(),
});

type AccessInfoFormValues = z.infer<typeof formSchema>;

interface AccessInfoFormProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: AccessInfoFormValues) => void;
}

export function AccessInfoForm({ house, isLoading, onSubmit }: AccessInfoFormProps) {
	const [showWifiPassword, setShowWifiPassword] = useState(false);
	const [showAccessCode, setShowAccessCode] = useState(false);

	// Parse JSON to string for the form if needed
	const emergencyContactsStr = house?.emergency_contacts
		? typeof house.emergency_contacts === 'string'
			? house.emergency_contacts
			: JSON.stringify(house.emergency_contacts, null, 2)
		: "";

	const maintenanceContactsStr = house?.maintenance_contacts
		? typeof house.maintenance_contacts === 'string'
			? house.maintenance_contacts
			: JSON.stringify(house.maintenance_contacts, null, 2)
		: "";

	// Set up the form with default values
	const form = useForm<AccessInfoFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			wifi_network: house?.wifi_network || "",
			wifi_password: house?.wifi_password || "",
			access_code: house?.access_code || "",
			emergency_contacts: emergencyContactsStr,
			maintenance_contacts: maintenanceContactsStr,
			operational_notes: house?.operational_notes || "",
		},
	});

	// Handle form submission with proper JSON parsing
	const handleSubmit = (values: AccessInfoFormValues) => {
		try {
			// Parse JSON strings back to objects if they're not empty
			const formattedValues = {
				...values,
				emergency_contacts: values.emergency_contacts ? JSON.parse(values.emergency_contacts) : undefined,
				maintenance_contacts: values.maintenance_contacts ? JSON.parse(values.maintenance_contacts) : undefined,
			};
			onSubmit(formattedValues);
		} catch (error) {
			// Handle JSON parsing errors
			console.error("Error parsing JSON:", error);
			form.setError("emergency_contacts", {
				type: "manual",
				message: "Invalid JSON format"
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
				<div className="rounded-md border p-4 bg-muted/50">
					<div className="text-sm font-medium mb-2">Security Notice:</div>
					<p className="text-sm text-muted-foreground">
						This section contains sensitive information that should be shared carefully.
						All data is encrypted during transmission and storage.
					</p>
				</div>

				{/* WiFi Network */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">WiFi Information</h3>
					<div className="grid gap-6 md:grid-cols-2">
						<FormField
							control={form.control}
							name="wifi_network"
							render={({ field }) => (
								<FormItem>
									<FormLabel>WiFi Network Name</FormLabel>
									<FormControl>
										<Input placeholder="Network SSID" {...field} disabled={isLoading} />
									</FormControl>
									<FormDescription>The name of the house WiFi network</FormDescription>
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
										<div className="relative">
											<Input
												type={showWifiPassword ? "text" : "password"}
												placeholder="WiFi Password"
												{...field}
												disabled={isLoading}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3"
												onClick={() => setShowWifiPassword(!showWifiPassword)}
											>
												{showWifiPassword ? <EyeOff size={16} /> : <Eye size={16} />}
											</Button>
										</div>
									</FormControl>
									<FormDescription>Password for the WiFi network</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Access Code */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Building Access</h3>
					<FormField
						control={form.control}
						name="access_code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Door Access Code</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showAccessCode ? "text" : "password"}
											placeholder="Access Code"
											{...field}
											disabled={isLoading}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3"
											onClick={() => setShowAccessCode(!showAccessCode)}
										>
											{showAccessCode ? <EyeOff size={16} /> : <Eye size={16} />}
										</Button>
									</div>
								</FormControl>
								<FormDescription>Code for the main entry door</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Emergency Contacts */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Emergency Contacts</h3>
					<FormField
						control={form.control}
						name="emergency_contacts"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Emergency Contacts (JSON format)</FormLabel>
								<FormControl>
									<Textarea
										placeholder='[{"name": "Emergency Contact", "phone": "123-456-7890", "role": "Property Manager"}]'
										className="font-mono text-sm h-32"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>
									Enter emergency contacts in JSON format. Include name, role, and phone number for each contact.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Maintenance Contacts */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Maintenance Contacts</h3>
					<FormField
						control={form.control}
						name="maintenance_contacts"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Maintenance Contacts (JSON format)</FormLabel>
								<FormControl>
									<Textarea
										placeholder='[{"name": "Plumber", "phone": "123-456-7890"}, {"name": "Electrician", "phone": "098-765-4321"}]'
										className="font-mono text-sm h-32"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>
									Enter maintenance contacts in JSON format. Include name and phone number for each contact.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Operational Notes */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Operational Notes</h3>
					<FormField
						control={form.control}
						name="operational_notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Operational Notes</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter important operational notes or special instructions"
										className="h-32"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>
									Add any additional information about house operations that admins should know
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save Access Information
				</Button>
			</form>
		</Form>
	);
} 