import { Metadata } from "next";

export const metadata: Metadata = {
	title: "House Information | Accelr8 Dashboard",
	description: "House information, rules, amenities and FAQs for residents",
};

export default function HouseInfoLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
} 