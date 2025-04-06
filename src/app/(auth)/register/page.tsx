import { SignUpForm } from '@/components/auth/sign-up-form';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Register | Accelr8',
	description: 'Create a new account for Accelr8',
};

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
			<div className="mb-8 w-full max-w-md">
				<Link
					href="/"
					className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to home
				</Link>
			</div>

			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold gradient-text">
						Join Accelr8
					</h1>
					<p className="text-muted-foreground mt-2">Create your account to get started</p>
				</div>

				<SignUpForm />
			</div>
		</div>
	);
} 