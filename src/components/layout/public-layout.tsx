'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PublicLayoutProps {
	children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();
	const { user } = useAuth();

	// Handle scrolling effect for the navigation
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navItems = [
		{ name: 'About', href: '/about' },
		{ name: 'Houses', href: '/houses' },
		{ name: 'Events', href: '/events' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Apply', href: '/apply' },
		{ name: 'Contact', href: '/contact' },
	];

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navigation */}
			<header
				className={cn(
					"fixed top-0 w-full z-50 transition-all duration-300",
					isScrolled
						? "bg-gray-950/90 backdrop-blur-md shadow-lg"
						: "bg-transparent"
				)}
			>
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center">
							<span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Accelr8
							</span>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-blue-400",
										pathname === item.href
											? "text-blue-500"
											: "text-gray-300"
									)}
								>
									{item.name}
								</Link>
							))}
						</nav>

						{/* Auth or Dashboard buttons */}
						<div className="hidden md:flex items-center space-x-4">
							{user ? (
								<Button asChild variant="outline">
									<Link href="/dashboard">Dashboard</Link>
								</Button>
							) : (
								<>
									<Button asChild variant="ghost">
										<Link href="/login">Login</Link>
									</Button>
									<Button asChild>
										<Link href="/register">Join Now</Link>
									</Button>
								</>
							)}
						</div>

						{/* Mobile Menu Button */}
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden">
									<Menu className="h-6 w-6" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right">
								<div className="flex flex-col h-full">
									<div className="flex items-center justify-between pb-4 border-b">
										<Link href="/" className="flex items-center">
											<span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
												Accelr8
											</span>
										</Link>
										<SheetTrigger asChild>
											<Button variant="ghost" size="icon">
												<X className="h-5 w-5" />
												<span className="sr-only">Close menu</span>
											</Button>
										</SheetTrigger>
									</div>

									<nav className="flex flex-col space-y-6 py-6">
										{navItems.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className={cn(
													"text-base font-medium transition-colors hover:text-blue-400",
													pathname === item.href
														? "text-blue-500"
														: "text-gray-300"
												)}
											>
												{item.name}
											</Link>
										))}
									</nav>

									<div className="mt-auto border-t pt-4 flex flex-col space-y-4">
										{user ? (
											<Button asChild>
												<Link href="/dashboard">Dashboard</Link>
											</Button>
										) : (
											<>
												<Button asChild variant="outline">
													<Link href="/login">Login</Link>
												</Button>
												<Button asChild>
													<Link href="/register">Join Now</Link>
												</Button>
											</>
										)}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-gray-950 border-t border-gray-800">
				<div className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
								Accelr8
							</h3>
							<p className="text-gray-400 mb-4">
								Accelerating innovation through community, collaboration, and shared living spaces.
							</p>
						</div>

						<div>
							<h4 className="text-white font-medium mb-4">Navigation</h4>
							<ul className="space-y-2">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-gray-400 hover:text-blue-400 transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h4 className="text-white font-medium mb-4">Legal</h4>
							<ul className="space-y-2">
								<li>
									<Link
										href="/privacy-policy"
										className="text-gray-400 hover:text-blue-400 transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/terms-of-service"
										className="text-gray-400 hover:text-blue-400 transition-colors"
									>
										Terms of Service
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-white font-medium mb-4">Connect</h4>
							<address className="not-italic text-gray-400 space-y-2">
								<p>1551 Larkin Street</p>
								<p>San Francisco, CA 94109</p>
								<p>
									<a
										href="mailto:hello@accelr8.io"
										className="hover:text-blue-400 transition-colors"
									>
										hello@accelr8.io
									</a>
								</p>
							</address>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
						&copy; {new Date().getFullYear()} Accelr8. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
} 