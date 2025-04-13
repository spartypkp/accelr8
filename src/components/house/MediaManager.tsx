import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addHouseGalleryImages, removeHouseGalleryImage, updateHouseMainImage } from "@/lib/api/houses";
import { urlFor } from "@/lib/sanity/client";
import { House } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Trash, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
	mainImageAlt: z.string().optional(),
	galleryItems: z.array(z.object({
		_key: z.string().optional(),
		alt: z.string().optional(),
		caption: z.string().optional(),
	})).optional(),
});

type MediaManagerFormValues = z.infer<typeof formSchema>;

interface MediaManagerProps {
	house?: House;
	isLoading?: boolean;
	onSubmit: (values: any) => void;
}

export function MediaManager({ house, isLoading, onSubmit }: MediaManagerProps) {
	const mainFileInputRef = useRef<HTMLInputElement>(null);
	const galleryFileInputRef = useRef<HTMLInputElement>(null);

	const [uploadingMain, setUploadingMain] = useState(false);
	const [uploadingGallery, setUploadingGallery] = useState(false);
	const [removingImage, setRemovingImage] = useState<string | null>(null);

	// Add local state to track images
	const [localMainImageUrl, setLocalMainImageUrl] = useState<string>("");
	const [localGalleryItems, setLocalGalleryItems] = useState<Array<{
		_key?: string,
		url: string,
		alt?: string,
		caption?: string;
	}>>([]);

	// Get the main image URL using Sanity's urlFor helper
	const mainImageUrl = localMainImageUrl || (house?.sanityHouse?.mainImage?.asset
		? urlFor(house.sanityHouse.mainImage).url()
		: "");

	const mainImageAlt = house?.sanityHouse?.mainImage?.alt || "";

	// Extract gallery images with their keys
	const galleryItems = localGalleryItems.length > 0
		? localGalleryItems
		: house?.sanityHouse?.galleryImages?.map(img => ({
			_key: img._key,
			url: img.asset ? urlFor(img).url() : "",
			alt: img.alt || "",
			caption: img.caption || "",
		})) || [];

	// Initialize local state when house data changes
	useEffect(() => {
		if (house?.sanityHouse?.mainImage?.asset) {
			setLocalMainImageUrl(urlFor(house.sanityHouse.mainImage).url());
		} else {
			setLocalMainImageUrl("");
		}

		if (house?.sanityHouse?.galleryImages?.length) {
			setLocalGalleryItems(house.sanityHouse.galleryImages.map(img => ({
				_key: img._key,
				url: img.asset ? urlFor(img).url() : "",
				alt: img.alt || "",
				caption: img.caption || "",
			})));
		} else {
			setLocalGalleryItems([]);
		}
	}, [house]);

	// Set up the form
	const form = useForm<MediaManagerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mainImageAlt,
			galleryItems: galleryItems.map(item => ({
				_key: item._key,
				alt: item.alt,
				caption: item.caption,
			})),
		},
	});

	// Handle file selection for main image
	const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files[0] || !house) return;

		const file = e.target.files[0];
		const altText = form.getValues('mainImageAlt');

		// Create local URL for immediate preview
		const localUrl = URL.createObjectURL(file);
		setLocalMainImageUrl(localUrl);
		setUploadingMain(true);

		try {
			// Create FormData to send the file
			const formData = new FormData();
			formData.append('file', file);

			// Upload the image and update the house
			await updateHouseMainImage(house.id, formData, altText);

			// Notify parent component of the change
			onSubmit({ mainImageUpdated: true });
		} catch (error) {
			console.error('Error uploading main image:', error);
			// Revert to previous image on error
			if (house?.sanityHouse?.mainImage?.asset) {
				setLocalMainImageUrl(urlFor(house.sanityHouse.mainImage).url());
			} else {
				setLocalMainImageUrl("");
			}
		} finally {
			setUploadingMain(false);
			// Reset file input
			if (mainFileInputRef.current) {
				mainFileInputRef.current.value = '';
			}
		}
	};

	// Handle file selection for gallery
	const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || !e.target.files.length || !house) return;

		const files = Array.from(e.target.files);
		setUploadingGallery(true);

		// Create local URLs for immediate preview
		const newLocalItems = files.map(file => ({
			_key: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			url: URL.createObjectURL(file),
			alt: "",
			caption: ""
		}));

		// Add to existing gallery items for immediate display
		setLocalGalleryItems(prev => [...prev, ...newLocalItems]);

		try {
			// Create FormData to send the files
			const formData = new FormData();
			files.forEach(file => {
				formData.append('files', file);
			});

			// Upload the images and add to the gallery
			const updatedHouse = await addHouseGalleryImages(house.id, formData);

			// Update gallery items from the server response if available
			if (updatedHouse?.sanityHouse?.galleryImages) {
				const newGalleryItems = updatedHouse.sanityHouse.galleryImages.map(img => ({
					_key: img._key,
					url: img.asset ? urlFor(img).url() : "",
					alt: img.alt || "",
					caption: img.caption || "",
				}));
				setLocalGalleryItems(newGalleryItems);
			}

			// Notify parent component of the change
			onSubmit({ galleryImagesUpdated: true });
		} catch (error) {
			console.error('Error uploading gallery images:', error);
			// Remove temporary items on error
			setLocalGalleryItems(prev =>
				prev.filter(item => !newLocalItems.some(newItem => newItem._key === item._key))
			);
		} finally {
			setUploadingGallery(false);
			// Reset file input
			if (galleryFileInputRef.current) {
				galleryFileInputRef.current.value = '';
			}
		}
	};

	// Handle removing an image from the gallery
	const handleRemoveGalleryImage = async (imageKey: string) => {
		if (!house) return;

		setRemovingImage(imageKey);

		// Immediately remove from local state for responsive UI
		setLocalGalleryItems(prev => prev.filter(item => item._key !== imageKey));

		try {
			// Remove the image from the gallery
			await removeHouseGalleryImage(house.id, imageKey);

			// Notify parent component of the change
			onSubmit({ galleryImagesUpdated: true });
		} catch (error) {
			console.error('Error removing gallery image:', error);
			// Restore the gallery from the server on error
			if (house?.sanityHouse?.galleryImages) {
				setLocalGalleryItems(house.sanityHouse.galleryImages.map(img => ({
					_key: img._key,
					url: img.asset ? urlFor(img).url() : "",
					alt: img.alt || "",
					caption: img.caption || "",
				})));
			}
		} finally {
			setRemovingImage(null);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Main House Image */}
				<div className="space-y-6">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">Main House Image</h3>
						<p className="text-sm text-muted-foreground mb-2">
							This image will be displayed as the primary image for the house on listings and the house profile.
						</p>
					</div>

					<div className="grid md:grid-cols-5 gap-6">
						{/* Image Preview */}
						<div className="md:col-span-3">
							<Card className="overflow-hidden border border-muted-foreground/20 rounded-xl shadow-sm">
								<CardContent className="p-0">
									<div className="aspect-[16/9] relative overflow-hidden group">
										{mainImageUrl ? (
											<>
												<img
													src={mainImageUrl}
													alt={mainImageAlt || "House main image"}
													className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
													<Button
														variant="secondary"
														size="sm"
														className="rounded-full"
														onClick={() => mainFileInputRef.current?.click()}
														disabled={uploadingMain || isLoading}
													>
														{uploadingMain ? (
															<>
																<Loader2 className="h-4 w-4 mr-2 animate-spin" />
																Uploading...
															</>
														) : (
															<>
																<Upload className="h-4 w-4 mr-2" />
																Replace Image
															</>
														)}
													</Button>
												</div>
											</>
										) : (
											<div className="flex flex-col items-center justify-center h-full bg-muted p-6">
												<ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
												<p className="text-sm text-muted-foreground text-center font-medium">No main image added yet</p>
												<Button
													variant="secondary"
													size="sm"
													className="mt-4"
													onClick={() => mainFileInputRef.current?.click()}
													disabled={uploadingMain || isLoading}
												>
													<ImagePlus className="h-4 w-4 mr-2" />
													Add Image
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Image Metadata */}
						<div className="md:col-span-2 space-y-6">
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="mainImageAlt"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Alt Text</FormLabel>
											<FormControl>
												<Input placeholder="Descriptive alt text" {...field} disabled={isLoading || uploadingMain} />
											</FormControl>
											<FormDescription>
												Describe the image for accessibility purposes
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="pt-4">
									<Button
										type="button"
										disabled={isLoading || uploadingMain}
										className="w-full"
										variant="outline"
										onClick={() => mainFileInputRef.current?.click()}
									>
										{uploadingMain ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Uploading...
											</>
										) : (
											<>
												<Upload className="h-4 w-4 mr-2" />
												{mainImageUrl ? 'Replace Main Image' : 'Upload Main Image'}
											</>
										)}
									</Button>

									{/* Hidden file input */}
									<input
										type="file"
										ref={mainFileInputRef}
										className="hidden"
										accept="image/*"
										onChange={handleMainFileChange}
										disabled={isLoading || uploadingMain}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Gallery Images */}
				<div className="space-y-6 pt-6 border-t">
					<div className="flex justify-between items-center">
						<div>
							<h3 className="text-lg font-semibold">Gallery Images</h3>
							<p className="text-sm text-muted-foreground mt-1">
								Add additional images to showcase different areas of the house
							</p>
						</div>
						<Button
							type="button"
							disabled={isLoading || uploadingGallery}
							variant="outline"
							size="sm"
							className="text-primary border-primary/30 hover:bg-primary/5"
							onClick={() => galleryFileInputRef.current?.click()}
						>
							{uploadingGallery ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Uploading...
								</>
							) : (
								<>
									<ImagePlus className="h-4 w-4 mr-2" />
									Add Images
								</>
							)}
						</Button>

						{/* Hidden file input for gallery */}
						<input
							type="file"
							ref={galleryFileInputRef}
							className="hidden"
							accept="image/*"
							multiple
							onChange={handleGalleryFileChange}
							disabled={isLoading || uploadingGallery}
						/>
					</div>

					{galleryItems.length === 0 ? (
						<div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 bg-muted/5">
							<div className="flex flex-col items-center justify-center text-center">
								<ImagePlus className="h-12 w-12 text-muted-foreground mb-4" />
								<p className="text-muted-foreground font-medium mb-6">No gallery images added yet</p>
								<Button
									type="button"
									variant="outline"
									disabled={isLoading || uploadingGallery}
									onClick={() => galleryFileInputRef.current?.click()}
								>
									<ImagePlus className="h-4 w-4 mr-2" />
									Add Gallery Images
								</Button>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{/* Gallery images */}
							{galleryItems.map((image) => (
								<div key={image._key} className="group relative">
									<div className="aspect-square overflow-hidden rounded-lg border border-muted-foreground/20 shadow-sm">
										<img
											src={image.url}
											alt={image.alt || `Gallery image`}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									</div>
									<button
										type="button"
										className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
										disabled={isLoading || removingImage === image._key}
										onClick={() => image._key && handleRemoveGalleryImage(image._key)}
									>
										{removingImage === image._key ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Trash className="h-4 w-4" />
										)}
									</button>
								</div>
							))}

							{/* Add Image Button */}
							<div className="aspect-square border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center hover:bg-muted/5 transition-colors">
								<button
									type="button"
									className="w-full h-full flex flex-col items-center justify-center p-4"
									disabled={isLoading || uploadingGallery}
									onClick={() => galleryFileInputRef.current?.click()}
								>
									<ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Add Image</span>
								</button>
							</div>
						</div>
					)}
				</div>

				<div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-8">
					<p className="text-sm text-muted-foreground">
						Images are automatically saved when you upload them. The main image will be used as the primary display image for this house,
						while gallery images will be shown in the house profile gallery.
					</p>
				</div>

				<div className="flex justify-end mt-8">
					<Button
						type="submit"
						className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
						disabled={isLoading || uploadingMain || uploadingGallery}
					>
						Save Changes
					</Button>
				</div>
			</form>
		</Form>
	);
} 