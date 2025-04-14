'use client';

import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthConfirmPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleConfirmation = async () => {
			const token = searchParams.get('token');
			const type = searchParams.get('type');
			const next = searchParams.get('next') || '/dashboard';

			if (!token) {
				setError('Missing token parameter');
				return;
			}

			try {
				const supabase = createClient();

				// Exchange the token for a session
				const { error } = await supabase.auth.verifyOtp({
					token_hash: token,
					type: 'email'
				});

				if (error) {
					console.error('Error verifying token:', error);
					setError(error.message);
					return;
				}

				// Successfully verified, redirect to the next page
				router.push(next);
			} catch (err) {
				console.error('Unexpected error:', err);
				setError('An unexpected error occurred');
			}
		};

		handleConfirmation();
	}, [router, searchParams]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md text-center">
				{error ? (
					<div className="p-6 bg-red-50 rounded-lg border border-red-200">
						<h2 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h2>
						<p className="text-red-600">{error}</p>
						<button
							onClick={() => router.push('/login')}
							className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
						>
							Return to Login
						</button>
					</div>
				) : (
					<div className="flex flex-col items-center">
						<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
						<h2 className="text-xl font-semibold">Verifying your email...</h2>
						<p className="text-muted-foreground mt-2">
							Please wait while we confirm your identity.
						</p>
					</div>
				)}
			</div>
		</div>
	);
} 