import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Register | Accelr8',
	description: 'Create a new account for Accelr8',
};

export default function RegisterPage() {
	// Redirect to apply page
	redirect('/apply');

	// The code below will not execute due to the redirect
	return null;
} 