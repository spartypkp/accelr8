import { UserProvider } from '@/hooks/UserContext';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<UserProvider>
			<div className="min-h-screen bg-gray-50">
				{children}
			</div>
		</UserProvider>
	);
} 