'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHouse } from "@/hooks/HouseContext";
import { urlFor } from "@/lib/sanity/client";
import { ArrowLeft, Building, Image as ImageIcon, Info, MapPin, Shield, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaWifi } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";

export default function ResidentHouseDetailsPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	const { house, isLoading, error } = useHouse();

	// Show loading state
	if (isLoading && !house) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Loading House Details</h1>
				<p className="animate-pulse">Loading house information...</p>
			</div>
		);
	}

	// Show error state
	if (error && !house) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Error Loading House</h1>
				<p className="text-red-500">{error}</p>
				<Link href="/dashboard" className="text-primary hover:underline mt-4 inline-block">
					Return to Dashboard
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link href={`/dashboard/${houseId}/resident`}>
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">House Details</h1>
			</div>

			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
					<TabsTrigger value="overview" className="flex items-center gap-2">
						<Info className="h-4 w-4" />
						<span className="hidden md:inline">Overview</span>
					</TabsTrigger>
					<TabsTrigger value="location" className="flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						<span className="hidden md:inline">Location</span>
					</TabsTrigger>
					<TabsTrigger value="amenities" className="flex items-center gap-2">
						<Building className="h-4 w-4" />
						<span className="hidden md:inline">Amenities</span>
					</TabsTrigger>
					<TabsTrigger value="house-rules" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						<span className="hidden md:inline">House Rules</span>
					</TabsTrigger>
					<TabsTrigger value="wifi-access" className="flex items-center gap-2">
						<Wifi className="h-4 w-4" />
						<span className="hidden md:inline">WiFi & Access</span>
					</TabsTrigger>
					<TabsTrigger value="photos" className="flex items-center gap-2">
						<ImageIcon className="h-4 w-4" />
						<span className="hidden md:inline">Photos</span>
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>House Overview</CardTitle>
							<CardDescription>
								Welcome to your Accelr8 home
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="relative h-64 w-full overflow-hidden rounded-xl">
								{house?.sanityHouse?.mainImage ? (
									<Image
										src={urlFor(house.sanityHouse.mainImage).url()}
										alt={house.sanityHouse.mainImage.alt || house.sanityHouse.name || 'House Image'}
										fill
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full bg-muted flex items-center justify-center">
										<p className="text-muted-foreground">No image available</p>
									</div>
								)}
							</div>

							<div>
								<h2 className="text-2xl font-bold">{house?.sanityHouse?.name}</h2>
								<div className="flex items-center gap-2 mt-1">
									<Badge variant={house?.sanityHouse?.active ? "success" : "destructive"}>
										{house?.sanityHouse?.active ? "Active" : "Inactive"}
									</Badge>
									<span className="text-sm text-muted-foreground">
										Capacity: {house?.sanityHouse?.capacity || "Not specified"} members
									</span>
								</div>
								<p className="mt-4">{house?.sanityHouse?.shortDescription || "No description available."}</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">Quick Access</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">WiFi Network</span>
												<code className="bg-muted px-2 py-1 rounded text-sm">{house?.wifi_network || "Not available"}</code>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">WiFi Password</span>
												<code className="bg-muted px-2 py-1 rounded text-sm">{house?.wifi_password || "Not available"}</code>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">Access Code</span>
												<code className="bg-muted px-2 py-1 rounded text-sm">{house?.access_code || "Not available"}</code>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">Emergency Contacts</CardTitle>
									</CardHeader>
									<CardContent>
										{house?.emergency_contacts && house.emergency_contacts.length > 0 ? (
											<div className="space-y-2">
												{house.emergency_contacts.map((contact, i) => (
													<div key={i} className="text-sm">
														<div className="font-medium">{contact.name}</div>
														<div className="flex justify-between">
															<span>{contact.role || "Contact"}</span>
															<a href={`tel:${contact.phone}`} className="text-primary hover:underline flex items-center gap-1">
																{contact.phone} <HiExternalLink className="h-3 w-3" />
															</a>
														</div>
													</div>
												))}
											</div>
										) : (
											<p className="text-sm text-muted-foreground">No emergency contacts available</p>
										)}
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Location Tab */}
				<TabsContent value="location">
					<Card>
						<CardHeader>
							<CardTitle>Location</CardTitle>
							<CardDescription>
								House location and neighborhood information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<h3 className="text-lg font-medium mb-2">Address</h3>
								<div className="p-4 bg-muted rounded-lg">
									<p>{house?.sanityHouse?.location?.address}</p>
									<p>{house?.sanityHouse?.location?.city}, {house?.sanityHouse?.location?.state} {house?.sanityHouse?.location?.zipCode}</p>
									<p>{house?.sanityHouse?.location?.country}</p>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">Map</h3>
								<div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
									{house?.sanityHouse?.location?.coordinates?.lat && house?.sanityHouse?.location?.coordinates?.lng ? (
										<Link
											href={`https://maps.google.com/?q=${house.sanityHouse.location.coordinates.lat},${house.sanityHouse.location.coordinates.lng}`}
											target="_blank"
											rel="noopener noreferrer"
											className="w-full h-full flex items-center justify-center border-2 border-dashed border-border"
										>
											<div className="flex flex-col items-center gap-2">
												<MapPin className="h-10 w-10 text-muted-foreground" />
												<span className="text-primary">Open in Google Maps</span>
											</div>
										</Link>
									) : (
										<div className="text-center text-muted-foreground">
											<p>No map coordinates available</p>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Amenities Tab */}
				<TabsContent value="amenities">
					<Card>
						<CardHeader>
							<CardTitle>Amenities</CardTitle>
							<CardDescription>
								What's available in your house
							</CardDescription>
						</CardHeader>
						<CardContent>
							{house?.sanityHouse?.amenities && house.sanityHouse.amenities.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{Object.entries(
										house.sanityHouse.amenities.reduce((acc: Record<string, any[]>, amenity) => {
											const category = amenity.category || "other";
											if (!acc[category]) {
												acc[category] = [];
											}
											acc[category].push(amenity);
											return acc;
										}, {})
									).map(([category, amenities]) => (
										<Card key={category}>
											<CardHeader className="py-3">
												<CardTitle className="text-base capitalize">{category}</CardTitle>
											</CardHeader>
											<CardContent className="py-2">
												<ul className="space-y-1">
													{amenities.map((amenity: any) => (
														<li key={amenity._key} className="flex items-center gap-2">
															<span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
															<span>{amenity.name}</span>
														</li>
													))}
												</ul>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No amenities information available</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* House Rules Tab */}
				<TabsContent value="house-rules">
					<Card>
						<CardHeader>
							<CardTitle>House Rules</CardTitle>
							<CardDescription>
								Important guidelines for all residents
							</CardDescription>
						</CardHeader>
						<CardContent>
							{house?.sanityHouse?.houseRules && house.sanityHouse.houseRules.length > 0 ? (
								<div className="space-y-4">
									{house.sanityHouse.houseRules.map((rule: any, index) => (
										<div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
											<h3 className="font-medium text-base mb-1">{rule.title || 'House Rule'}</h3>
											<p className="text-sm text-muted-foreground">{rule.description || ''}</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No house rules specified yet</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* WiFi & Access Tab */}
				<TabsContent value="wifi-access">
					<Card>
						<CardHeader>
							<CardTitle>WiFi & Access Information</CardTitle>
							<CardDescription>
								Everything you need to know for access
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="bg-muted rounded-lg p-4">
								<div className="flex items-center gap-3 mb-4">
									<div className="bg-primary/10 p-3 rounded-full">
										<FaWifi className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="font-medium">WiFi Information</h3>
										<p className="text-sm text-muted-foreground">Home internet connection details</p>
									</div>
								</div>

								<div className="space-y-2 pl-4">
									<div className="flex justify-between items-center border-b pb-2">
										<span className="font-medium">Network Name</span>
										<code className="bg-background px-2 py-1 rounded">{house?.wifi_network || "Not specified"}</code>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium">Password</span>
										<code className="bg-background px-2 py-1 rounded">{house?.wifi_password || "Not specified"}</code>
									</div>
								</div>
							</div>

							<Alert>
								<AlertTitle>Access Code</AlertTitle>
								<AlertDescription>
									The house access code is <code className="bg-muted px-2 py-0.5 rounded font-bold">{house?.access_code || "Not specified"}</code>.
									Please do not share this code with non-residents.
								</AlertDescription>
							</Alert>

							<div>
								<h3 className="text-lg font-medium mb-3">Maintenance Contacts</h3>
								{house?.maintenance_contacts && house.maintenance_contacts.length > 0 ? (
									<div className="space-y-3">
										{house.maintenance_contacts.map((contact, i) => (
											<div key={i} className="flex justify-between items-center border-b pb-2 last:border-b-0">
												<span>{contact.name}</span>
												<a href={`tel:${contact.phone}`} className="text-primary hover:underline">
													{contact.phone}
												</a>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No maintenance contacts specified</p>
								)}
							</div>

							{house?.operational_notes && (
								<div>
									<h3 className="text-lg font-medium mb-2">Operational Notes</h3>
									<div className="p-4 bg-muted rounded-lg whitespace-pre-line">
										{house.operational_notes}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Photos Tab */}
				<TabsContent value="photos">
					<Card>
						<CardHeader>
							<CardTitle>Photo Gallery</CardTitle>
							<CardDescription>
								Images of your Accelr8 house
							</CardDescription>
						</CardHeader>
						<CardContent>
							{house?.sanityHouse?.galleryImages && house.sanityHouse.galleryImages.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{house.sanityHouse.galleryImages.map((image: any, index) => (
										<div key={index} className="relative aspect-square rounded-md overflow-hidden">
											<Image
												src={urlFor(image).url()}
												alt={image.alt || `House image ${index + 1}`}
												fill
												className="object-cover"
											/>
										</div>
									))}
								</div>
							) : (
								<div className="text-center p-8">
									<ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
									<p className="mt-4 text-muted-foreground">No gallery images available</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 