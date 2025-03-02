import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProfilePictureProps {
	name: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	imageUrl?: string;
	className?: string;
	square?: boolean;
	showBorder?: boolean;
}

export function ProfilePicture({
	name,
	size = 'md',
	imageUrl,
	className,
	square = false,
	showBorder = true,
}: ProfilePictureProps) {
	const initials = name
		.split(' ')
		.map(part => part[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);

	// Generate a deterministic hue based on the name (0-360)
	const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

	const sizeClasses = {
		sm: 'w-10 h-10 text-xs',
		md: 'w-16 h-16 text-sm',
		lg: 'w-24 h-24 text-lg',
		xl: 'w-32 h-32 text-xl'
	};

	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			className={cn(
				'relative flex items-center justify-center overflow-hidden',
				square ? 'rounded-lg' : 'rounded-full',
				showBorder && 'ring-2 ring-white/10',
				sizeClasses[size],
				className
			)}
			style={{
				background: imageUrl ? 'transparent' : `linear-gradient(45deg, hsla(${hue}, 70%, 45%, 1), hsla(${hue + 40}, 80%, 50%, 1))`,
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
				<div className="absolute inset-0 flex items-center justify-center">
					<div
						className="absolute inset-0 opacity-20"
						style={{
							backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)'
						}}
					/>
					<span className="font-bold text-white z-10">{initials}</span>
				</div>
			)}
		</motion.div>
	);
} 