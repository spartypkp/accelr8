'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
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
		{ name: 'Houses', href: '/houses' },
		{ name: 'Our Story', href: '/story' },
		{ name: 'Services', href: '/services' },
		{ name: 'Media', href: '/media' },
	];

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navigation */}
			<header
				className={cn(
					"fixed top-0 w-full z-50 transition-all duration-300 border-b border-primary/30 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent after:animate-border-flow",
					isScrolled
						? "bg-background/90 backdrop-blur-md shadow-lg"
						: "bg-background/40 backdrop-blur-sm"
				)}
			>
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center">
							<Image src="/logo.png" alt="Accelr8 Logo" width={200} height={200} />
							{/* <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
								Accelr8
							</span> */}
						</Link>

						{/* Desktop Navigation - Split with Apply in the middle */}
						<nav className="hidden md:flex items-center space-x-8">
							{/* First two nav items */}
							<div className="flex items-center space-x-8">
								{navItems.slice(0, 2).map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"text-base font-medium transition-colors hover:text-primary",
											pathname === item.href
												? "text-primary"
												: "text-foreground"
										)}
									>
										{item.name}
									</Link>
								))}
							</div>

							{/* Highlighted Apply Button */}
							<Button asChild variant="outline" className="font-medium text-base px-8 py-6 border-2 border-primary hover:bg-primary/10 hover:text-primary">
								<Link href="/apply">
									Apply Now
								</Link>
							</Button>

							{/* Last two nav items */}
							<div className="flex items-center space-x-8">
								{navItems.slice(2, 4).map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"text-base font-medium transition-colors hover:text-primary",
											pathname === item.href
												? "text-primary"
												: "text-foreground"
										)}
									>
										{item.name}
									</Link>
								))}
							</div>
						</nav>

						{/* Auth or Dashboard buttons */}
						<div className="hidden md:flex items-center space-x-4">
							{user ? (
								<Button asChild variant="outline" className="text-base px-6 py-5">
									<Link href="/dashboard">Dashboard</Link>
								</Button>
							) : (
								<Button asChild variant="default" className="text-base px-6 py-5 bg-gradient-primary">
									<Link href="/login">Login</Link>
								</Button>
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
											<span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
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
													"text-base font-medium transition-colors hover:text-primary",
													pathname === item.href
														? "text-primary"
														: "text-muted-foreground"
												)}
											>
												{item.name}
											</Link>
										))}
										{/* Highlighted Apply Button for Mobile */}
										<Link
											href="/apply"
											className="text-base font-bold text-primary border-2 border-primary rounded-md py-2 px-4 text-center hover:bg-primary/10"
										>
											Apply Now
										</Link>
									</nav>

									<div className="mt-auto border-t pt-4 flex flex-col space-y-4">
										{user ? (
											<Button asChild>
												<Link href="/dashboard">Dashboard</Link>
											</Button>
										) : (
											<Button asChild className="bg-gradient-primary">
												<Link href="/login">Login</Link>
											</Button>
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
			<footer className="bg-muted border-t border-border">
				<div className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
								Accelr8
							</h3>
							<p className="text-muted-foreground mb-4">
								Accelerating innovation through community, collaboration, and shared living spaces.
							</p>
						</div>

						<div>
							<h4 className="text-foreground font-medium mb-4">Navigation</h4>
							<ul className="space-y-2">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-muted-foreground hover:text-primary transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
								<li>
									<Link
										href="/apply"
										className="text-primary font-medium hover:text-primary/80 transition-colors"
									>
										Apply Now
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-foreground font-medium mb-4">Legal</h4>
							<ul className="space-y-2">
								<li>
									<Link
										href="/privacy-policy"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/terms-of-service"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										Terms of Service
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-foreground font-medium mb-4">Connect</h4>
							<address className="not-italic text-muted-foreground space-y-2">
								<p>1551 Larkin Street</p>
								<p>San Francisco, CA 94109</p>
								<p>
									<a
										href="mailto:hello@accelr8.io"
										className="hover:text-primary transition-colors"
									>
										hello@accelr8.io
									</a>
								</p>
							</address>
						</div>
					</div>

					<div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} Accelr8. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

// Add at the bottom of the file - animation keyframe for the border flow
const styles = `
@keyframes borderFlow {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

:root {
  --animation-duration: 3s;
}

.animate-border-flow {
  background-size: 200% 100%;
  animation: borderFlow var(--animation-duration) linear infinite;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
	const styleElement = document.createElement('style');
	styleElement.textContent = styles;
	document.head.appendChild(styleElement);
} 