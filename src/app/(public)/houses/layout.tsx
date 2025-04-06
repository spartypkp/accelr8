import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Our Houses | Accelr8",
	description: "Explore our network of Accelr8 hacker houses designed for founders and innovators.",
};

export default function HousesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
} 