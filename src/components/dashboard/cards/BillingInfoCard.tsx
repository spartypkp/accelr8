import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { CreditCard, DollarSign, Receipt, Shield } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { DashboardCard } from "./dashboard-card";

interface Payment {
	id: string;
	amount: number;
	date: string;
	status: "paid" | "pending" | "failed";
	description: string;
}

interface BillingInfo {
	nextPayment: {
		amount: number;
		date: string;
		daysRemaining: number;
	};
	payments: Payment[];
	accountStatus: "active" | "past_due" | "inactive";
	paymentMethod: {
		type: "credit_card" | "bank_account" | "other";
		last4: string;
		expiry?: string;
	};
}

interface BillingInfoCardProps {
	houseId: string;
	userId: string;
	className?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, houseId, userId] = url.split('/').slice(-3);

	// In a real implementation, this would fetch from Supabase
	// For now, return mock data
	const mockBillingInfo: BillingInfo = {
		nextPayment: {
			amount: 2500,
			date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days in the future
			daysRemaining: 10
		},
		payments: [
			{
				id: "pay_123456",
				amount: 2500,
				date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
				status: "paid",
				description: "Monthly rent payment"
			},
			{
				id: "pay_123455",
				amount: 2500,
				date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
				status: "paid",
				description: "Monthly rent payment"
			},
			{
				id: "pay_123454",
				amount: 150,
				date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
				status: "paid",
				description: "Event space rental"
			}
		],
		accountStatus: "active",
		paymentMethod: {
			type: "credit_card",
			last4: "4242",
			expiry: "04/24"
		}
	};

	return mockBillingInfo;
};

export function BillingInfoCard({ houseId, userId, className }: BillingInfoCardProps) {
	const { data, error, isLoading } = useSWR<BillingInfo>(
		`/api/billing/${houseId}/${userId}`,
		fetcher
	);

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	};

	// Get status styles
	const getStatusStyles = (status: Payment['status']) => {
		switch (status) {
			case 'paid':
				return 'text-green-500 bg-green-500/10';
			case 'pending':
				return 'text-amber-500 bg-amber-500/10';
			case 'failed':
				return 'text-red-500 bg-red-500/10';
			default:
				return 'text-gray-500 bg-gray-500/10';
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	};

	return (
		<DashboardCard
			title="Billing Information"
			titleIcon={<DollarSign className="h-4 w-4" />}
			isLoading={isLoading}
			error={error}
			className={className}
			fullHeight
		>
			{data ? (
				<div className="space-y-4">
					{/* Next Payment Summary */}
					<div className="bg-primary/5 rounded-lg p-4">
						<h3 className="text-sm font-medium mb-2">Next Payment Due</h3>
						<div className="flex items-end justify-between mb-1">
							<span className="text-2xl font-bold">{formatCurrency(data.nextPayment.amount)}</span>
							<span className="text-sm text-muted-foreground">{formatDate(data.nextPayment.date)}</span>
						</div>
						<div className="mt-3">
							<div className="flex justify-between text-xs mb-1">
								<span>Days remaining</span>
								<span>{data.nextPayment.daysRemaining} days</span>
							</div>
							<Progress value={30 - data.nextPayment.daysRemaining > 0 ? 30 - data.nextPayment.daysRemaining : 0} max={30} className="h-1.5" />
						</div>
					</div>

					{/* Payment Method */}
					<div className="p-3 border rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<CreditCard className="h-5 w-5 mr-2 text-primary" />
								<div>
									<p className="text-sm font-medium">
										{data.paymentMethod.type === 'credit_card' ? 'Credit Card' :
											data.paymentMethod.type === 'bank_account' ? 'Bank Account' : 'Other'}
									</p>
									<p className="text-xs text-muted-foreground">
										{data.paymentMethod.type === 'credit_card' ?
											`•••• ${data.paymentMethod.last4}${data.paymentMethod.expiry ? ` • Expires ${data.paymentMethod.expiry}` : ''}` :
											`•••• ${data.paymentMethod.last4}`}
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm">Update</Button>
						</div>
					</div>

					{/* Recent Payments */}
					<div>
						<h3 className="text-sm font-medium mb-2">Recent Payments</h3>
						<div className="space-y-2">
							{data.payments.slice(0, 3).map(payment => (
								<div key={payment.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
									<div className="flex items-center">
										<div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-3", getStatusStyles(payment.status))}>
											<Receipt className="h-4 w-4" />
										</div>
										<div>
											<p className="text-sm font-medium">{payment.description}</p>
											<p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
										</div>
									</div>
									<div className="flex items-center">
										<span className="font-medium">{formatCurrency(payment.amount)}</span>
										<div className={cn("text-xs px-2 py-0.5 rounded-full ml-2", getStatusStyles(payment.status))}>
											{payment.status === 'paid' ? 'Paid' :
												payment.status === 'pending' ? 'Pending' : 'Failed'}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Account Status */}
					<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
						<div className="flex items-center">
							<Shield className={cn("h-5 w-5 mr-2",
								data.accountStatus === 'active' ? 'text-green-500' :
									data.accountStatus === 'past_due' ? 'text-amber-500' : 'text-red-500')} />
							<div>
								<p className="text-sm font-medium">Account Status</p>
								<p className={cn("text-xs",
									data.accountStatus === 'active' ? 'text-green-500' :
										data.accountStatus === 'past_due' ? 'text-amber-500' : 'text-red-500')}>
									{data.accountStatus === 'active' ? 'Active' :
										data.accountStatus === 'past_due' ? 'Past Due' : 'Inactive'}
								</p>
							</div>
						</div>
					</div>

					{/* Footer Button */}
					<Button variant="outline" size="sm" className="w-full" asChild>
						<Link href={`/dashboard/${houseId}/billing`}>
							View Full Billing History
						</Link>
					</Button>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-40 text-center">
					<DollarSign className="h-10 w-10 text-muted-foreground/60 mb-2" />
					<p className="text-sm text-muted-foreground">No billing information available</p>
					<Button variant="outline" size="sm" className="mt-4" asChild>
						<Link href={`/dashboard/${houseId}/billing`}>
							Set Up Payment Method
						</Link>
					</Button>
				</div>
			)}
		</DashboardCard>
	);
} 