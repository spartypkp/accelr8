import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin Dashboard | Accelr8",
	description: "Manage your house at Accelr8",
};

export default function AdminLayout({
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