'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { checkResourceAvailability, createResourceBooking, type SanityResource } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Use the type from the API
type Resource = SanityResource & { availableNow: boolean; };

interface BookingModalProps {
	resource: Resource | null;
	houseId: string;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function BookingModal({ resource, houseId, isOpen, onClose, onSuccess }: BookingModalProps) {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [guests, setGuests] = useState("0");
	const [loading, setLoading] = useState(false);
	const [availabilityStatus, setAvailabilityStatus] = useState<"unchecked" | "checking" | "available" | "unavailable">("unchecked");
	const { toast } = useToast();

	// Reset form when modal opens with new resource
	useEffect(() => {
		if (isOpen && resource) {
			setDate(undefined);
			setStartTime("");
			setEndTime("");
			setTitle("");
			setDescription("");
			setGuests("0");
			setAvailabilityStatus("unchecked");
		}
	}, [isOpen, resource]);

	// Generate time options (8 AM to 10 PM)
	const timeOptions: string[] = [];
	for (let hour = 8; hour < 22; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const formattedHour = hour.toString().padStart(2, "0");
			const formattedMinute = minute.toString().padStart(2, "0");
			timeOptions.push(`${formattedHour}:${formattedMinute}`);
		}
	}

	// Check if the selected time slot is available
	const checkAvailability = async () => {
		if (!resource || !date || !startTime || !endTime) {
			toast({
				title: "Missing information",
				description: "Please select a date and time slot for your booking.",
				variant: "destructive",
			});
			return;
		}

		setAvailabilityStatus("checking");
		setLoading(true);

		try {
			// Format dates for the API
			const bookingDate = format(date, "yyyy-MM-dd");
			const startDateTime = `${bookingDate}T${startTime}:00`;
			const endDateTime = `${bookingDate}T${endTime}:00`;

			const result = await checkResourceAvailability(
				resource._id,
				startDateTime,
				endDateTime
			);

			if (result.available) {
				setAvailabilityStatus("available");
				toast({
					title: "Time slot is available!",
					description: "You can now proceed with your booking.",
				});
			} else {
				setAvailabilityStatus("unavailable");
				toast({
					title: "Time slot unavailable",
					description: "Please select a different time or date for your booking.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error checking availability:", error);
			toast({
				title: "Error checking availability",
				description: "Please try again later.",
				variant: "destructive",
			});
			setAvailabilityStatus("unchecked");
		} finally {
			setLoading(false);
		}
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!resource || !date || !startTime || !endTime || !title) {
			toast({
				title: "Missing information",
				description: "Please fill in all required fields.",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		try {
			// Check availability one more time to be safe
			const bookingDate = format(date, "yyyy-MM-dd");
			const startDateTime = `${bookingDate}T${startTime}:00`;
			const endDateTime = `${bookingDate}T${endTime}:00`;

			const availabilityResult = await checkResourceAvailability(
				resource._id,
				startDateTime,
				endDateTime
			);

			if (!availabilityResult.available) {
				toast({
					title: "Time slot is no longer available",
					description: "Please select a different time or date for your booking.",
					variant: "destructive",
				});
				setAvailabilityStatus("unavailable");
				setLoading(false);
				return;
			}

			// Get current user
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();

			if (!user) {
				toast({
					title: "Authentication error",
					description: "Please sign in to book a resource.",
					variant: "destructive",
				});
				setLoading(false);
				return;
			}

			// Create the booking
			const guestsNum = parseInt(guests, 10);
			await createResourceBooking({
				sanity_resource_id: resource._id,
				user_id: user.id,
				sanity_house_id: houseId,
				title,
				description,
				start_time: startDateTime,
				end_time: endDateTime,
				guests: isNaN(guestsNum) ? 0 : guestsNum
			});

			toast({
				title: "Booking confirmed!",
				description: `You have successfully booked ${resource.name}.`,
			});

			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error creating booking:", error);
			toast({
				title: "Error creating booking",
				description: "Please try again later.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Book {resource?.name}</DialogTitle>
					<DialogDescription>
						Fill out the details below to book this resource.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Title *
						</Label>
						<Input
							id="title"
							placeholder="Meeting, Event, etc."
							className="col-span-3"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="date" className="text-right">
							Date *
						</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date"
									variant={"outline"}
									className={cn(
										"col-span-3 justify-start text-left font-normal",
										!date && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									initialFocus
									disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="startTime" className="text-right">
							Start Time *
						</Label>
						<Select
							value={startTime}
							onValueChange={setStartTime}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select start time" />
							</SelectTrigger>
							<SelectContent>
								{timeOptions.map((time) => (
									<SelectItem key={time} value={time}>
										{time}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="endTime" className="text-right">
							End Time *
						</Label>
						<Select
							value={endTime}
							onValueChange={setEndTime}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select end time" />
							</SelectTrigger>
							<SelectContent>
								{timeOptions
									.filter((time) => startTime && time > startTime)
									.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="guests" className="text-right">
							Guests
						</Label>
						<Input
							id="guests"
							type="number"
							min="0"
							className="col-span-3"
							value={guests}
							onChange={(e) => setGuests(e.target.value)}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
							Description
						</Label>
						<Textarea
							id="description"
							placeholder="Details about your booking..."
							className="col-span-3"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						variant="outline"
						onClick={checkAvailability}
						disabled={!date || !startTime || !endTime || loading}
					>
						{availabilityStatus === "checking" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Check Availability
					</Button>
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={
							availabilityStatus !== "available" ||
							!title ||
							!date ||
							!startTime ||
							!endTime ||
							loading
						}
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Book Resource
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 