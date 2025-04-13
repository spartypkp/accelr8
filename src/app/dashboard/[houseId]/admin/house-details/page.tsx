import { AccessInfoForm } from "@/components/house/AccessInfoForm";
import { AmenitiesManager } from "@/components/house/AmenitiesManager";
import { BasicInfoForm } from "@/components/house/BasicInfoForm";
import { HouseRulesEditor } from "@/components/house/HouseRulesEditor";
import { LocationForm } from "@/components/house/LocationForm";
import { MediaManager } from "@/components/house/MediaManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { House } from "@/lib/types";
import { ArrowLeft, Building, Image, Info, MapPin, Save, Shield, Wifi } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// This would be fetched from an API in a real implementation
const MOCK_HOUSE: House = {
	id: "123",
	sanity_house_id: "sanity-123",
	status: "open",
	current_occupancy: 12,
	wifi_network: "Accelr8-House",
	wifi_password: "founders2023",
	access_code: "1234#",
	emergency_contacts: [
		{ name: "Property Manager", phone: "123-456-7890", role: "Manager" }
	],
	maintenance_contacts: [
		{ name: "Plumber", phone: "555-123-4567" },
		{ name: "Electrician", phone: "555-987-6543" }
	],
	operational_notes: "Weekly cleaning on Tuesdays. Trash collection on Mondays and Thursdays.",
	created_at: "2023-01-01",
	updated_at: "2023-08-01",
	sanityHouse: {
		_id: "sanity-123",
		_type: "house",
		_createdAt: "2022-01-01",
		_updatedAt: "2023-01-01",
		_rev: "abc123",
		name: "Accelr8 Nob Hill",
		slug: {
			_type: "slug",
			current: "nob-hill"
		},
		active: true,
		shortDescription: "A vibrant co-living space for tech founders in the heart of Nob Hill, San Francisco.",
		capacity: 15,
		location: {
			address: "1234 Pine Street",
			city: "San Francisco",
			state: "CA",
			zipCode: "94109",
			country: "USA",
			coordinates: {
				_type: "geopoint",
				lat: 37.7937,
				lng: -122.4158
			}
		},
		amenities: [
			{ name: "High-Speed WiFi", category: "technology", icon: "wifi", _key: "1" },
			{ name: "Co-working Space", category: "workspace", icon: "laptop", _key: "2" },
			{ name: "Daily Cleaning", category: "services", icon: "trash", _key: "3" }
		]
	}
};

export default function HouseDetailsPage({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;
	const [isLoading, setIsLoading] = useState(false);
	const [house, setHouse] = useState<House>(MOCK_HOUSE);

	// In a real implementation, this would fetch actual house data
	// const { data: house, isLoading } = useHouse(houseId);

	// These handlers would connect to API endpoints in a real implementation
	const handleBasicInfoSubmit = (values: any) => {
		console.log("Basic info submitted:", values);
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			// Update local state with new values
			setHouse(prev => ({
				...prev,
				status: values.status,
				sanityHouse: {
					...prev.sanityHouse!,
					name: values.name,
					shortDescription: values.shortDescription,
					active: values.active,
					capacity: values.capacity
				}
			}));
		}, 1000);
	};

	const handleLocationSubmit = (values: any) => {
		console.log("Location submitted:", values);
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			// Update local state with new location values
			setHouse(prev => ({
				...prev,
				sanityHouse: {
					...prev.sanityHouse!,
					location: {
						address: values.address,
						city: values.city,
						state: values.state,
						zipCode: values.zipCode,
						country: values.country,
						coordinates: {
							_type: "geopoint",
							lat: parseFloat(values.lat) || 0,
							lng: parseFloat(values.lng) || 0
						}
					}
				}
			}));
		}, 1000);
	};

	const handleMediaSubmit = (values: any) => {
		console.log("Media submitted:", values);
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handleAmenitiesSubmit = (values: any) => {
		console.log("Amenities submitted:", values);
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			// Update amenities in local state
			setHouse(prev => ({
				...prev,
				sanityHouse: {
					...prev.sanityHouse!,
					amenities: values.amenities.map((amenity: any, index: number) => ({
						...amenity,
						_key: (index + 1).toString()
					}))
				}
			}));
		}, 1000);
	};

	const handleHouseRulesSubmit = (values: any) => {
		console.log("House rules submitted:", values);
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handleAccessInfoSubmit = (values: any) => {
		console.log("Access info submitted:", values);
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			// Update operational data in local state
			setHouse(prev => ({
				...prev,
				wifi_network: values.wifi_network,
				wifi_password: values.wifi_password,
				access_code: values.access_code,
				emergency_contacts: values.emergency_contacts,
				maintenance_contacts: values.maintenance_contacts,
				operational_notes: values.operational_notes
			}));
		}, 1000);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href={`/dashboard/${houseId}/admin`}>
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<h1 className="text-3xl font-bold tracking-tight">House Details</h1>
				</div>
				<div className="flex items-center gap-2">
					{isLoading && <p className="text-sm text-muted-foreground animate-pulse">Saving changes...</p>}
					<Button disabled={isLoading}>
						<Save className="mr-2 h-4 w-4" />
						Save All Changes
					</Button>
				</div>
			</div>

			<Tabs defaultValue="basic-info" className="space-y-6">
				<TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
					<TabsTrigger value="basic-info" className="flex items-center gap-2">
						<Info className="h-4 w-4" />
						<span className="hidden md:inline">Basic Info</span>
					</TabsTrigger>
					<TabsTrigger value="location" className="flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						<span className="hidden md:inline">Location</span>
					</TabsTrigger>
					<TabsTrigger value="media" className="flex items-center gap-2">
						<Image className="h-4 w-4" />
						<span className="hidden md:inline">Media</span>
					</TabsTrigger>
					<TabsTrigger value="amenities" className="flex items-center gap-2">
						<Building className="h-4 w-4" />
						<span className="hidden md:inline">Amenities</span>
					</TabsTrigger>
					<TabsTrigger value="house-rules" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						<span className="hidden md:inline">House Rules</span>
					</TabsTrigger>
					<TabsTrigger value="access-info" className="flex items-center gap-2">
						<Wifi className="h-4 w-4" />
						<span className="hidden md:inline">Access Info</span>
					</TabsTrigger>
					<TabsTrigger value="advanced" className="flex items-center gap-2">
						<span className="text-xs">More</span>
					</TabsTrigger>
				</TabsList>

				{/* Basic Info Tab */}
				<TabsContent value="basic-info">
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>
								Edit the core details of your house
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-6">
								This information will be displayed on the house profile page and house listings.
							</p>
							<BasicInfoForm
								house={house}
								isLoading={isLoading}
								onSubmit={handleBasicInfoSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Location Tab */}
				<TabsContent value="location">
					<Card>
						<CardHeader>
							<CardTitle>Location Information</CardTitle>
							<CardDescription>
								Update the house address and location details
							</CardDescription>
						</CardHeader>
						<CardContent>
							<LocationForm
								house={house}
								isLoading={isLoading}
								onSubmit={handleLocationSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Media Tab */}
				<TabsContent value="media">
					<Card>
						<CardHeader>
							<CardTitle>Media Gallery</CardTitle>
							<CardDescription>
								Upload and manage house images
							</CardDescription>
						</CardHeader>
						<CardContent>
							<MediaManager
								house={house}
								isLoading={isLoading}
								onSubmit={handleMediaSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Amenities Tab */}
				<TabsContent value="amenities">
					<Card>
						<CardHeader>
							<CardTitle>Amenities</CardTitle>
							<CardDescription>
								Manage the amenities available at this house
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AmenitiesManager
								house={house}
								isLoading={isLoading}
								onSubmit={handleAmenitiesSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* House Rules Tab */}
				<TabsContent value="house-rules">
					<Card>
						<CardHeader>
							<CardTitle>House Rules</CardTitle>
							<CardDescription>
								Set and manage house rules and policies
							</CardDescription>
						</CardHeader>
						<CardContent>
							<HouseRulesEditor
								house={house}
								isLoading={isLoading}
								onSubmit={handleHouseRulesSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Access Info Tab */}
				<TabsContent value="access-info">
					<Card>
						<CardHeader>
							<CardTitle>Access Information</CardTitle>
							<CardDescription>
								Manage WiFi, access codes, and other private house information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AccessInfoForm
								house={house}
								isLoading={isLoading}
								onSubmit={handleAccessInfoSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Advanced Tab */}
				<TabsContent value="advanced">
					<Card>
						<CardHeader>
							<CardTitle>Advanced Settings</CardTitle>
							<CardDescription>
								Additional house configuration options
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<p className="text-sm text-muted-foreground">Advanced options will be implemented in a future update.</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 