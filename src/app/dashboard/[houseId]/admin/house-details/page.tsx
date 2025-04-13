"use client";

import { AccessInfoForm } from "@/components/house/AccessInfoForm";
import { AmenitiesManager } from "@/components/house/AmenitiesManager";
import { BasicInfoForm } from "@/components/house/BasicInfoForm";
import { HouseRulesEditor } from "@/components/house/HouseRulesEditor";
import { LocationForm } from "@/components/house/LocationForm";
import { MediaManager } from "@/components/house/MediaManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHouse } from "@/hooks/HouseContext";
import { ArrowLeft, Building, Image, Info, MapPin, Shield, Wifi } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HouseDetailsPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	const {
		house,
		isLoading,
		error,
		canEdit,
		updateBasicInfo,
		updateLocation,
		updateAccessInfo,
		updateAmenities,
		updateHouseRules,
		updateMedia
	} = useHouse();

	// Handle submissions for each form
	const handleBasicInfoSubmit = async (values: any) => {
		if (!updateBasicInfo) return;
		const { error } = await updateBasicInfo({
			name: values.name,
			shortDescription: values.shortDescription,
			status: values.status,
			active: values.active,
			capacity: values.capacity
		});

		if (error) {
			console.error('Error updating basic info:', error);
		}
	};

	const handleLocationSubmit = async (values: any) => {
		if (!updateLocation) return;
		const { error } = await updateLocation({
			address: values.address,
			city: values.city,
			state: values.state,
			zipCode: values.zipCode,
			country: values.country,
			coordinates: {
				lat: parseFloat(values.lat) || 0,
				lng: parseFloat(values.lng) || 0
			}
		});

		if (error) {
			console.error('Error updating location:', error);
		}
	};

	const handleMediaSubmit = async (values: any) => {
		if (!updateMedia) return;
		const { error } = await updateMedia({
			mainImageUrl: values.mainImageUrl,
			mainImageAlt: values.mainImageAlt,
			galleryUrls: values.galleryUrls,
			mainImageUpdated: values.mainImageUpdated,
			galleryImagesUpdated: values.galleryImagesUpdated
		});

		if (error) {
			console.error('Error updating media:', error);
		}
	};

	const handleAmenitiesSubmit = async (values: any) => {
		if (!updateAmenities) return;
		const { error } = await updateAmenities({
			amenities: values.amenities
		});

		if (error) {
			console.error('Error updating amenities:', error);
		}
	};

	const handleHouseRulesSubmit = async (values: any) => {
		if (!updateHouseRules) return;
		const { error } = await updateHouseRules({
			houseRules: values.houseRules
		});

		if (error) {
			console.error('Error updating house rules:', error);
		}
	};

	const handleAccessInfoSubmit = async (values: any) => {
		if (!updateAccessInfo) return;
		const { error } = await updateAccessInfo({
			wifi_network: values.wifi_network,
			wifi_password: values.wifi_password,
			access_code: values.access_code,
			emergency_contacts: values.emergency_contacts,
			maintenance_contacts: values.maintenance_contacts,
			operational_notes: values.operational_notes
		});

		if (error) {
			console.error('Error updating access info:', error);
		}
	};

	// Handle permission check
	if (!canEdit) {
		return (
			<div className="p-8 max-w-3xl mx-auto">
				<div className="bg-destructive/10 rounded-lg p-6 border border-destructive/20 text-center">
					<h1 className="text-2xl font-bold mb-4">Access Denied</h1>
					<p className="text-muted-foreground mb-6">You don't have permission to edit house details.</p>
					<Button asChild variant="outline">
						<Link href={`/dashboard/${houseId}/resident`}>
							Go to Resident Dashboard
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Show loading state
	if (isLoading && !house) {
		return (
			<div className="p-8 max-w-3xl mx-auto">
				<div className="border rounded-lg p-8 text-center">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
					<h1 className="text-2xl font-bold mb-3">Loading House Details</h1>
					<p className="text-muted-foreground">Please wait while we load the house information...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error && !house) {
		return (
			<div className="p-8 max-w-3xl mx-auto">
				<div className="bg-destructive/10 rounded-lg p-6 border border-destructive/20 text-center">
					<h1 className="text-2xl font-bold mb-4">Error Loading House</h1>
					<p className="text-destructive mb-6">{error}</p>
					<Button asChild variant="outline">
						<Link href="/dashboard">
							Return to Dashboard
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<div className="flex items-center justify-between pb-4 border-b">
				<div className="flex items-center gap-3">
					<Link href={`/dashboard/${houseId}/admin`}>
						<Button variant="ghost" size="icon" className="rounded-full">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">{house?.sanityHouse?.name || 'House'} Details</h1>
						<p className="text-muted-foreground">Manage house information, media, and settings</p>
					</div>
				</div>
				{isLoading && <p className="text-sm text-muted-foreground animate-pulse">Saving changes...</p>}
			</div>

			<Tabs defaultValue="basic-info" className="space-y-8">
				<div className="sm:px-2">
					<TabsList className="bg-muted/50 w-full h-auto border p-1 flex flex-wrap gap-1">
						<TabsTrigger value="basic-info" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<Info className="h-4 w-4" />
							<span>Basic Info</span>
						</TabsTrigger>
						<TabsTrigger value="location" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<MapPin className="h-4 w-4" />
							<span>Location</span>
						</TabsTrigger>
						<TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<Image className="h-4 w-4" />
							<span>Media</span>
						</TabsTrigger>
						<TabsTrigger value="amenities" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<Building className="h-4 w-4" />
							<span>Amenities</span>
						</TabsTrigger>
						<TabsTrigger value="house-rules" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<Shield className="h-4 w-4" />
							<span>House Rules</span>
						</TabsTrigger>
						<TabsTrigger value="access-info" className="flex items-center gap-2 data-[state=active]:bg-background rounded-md">
							<Wifi className="h-4 w-4" />
							<span>Access Info</span>
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Basic Info Tab */}
				<TabsContent value="basic-info">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<Info className="h-5 w-5 text-primary" />
								Basic Information
							</CardTitle>
							<CardDescription>
								Edit the core details of your house
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="mb-6 p-4 bg-muted/30 rounded-md border border-muted-foreground/10">
								<p className="text-muted-foreground">
									This information will be displayed on the house profile page and house listings.
								</p>
							</div>
							<BasicInfoForm
								house={house!}
								isLoading={isLoading}
								onSubmit={handleBasicInfoSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Location Tab */}
				<TabsContent value="location">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-primary" />
								Location Information
							</CardTitle>
							<CardDescription>
								Update the house address and location details
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<LocationForm
								house={house!}
								isLoading={isLoading}
								onSubmit={handleLocationSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Media Tab */}
				<TabsContent value="media">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<Image className="h-5 w-5 text-primary" />
								Media Gallery
							</CardTitle>
							<CardDescription>
								Upload and manage house images
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<MediaManager
								house={house!}
								isLoading={isLoading}
								onSubmit={handleMediaSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Amenities Tab */}
				<TabsContent value="amenities">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<Building className="h-5 w-5 text-primary" />
								Amenities
							</CardTitle>
							<CardDescription>
								Manage the amenities available at this house
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<AmenitiesManager
								house={house!}
								isLoading={isLoading}
								onSubmit={handleAmenitiesSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* House Rules Tab */}
				<TabsContent value="house-rules">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								House Rules
							</CardTitle>
							<CardDescription>
								Set and manage house rules and policies
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<HouseRulesEditor
								house={house!}
								isLoading={isLoading}
								onSubmit={handleHouseRulesSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Access Info Tab */}
				<TabsContent value="access-info">
					<Card className="border border-muted-foreground/10 shadow-sm">
						<CardHeader className="bg-muted/30">
							<CardTitle className="flex items-center gap-2">
								<Wifi className="h-5 w-5 text-primary" />
								Access Information
							</CardTitle>
							<CardDescription>
								Manage WiFi, access codes, and other private house information
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800/40">
								<p className="text-amber-800 dark:text-amber-300">
									<strong>Sensitive information:</strong> These details will only be visible to residents and admins.
								</p>
							</div>
							<AccessInfoForm
								house={house!}
								isLoading={isLoading}
								onSubmit={handleAccessInfoSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 