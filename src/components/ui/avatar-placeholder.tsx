import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarPlaceholderProps {
	name: string;
	size?: 'sm' | 'md' | 'lg';
	imageUrl?: string;
	className?: string;
}

export function AvatarPlaceholder({
	name,
	size = 'md',
	imageUrl,
	className
}: AvatarPlaceholderProps) {
	const initials = name
		.split(' ')
		.map(part => part[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);

	// Generate a deterministic hue based on the name (0-360)
	const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-14 h-14 text-lg'
	};

	return (
		<div
			className={cn(
				'relative rounded-full flex items-center justify-center overflow-hidden',
				sizeClasses[size],
				className
			)}
			style={{
				background: imageUrl ? 'transparent' : `hsla(${hue}, 60%, 45%, 1)`,
			}}
		>
			{imageUrl ? (
				<Image
					src={imageUrl}
					alt={name}
					fill
					className="object-cover"
				/>
			) : (
				<span className="font-semibold text-white">{initials}</span>
			)}
		</div>
	);
} 