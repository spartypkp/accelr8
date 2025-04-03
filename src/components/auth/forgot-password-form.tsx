'use client';

import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { resetPassword } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { error } = await resetPassword(email);

			if (error) {
				setError(error.message);
				return;
			}

			// Successful password reset request
			setSuccess(true);
		} catch (err) {
			setError('An unexpected error occurred');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl text-center">Reset Password</CardTitle>
				<CardDescription className="text-center">
					Enter your email address and we'll send you a link to reset your password
				</CardDescription>
			</CardHeader>
			<CardContent>
				{success ? (
					<Alert className="bg-green-50 text-green-800 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertTitle>Email Sent</AlertTitle>
						<AlertDescription>
							If an account with this email exists, we've sent instructions to reset your password.
							Please check your inbox.
						</AlertDescription>
					</Alert>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Sending reset link...' : 'Send Reset Link'}
						</Button>
					</form>
				)}
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-center">
					Remember your password?{' '}
					<Link
						href="/login"
						className="text-blue-500 hover:text-blue-600 font-medium"
					>
						Back to login
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
} 