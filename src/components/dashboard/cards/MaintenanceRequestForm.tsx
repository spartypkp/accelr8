import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AlertCircle, Flame, ImagePlus, Lightbulb, Thermometer, Upload, Wrench } from "lucide-react";
import { useState } from "react";

// Define all possible issue types
const issueTypes = [
	{ label: "Plumbing", icon: <Wrench className="h-4 w-4" /> },
	{ label: "Electrical", icon: <Lightbulb className="h-4 w-4" /> },
	{ label: "HVAC", icon: <Thermometer className="h-4 w-4" /> },
	{ label: "Appliance", icon: <Flame className="h-4 w-4" /> },
	{ label: "Furniture", icon: <Wrench className="h-4 w-4" /> },
	{ label: "Other", icon: <AlertCircle className="h-4 w-4" /> }
];

// Common locations in the house
const houseLocations = [
	"Bedroom", "Bathroom", "Kitchen", "Common Area", "Laundry Room",
	"Coworking Space", "Rooftop", "Basement", "Hallway", "Entrance"
];

interface MaintenanceRequestFormProps {
	houseId: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

export function MaintenanceRequestForm({ houseId, onSuccess, onCancel, className }: MaintenanceRequestFormProps) {
	// Form state
	const [formState, setFormState] = useState({
		title: "",
		description: "",
		priority: "medium" as 'low' | 'medium' | 'high' | 'emergency',
		location: "",
		room_details: "",
		issue_type: ""
	});

	// Loading and error states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Handle form input changes
	const handleChange = (field: string, value: string) => {
		setFormState(prev => ({
			...prev,
			[field]: value
		}));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		if (!formState.title || !formState.description) {
			setError("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			// Get user ID from current session
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();

			if (!user) {
				setError("You must be logged in to submit a request");
				return;
			}

			// In a real implementation, this would call an API to submit the request
			// For now, just simulate a delay
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess();
			}

			// Reset form
			setFormState({
				title: "",
				description: "",
				priority: "medium",
				location: "",
				room_details: "",
				issue_type: ""
			});
		} catch (err) {
			console.error('Error submitting maintenance request:', err);
			setError("An error occurred while submitting your request. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<CardTitle className="text-xl">Submit Maintenance Request</CardTitle>
				<CardDescription>Please provide details about the issue you're experiencing</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
							{error}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="issue-title">
							Issue Title <span className="text-destructive">*</span>
						</label>
						<Input
							id="issue-title"
							placeholder="Brief description (e.g., 'Broken light in bathroom')"
							value={formState.title}
							onChange={(e) => handleChange('title', e.target.value)}
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Issue Type
							</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{issueTypes.map((type) => (
									<Button
										key={type.label}
										type="button"
										variant={formState.issue_type === type.label ? "default" : "outline"}
										className="justify-start"
										onClick={() => handleChange('issue_type', type.label)}
									>
										<div className="mr-2">{type.icon}</div>
										{type.label}
									</Button>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Location
							</label>
							<div className="grid grid-cols-1 gap-2">
								<div>
									<label className="block text-xs mb-1" htmlFor="area">Area</label>
									<select
										id="area"
										className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										value={formState.location}
										onChange={(e) => handleChange('location', e.target.value)}
									>
										<option value="">Select area</option>
										{houseLocations.map((location) => (
											<option key={location} value={location}>{location}</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-xs mb-1" htmlFor="room">Room/Unit</label>
									<Input
										id="room"
										placeholder="Room number or identifier"
										value={formState.room_details}
										onChange={(e) => handleChange('room_details', e.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Priority
						</label>
						<div className="flex space-x-2">
							<Button
								type="button"
								variant={formState.priority === "low" ? "default" : "outline"}
								className="flex-1"
								onClick={() => handleChange('priority', 'low')}
							>
								Low
							</Button>
							<Button
								type="button"
								variant={formState.priority === "medium" ? "default" : "outline"}
								className="flex-1"
								onClick={() => handleChange('priority', 'medium')}
							>
								Medium
							</Button>
							<Button
								type="button"
								variant={formState.priority === "high" ? "default" : "outline"}
								className="flex-1"
								onClick={() => handleChange('priority', 'high')}
							>
								High
							</Button>
							<Button
								type="button"
								variant={formState.priority === "emergency" ? "default" : "outline"}
								className="flex-1"
								onClick={() => handleChange('priority', 'emergency')}
							>
								Emergency
							</Button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="description">
							Detailed Description <span className="text-destructive">*</span>
						</label>
						<textarea
							id="description"
							className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							placeholder="Please provide as much detail as possible about the issue..."
							rows={4}
							value={formState.description}
							onChange={(e) => handleChange('description', e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Photos (Optional)
						</label>
						<div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
							<div className="flex flex-col items-center">
								<ImagePlus className="h-8 w-8 text-muted-foreground/60 mb-2" />
								<p className="text-sm text-muted-foreground">
									Drag and drop image files here, or click to select files
								</p>
								<p className="text-xs text-muted-foreground/60 mt-1">
									Up to 3 images, max 5MB each
								</p>
								<Button type="button" variant="outline" size="sm" className="mt-2">
									<Upload className="h-4 w-4 mr-2" />
									Upload Photos
								</Button>
							</div>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-end space-x-2">
				{onCancel && (
					<Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
						Cancel
					</Button>
				)}
				<Button onClick={handleSubmit} disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit Request"}
				</Button>
			</CardFooter>
		</Card>
	);
} 