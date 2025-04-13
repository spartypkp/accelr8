import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, RefreshCw, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
	// For a real implementation, you would handle file uploads differently
	// This is a simplified placeholder that would store image URLs
	mainImageUrl: z.string().optional(),
	mainImageAlt: z.string().optional(),
	galleryUrls: z.array(
		z.object({
			url: z.string(),
			alt: z.string().optional(),
			caption: z.string().optional(),
		})
	).optional(),
});

type MediaManagerFormValues = z.infer<typeof formSchema>;

interface MediaManagerProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: MediaManagerFormValues) => void;
}

// Helper function to get image URL from Sanity asset reference
// In a real implementation, you would use Sanity's urlFor helper or similar
const getImageUrl = (assetRef: any): string => {
	// This is a simplified mockup - in a real implementation you would use Sanity's
	// image URL builder or fetch the actual URL from the asset reference
	if (!assetRef) return '';

	// If there's already a url property, use it
	if (assetRef.url) return assetRef.url;

	// Otherwise, mock a URL based on the reference ID
	if (assetRef._ref) {
		return `https://cdn.sanity.io/images/${assetRef._ref.split('-').join('/')}.jpg`;
	}

	return '';
};

export function MediaManager({ house, isLoading, onSubmit }: MediaManagerProps) {
	// Extract image data from house
	const mainImageUrl = house?.sanityHouse?.mainImage?.asset
		? getImageUrl(house.sanityHouse.mainImage.asset)
		: "";

	const mainImageAlt = house?.sanityHouse?.mainImage?.alt || "";

	// Extract gallery images
	const galleryUrls = house?.sanityHouse?.galleryImages?.map(img => ({
		url: img.asset ? getImageUrl(img.asset) : "",
		alt: img.alt || "",
		caption: img.caption || "",
	})) || [];

	// Set up the form
	const form = useForm<MediaManagerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mainImageUrl,
			mainImageAlt,
			galleryUrls,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Main House Image */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Main House Image</h3>
					<p className="text-sm text-muted-foreground">
						This image will be displayed as the primary image for the house on listings and the house profile.
					</p>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Image Preview */}
						<Card className="overflow-hidden">
							<CardContent className="p-0 aspect-video relative flex items-center justify-center bg-muted">
								{mainImageUrl ? (
									<div className="w-full h-full relative">
										{/* In a real implementation, this would be a Next.js Image component */}
										<img
											src={mainImageUrl}
											alt={mainImageAlt || "House main image"}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
											<Button variant="outline" size="sm" className="text-white border-white">
												<RefreshCw className="h-4 w-4 mr-2" />
												Replace
											</Button>
										</div>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center p-6">
										<ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
										<p className="text-sm text-muted-foreground text-center">No main image added yet</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Image Metadata */}
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="mainImageUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image URL</FormLabel>
										<FormControl>
											<Input placeholder="Enter image URL" {...field} disabled={isLoading} />
										</FormControl>
										<FormDescription>
											In a real implementation, this would be an image upload interface
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="mainImageAlt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alt Text</FormLabel>
										<FormControl>
											<Input placeholder="Descriptive alt text" {...field} disabled={isLoading} />
										</FormControl>
										<FormDescription>
											Describe the image for accessibility
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="button" disabled={isLoading} className="w-full" variant="outline">
								<Upload className="h-4 w-4 mr-2" />
								Upload New Image
							</Button>
						</div>
					</div>
				</div>

				{/* Gallery Images */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium">Gallery Images</h3>
						<Button
							type="button"
							disabled={isLoading}
							variant="outline"
							size="sm"
						>
							<ImagePlus className="h-4 w-4 mr-2" />
							Add Gallery Image
						</Button>
					</div>

					<p className="text-sm text-muted-foreground">
						Add additional images to showcase different areas of the house. These will appear in the house gallery.
					</p>

					{galleryUrls.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center text-center p-6">
								<ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
								<p className="text-muted-foreground mb-4">No gallery images added yet</p>
								<Button type="button" variant="outline" disabled={isLoading}>
									<ImagePlus className="h-4 w-4 mr-2" />
									Add Your First Gallery Image
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{/* This would map over the gallery images in a real implementation */}
							{galleryUrls.map((image, index) => (
								<Card key={index} className="overflow-hidden">
									<CardContent className="p-0 aspect-square relative">
										{/* In a real implementation, this would be a Next.js Image component */}
										<img
											src={image.url}
											alt={image.alt || `Gallery image ${index + 1}`}
											className="w-full h-full object-cover"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-2 top-2 bg-black/60 text-white hover:bg-black/80"
											disabled={isLoading}
										>
											<X className="h-4 w-4" />
										</Button>
									</CardContent>
								</Card>
							))}

							{/* Add Image Placeholder */}
							<Card className="overflow-hidden border-dashed">
								<CardContent className="p-0 aspect-square flex items-center justify-center">
									<Button
										type="button"
										variant="ghost"
										className="h-full w-full"
										disabled={isLoading}
									>
										<div className="flex flex-col items-center">
											<ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">Add Image</span>
										</div>
									</Button>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				<div className="bg-muted/50 p-4 rounded-md">
					<p className="text-sm text-muted-foreground">
						Note: This is a simplified implementation. In a production environment,
						you would upload images directly to Sanity's CDN with proper progress indicators
						and image optimization.
					</p>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full md:w-auto">
					Save Media
				</Button>
			</form>
		</Form>
	);
} 