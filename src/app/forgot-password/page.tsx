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
		<div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 flex flex-col items-center justify-center p-4">
			<div className="mb-8 w-full max-w-md">
				<Link
					href="/login"
					className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to login
				</Link>
			</div>

			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
						Forgot Password
					</h1>
					<p className="text-gray-400 mt-2">We'll help you get back into your account</p>
				</div>

				<ForgotPasswordForm />
			</div>
		</div>
	);
} 