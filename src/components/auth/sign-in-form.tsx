'use client';

import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signIn } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await signIn(email, password);

			if (error) {
				setError(error.message);
				return;
			}

			// Successful login
			router.push('/dashboard');
			router.refresh();
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
				<CardTitle className="text-2xl text-center">Sign In</CardTitle>
				<CardDescription className="text-center">
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
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

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/forgot-password"
								className="text-sm text-blue-500 hover:text-blue-600"
							>
								Forgot password?
							</Link>
						</div>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-center">
					Don't have an account?{' '}
					<Link
						href="/register"
						className="text-blue-500 hover:text-blue-600 font-medium"
					>
						Sign up
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
} 