import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
	// This is a simplified version - in a real implementation, this would use a rich text editor
	// and would have a more complex data structure for the rich text content
	houseRules: z.string().min(1, "House rules are required"),
});

type HouseRulesFormValues = z.infer<typeof formSchema>;

interface HouseRulesEditorProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: HouseRulesFormValues) => void;
}

export function HouseRulesEditor({ house, isLoading, onSubmit }: HouseRulesEditorProps) {
	// In a real implementation, this would convert the Sanity block content to a string or rich text format
	// For now, we'll use a simplified approach with just the text content
	const defaultHouseRules = house?.sanityHouse?.houseRules
		? house.sanityHouse.houseRules
			.map(block => {
				if (block.children) {
					return block.children
						.map(child => child.text || "")
						.join("");
				}
				return "";
			})
			.filter(Boolean)
			.join("\n\n")
		: "";

	// Set up the form
	const form = useForm<HouseRulesFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			houseRules: defaultHouseRules || "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-medium mb-2">House Rules</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Define the rules and policies that residents must follow while staying at this house.
						</p>
					</div>

					<FormField
						control={form.control}
						name="houseRules"
						render={({ field }) => (
							<FormItem>
								<FormLabel>House Rules</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter house rules here..."
										className="min-h-[300px] font-medium"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>
									Note: In the future, this will be enhanced with a rich text editor for better formatting.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="bg-muted p-4 rounded-md">
						<h4 className="text-sm font-medium mb-2">Format Tips:</h4>
						<ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
							<li>Use clear, concise language for each rule</li>
							<li>Separate different rules with line breaks</li>
							<li>Start with the most important rules</li>
							<li>Consider including consequences for rule violations</li>
							<li>Add contact information for rule questions</li>
						</ul>
					</div>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save House Rules
				</Button>
			</form>
		</Form>
	);
} 