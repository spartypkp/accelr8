'use client';

import { BillingInfoCard } from "@/components/dashboard/cards/BillingInfoCard";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import {
	BanknoteIcon,
	CreditCard,
	Download,
	FileText,
	Filter,
	Landmark,
	PlusCircle,
	Receipt,
	Search
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock data for billing information
const mockBillingData = {
	subscription: {
		plan: "Standard Residency",
		amount: 2200,
		status: "Active",
		nextBillingDate: "2023-08-01",
		paymentMethod: "Visa ending in 4242",
		autopay: true
	},
	currentBalance: {
		amount: 0,
		dueDate: "2023-08-01"
	},
	invoices: [
		{
			id: "INV-2023-07",
			date: "2023-07-01",
			dueDate: "2023-07-01",
			amount: 2200,
			status: "Paid",
			items: [
				{ description: "Monthly Rent", amount: 2000 },
				{ description: "Utilities", amount: 150 },
				{ description: "Community Fee", amount: 50 }
			],
			paidOn: "2023-07-01",
			paidWith: "Visa ending in 4242"
		},
		{
			id: "INV-2023-06",
			date: "2023-06-01",
			dueDate: "2023-06-01",
			amount: 2200,
			status: "Paid",
			items: [
				{ description: "Monthly Rent", amount: 2000 },
				{ description: "Utilities", amount: 150 },
				{ description: "Community Fee", amount: 50 }
			],
			paidOn: "2023-06-01",
			paidWith: "Visa ending in 4242"
		},
		{
			id: "INV-2023-05",
			date: "2023-05-01",
			dueDate: "2023-05-01",
			amount: 2200,
			status: "Paid",
			items: [
				{ description: "Monthly Rent", amount: 2000 },
				{ description: "Utilities", amount: 150 },
				{ description: "Community Fee", amount: 50 }
			],
			paidOn: "2023-05-01",
			paidWith: "Visa ending in 4242"
		},
		{
			id: "INV-2023-04",
			date: "2023-04-01",
			dueDate: "2023-04-01",
			amount: 2200,
			status: "Paid",
			items: [
				{ description: "Monthly Rent", amount: 2000 },
				{ description: "Utilities", amount: 150 },
				{ description: "Community Fee", amount: 50 }
			],
			paidOn: "2023-04-03",
			paidWith: "Visa ending in 4242",
			latePayment: true
		}
	],
	paymentMethods: [
		{
			id: "pm_1",
			type: "card",
			brand: "visa",
			last4: "4242",
			expMonth: 12,
			expYear: 2025,
			isDefault: true
		},
		{
			id: "pm_2",
			type: "bank",
			bankName: "Chase",
			last4: "6789",
			isDefault: false
		}
	],
	moveInDate: "2023-01-15",
	leaseEndDate: "2023-12-31",
	securityDeposit: 1000,
	pendingCharges: []
};

export default function BillingPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
	const [userId, setUserId] = useState<string>("");

	// Get current user ID
	useState(() => {
		const fetchUserId = async () => {
			const supabase = createClient();
			const { data } = await supabase.auth.getUser();
			if (data.user) {
				setUserId(data.user.id);
			}
		};
		fetchUserId();
	});

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Billing & Payments</h1>
					<p className="text-muted-foreground">{houseName}</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<Button variant="outline" size="sm">
						<CreditCard className="h-4 w-4 mr-2" />
						Manage Payment Methods
					</Button>
					<Button size="sm">
						<BanknoteIcon className="h-4 w-4 mr-2" />
						Make a Payment
					</Button>
				</div>
			</div>

			{/* Card Overview Section */}
			<DashboardPanel className="mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{/* Billing Info Card */}
					<BillingInfoCard houseId={houseId} userId={userId} />

					{/* Lease Details Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Lease Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<p className="text-sm text-muted-foreground">Move-in Date</p>
										<p className="font-medium">{formatDate(mockBillingData.moveInDate)}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Lease End Date</p>
										<p className="font-medium">{formatDate(mockBillingData.leaseEndDate)}</p>
									</div>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">Security Deposit</p>
									<p className="font-medium">{formatCurrency(mockBillingData.securityDeposit)}</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">Monthly Rent</p>
									<p className="font-medium">{formatCurrency(mockBillingData.subscription.amount)}</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="border-t pt-4">
							<Button variant="outline" size="sm" className="w-full">
								<FileText className="h-4 w-4 mr-2" />
								View Lease Agreement
							</Button>
						</CardFooter>
					</Card>

					{/* Payment Methods Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Payment Methods</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{mockBillingData.paymentMethods.map(method => (
									<div key={method.id} className={`p-3 rounded-lg border ${method.isDefault ? 'bg-primary/5 border-primary/20' : ''}`}>
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												{method.type === 'card' ? (
													<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
														<CreditCard className="h-4 w-4 text-primary" />
													</div>
												) : (
													<div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
														<Landmark className="h-4 w-4 text-blue-500" />
													</div>
												)}
												<div>
													<p className="font-medium text-sm">
														{method.type === 'card' ?
															`${method.brand ? method.brand.charAt(0).toUpperCase() + method.brand.slice(1) : 'Card'} •••• ${method.last4}` :
															`${method.bankName} •••• ${method.last4}`}
													</p>
													{method.type === 'card' && (
														<p className="text-xs text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
													)}
												</div>
											</div>
											{method.isDefault && (
												<Badge variant="outline" className="bg-primary/5">Default</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter className="border-t pt-4">
							<Button size="sm" className="w-full">
								<PlusCircle className="h-4 w-4 mr-2" />
								Add Payment Method
							</Button>
						</CardFooter>
					</Card>
				</div>
			</DashboardPanel>

			{/* Invoices & Payments */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Invoices & Payments</h2>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search invoices..." className="pl-9 w-[200px] md:w-[300px]" />
						</div>
						<Button variant="outline" size="sm">
							<Filter className="h-4 w-4 mr-2" />
							Filter
						</Button>
					</div>
				</div>

				<Tabs defaultValue="all" className="w-full">
					<TabsList className="w-full md:w-auto">
						<TabsTrigger value="all">All Transactions</TabsTrigger>
						<TabsTrigger value="invoices">Invoices</TabsTrigger>
						<TabsTrigger value="payments">Payments</TabsTrigger>
					</TabsList>
					<TabsContent value="all" className="mt-4">
						<Card>
							<CardContent className="p-0">
								<div className="relative overflow-x-auto">
									<table className="w-full text-sm text-left">
										<thead className="text-xs uppercase bg-muted">
											<tr>
												<th className="px-6 py-3">Date</th>
												<th className="px-6 py-3">Description</th>
												<th className="px-6 py-3">Invoice ID</th>
												<th className="px-6 py-3">Status</th>
												<th className="px-6 py-3 text-right">Amount</th>
												<th className="px-6 py-3 text-right">Actions</th>
											</tr>
										</thead>
										<tbody>
											{mockBillingData.invoices.map((invoice) => (
												<tr key={invoice.id} className="bg-card border-b hover:bg-muted/50">
													<td className="px-6 py-4 whitespace-nowrap">
														{formatDate(invoice.date)}
													</td>
													<td className="px-6 py-4">
														Monthly Rent and Fees
													</td>
													<td className="px-6 py-4 font-medium">
														{invoice.id}
													</td>
													<td className="px-6 py-4">
														<Badge className={invoice.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}>
															{invoice.status}
														</Badge>
													</td>
													<td className="px-6 py-4 text-right">
														{formatCurrency(invoice.amount)}
													</td>
													<td className="px-6 py-4 text-right">
														<Button variant="ghost" size="sm">
															<Download className="h-4 w-4" />
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="invoices" className="mt-4">
						<Card>
							<CardContent className="p-0">
								<div className="text-center p-8">
									<FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
									<h3 className="text-lg font-medium mb-1">No Custom Invoices</h3>
									<p className="text-muted-foreground">You haven't received any custom invoices yet.</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="payments" className="mt-4">
						<Card>
							<CardContent className="p-0">
								<div className="relative overflow-x-auto">
									<table className="w-full text-sm text-left">
										<thead className="text-xs uppercase bg-muted">
											<tr>
												<th className="px-6 py-3">Date</th>
												<th className="px-6 py-3">Payment Method</th>
												<th className="px-6 py-3">Description</th>
												<th className="px-6 py-3 text-right">Amount</th>
												<th className="px-6 py-3 text-right">Receipt</th>
											</tr>
										</thead>
										<tbody>
											{mockBillingData.invoices.map((invoice) => (
												<tr key={invoice.id} className="bg-card border-b hover:bg-muted/50">
													<td className="px-6 py-4 whitespace-nowrap">
														{invoice.paidOn ? formatDate(invoice.paidOn) : formatDate(invoice.date)}
													</td>
													<td className="px-6 py-4">
														{invoice.paidWith || 'Visa ending in 4242'}
													</td>
													<td className="px-6 py-4">
														Payment for {invoice.id}
													</td>
													<td className="px-6 py-4 text-right">
														{formatCurrency(invoice.amount)}
													</td>
													<td className="px-6 py-4 text-right">
														<Button variant="ghost" size="sm">
															<Receipt className="h-4 w-4" />
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
} 