import {
	ToastActionElement,
	ToastProvider,
	ToastViewport, useToast as useToastImpl
} from "@/components/ui/toast";

export interface ToastOptions {
	title?: string;
	description?: string;
	action?: ToastActionElement;
	variant?: "default" | "destructive";
}

export const useToast = () => {
	const { toast } = useToastImpl();

	return {
		toast: (options: ToastOptions) => {
			toast({
				title: options.title,
				description: options.description,
				action: options.action,
				variant: options.variant ?? undefined,
			});
		},
	};
};

export { ToastProvider, ToastViewport };
