
export default async function DashboardHomePage() {
	// Redirecting will be handled by layout.tsx
	// This page serves as a fallback for any user that hasn't been redirected by the layout

	// Display a message for users landing on this page
	return (
		<div className="container mx-auto py-8">
			<h2 className="text-2xl font-bold mb-4">Welcome to Accelr8</h2>
			<p className="text-gray-500 mb-6">
				Redirecting you to the appropriate dashboard...
			</p>
			<div className="animate-pulse bg-gray-200 h-4 w-48 rounded mb-2"></div>
			<div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
		</div>
	);
} 