import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Resident Dashboard | Accelr8",
	description: "Manage your stay at Accelr8",
};

export default function ResidentLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { houseId: string; };
}) {
	return (
		<div className="container mx-auto p-4">
			{children}
		</div>
	);
} 