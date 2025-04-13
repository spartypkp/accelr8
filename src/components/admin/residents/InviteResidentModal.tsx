'use client';

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ResidentInviteData, inviteResident } from "@/lib/api/users";
import { useState } from "react";

export function InviteResidentModal({
	open,
	onOpenChange,
	houseId,
	onSuccess
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	houseId: string;
	onSuccess?: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<ResidentInviteData>({
		name: '',
		email: '',
		houseId: houseId,
		moveInDate: new Date().toISOString().split('T')[0]
	});
	const { toast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await inviteResident(formData);

			toast({
				title: "Invitation sent!",
				description: `${formData.name} has been invited as a resident.`,
			});

			// Reset form
			setFormData({
				name: '',
				email: '',
				houseId: houseId,
				moveInDate: new Date().toISOString().split('T')[0]
			});

			onOpenChange(false);
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error('Error inviting resident:', error);
			toast({
				title: "Failed to invite resident",
				description: error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Invite New Resident</DialogTitle>
						<DialogDescription>
							Enter the new resident's email and name. They'll receive an invitation email with instructions to set up their account.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="col-span-3"
								required
								placeholder="Full name"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								className="col-span-3"
								required
								placeholder="email@example.com"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="moveInDate" className="text-right">
								Move-in Date
							</Label>
							<Input
								id="moveInDate"
								name="moveInDate"
								type="date"
								value={formData.moveInDate}
								onChange={handleChange}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Sending invitation..." : "Send Invitation"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 