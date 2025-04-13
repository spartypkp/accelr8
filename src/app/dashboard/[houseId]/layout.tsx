import { HouseProvider } from "@/hooks/HouseContext";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "House Dashboard | Accelr8",
	description: "Manage and view your Accelr8 house"
};

export default function HouseLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { houseId: string; };
}) {
	return (
		<HouseProvider>
			{children}
		</HouseProvider>
	);
} 