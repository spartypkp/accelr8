"use client";

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from '../supabase/client';

/**
 * Hook to get the current user in client components
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		// Set user if already authenticated
		setLoading(true);
		supabase.auth.getUser().then(({ data, error }) => {
			if (!error && data?.user) {
				setUser(data.user);
			}
			setLoading(false);
		});

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
				setLoading(false);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return { user, loading };
} 