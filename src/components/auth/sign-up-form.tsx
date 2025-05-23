'use client';

import { useUser } from '@/hooks/UserContext';
import Link from 'next/link';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Password validation helper
const validatePassword = (password: string): { valid: boolean; message: string; } => {
	// Minimum 8 characters
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters' };
	}

	// At least one uppercase letter
	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter' };
	}

	// At least one lowercase letter
	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter' };
	}

	// At least one number
	if (!/[0-9]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one number' };
	}

	// At least one special character
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one special character' };
	}

	return { valid: true, message: '' };
};

export function SignUpForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { signUp } = useUser();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		// Advanced password validation
		const passwordCheck = validatePassword(password);
		if (!passwordCheck.valid) {
			setError(passwordCheck.message);
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { error } = await signUp(email, password);

			if (error) {
				setError(error.message);
				return;
			}

			// Successful registration
			setSuccess(true);
			setEmail('');
			setPassword('');
			setConfirmPassword('');
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
				<CardTitle className="text-2xl text-center">Create an Account</CardTitle>
				<CardDescription className="text-center">
					Join Accelr8 to access house resources and community features
				</CardDescription>
			</CardHeader>
			<CardContent>
				{success ? (
					<Alert className="bg-green-50 text-green-800 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertTitle>Registration Successful</AlertTitle>
						<AlertDescription>
							Please check your email to verify your account. Then you can{' '}
							<Link href="/login" className="font-medium text-green-700 hover:text-green-800">
								sign in
							</Link>.
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

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Min 8 characters with letters, numbers & symbols"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
							<p className="text-xs text-gray-500">
								Password must be at least 8 characters and include uppercase, lowercase,
								numbers, and special characters.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Creating account...' : 'Create Account'}
						</Button>
					</form>
				)}
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-center">
					Already have an account?{' '}
					<Link
						href="/login"
						className="text-blue-500 hover:text-blue-600 font-medium"
					>
						Sign in
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
} 