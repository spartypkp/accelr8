'use client';

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
	const router = useRouter();
	const { user, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading) {
			// If user is authenticated, redirect to the San Francisco house dashboard (or other default)
			// In a real app, this would check the user's assigned house from the database
			if (user) {
				router.push('/dashboard/sf');
			} else {
				// If not authenticated, redirect to login
				router.push('/login?redirect=/dashboard');
			}
		}
	}, [user, isLoading, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<h2 className="text-xl font-medium text-gray-200">Loading your dashboard...</h2>
				<p className="text-gray-400 mt-2">Please wait while we redirect you to your house dashboard.</p>
			</div>
		</div>
	);
} 