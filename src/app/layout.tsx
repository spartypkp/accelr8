import { AuthProvider } from "@/lib/auth/context";
import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
	title: "Accelr8 Dashboard",
	description: "Information hub for the Accelr8 hacker house",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className="antialiased bg-background text-foreground"
			>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
