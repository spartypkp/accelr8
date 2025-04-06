import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Forgot Password | Accelr8',
	description: 'Reset your Accelr8 account password',
};

export default function ForgotPasswordPage() {
	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
			<div className="mb-8 w-full max-w-md">
				<Link
					href="/login"
					className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to login
				</Link>
			</div>

			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold gradient-text">
						Forgot Password
					</h1>
					<p className="text-muted-foreground mt-2">We'll help you get back into your account</p>
				</div>

				<ForgotPasswordForm />
			</div>
		</div>
	);
} 