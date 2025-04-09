"use client";

import { MaintenanceListCard } from "@/components/dashboard/cards/MaintenanceListCard";
import { MaintenanceRequestForm } from "@/components/dashboard/cards/MaintenanceRequestForm";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MaintenancePage() {
	const params = useParams();
	const houseId = params.houseId as string;

	// State for tracking if we're showing the form
	const [isCreatingRequest, setIsCreatingRequest] = useState(false);

	// Toggle form visibility
	const handleCreateClick = () => {
		setIsCreatingRequest(true);
	};

	// Handle form success or cancel
	const handleFormComplete = () => {
		setIsCreatingRequest(false);
	};

	return (
		<DashboardPanel
			title="Maintenance"
			description="Submit and track maintenance requests for your house"
		>
			<Tabs defaultValue={isCreatingRequest ? "create" : "list"} className="space-y-4">
				<TabsList>
					<TabsTrigger
						value="list"
						onClick={() => setIsCreatingRequest(false)}
					>
						My Requests
					</TabsTrigger>
					<TabsTrigger
						value="create"
						onClick={() => setIsCreatingRequest(true)}
					>
						New Request
					</TabsTrigger>
				</TabsList>

				<TabsContent value="list" className="space-y-4">
					<MaintenanceListCard
						showAddButton={true}
						onCreateClick={handleCreateClick}
					/>
				</TabsContent>

				<TabsContent value="create">
					<MaintenanceRequestForm
						houseId={houseId}
						onSuccess={handleFormComplete}
						onCancel={() => setIsCreatingRequest(false)}
					/>
				</TabsContent>
			</Tabs>
		</DashboardPanel>
	);
} 