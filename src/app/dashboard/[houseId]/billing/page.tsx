'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BanknoteIcon,
	CreditCard,
	Download,
	FileText,
	Filter,
	Landmark,
	PlusCircle,
	Receipt,
	Search,
	Shield,
	UploadIcon
} from "lucide-react";
import Link from "next/link";
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
		<DashboardLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Billing & Payments</h1>
						<p className="text-gray-500 dark:text-gray-400">{houseName}</p>
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

				{/* Account Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card className="md:col-span-2">
						<CardHeader className="pb-2">
							<CardTitle className="text-xl">Account Overview</CardTitle>
							<CardDescription>
								Current subscription and payment details
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
									<div className="flex items-center mt-1">
										<p className="text-lg font-bold">{mockBillingData.subscription.plan}</p>
										<Badge className="ml-2" variant="outline">{mockBillingData.subscription.status}</Badge>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Payment</p>
									<p className="text-lg font-bold">
										{formatCurrency(mockBillingData.subscription.amount)}
									</p>
									<p className="text-sm text-gray-500">
										Due on {formatDate(mockBillingData.subscription.nextBillingDate)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
									<div className="flex items-center mt-1">
										<CreditCard className="h-4 w-4 mr-2 text-gray-500" />
										<p>{mockBillingData.subscription.paymentMethod}</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Cycle</p>
									<p>Monthly (1st of each month)</p>
								</div>
							</div>

							<div className="border-t pt-4 mt-2">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">AutoPay</p>
										<p>{mockBillingData.subscription.autopay ? 'Enabled' : 'Disabled'}</p>
									</div>
									<Button variant="outline" size="sm">
										{mockBillingData.subscription.autopay ? 'Disable' : 'Enable'} AutoPay
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-xl">Current Balance</CardTitle>
							<CardDescription>Amount due for your next bill</CardDescription>
						</CardHeader>
						<CardContent className="pt-2">
							<div className="flex flex-col items-center justify-center h-32">
								<p className="text-3xl font-bold mb-2">
									{formatCurrency(mockBillingData.currentBalance.amount)}
								</p>
								<p className="text-gray-500 dark:text-gray-400">
									{mockBillingData.currentBalance.amount === 0
										? "No payment due at this time"
										: `Due on ${formatDate(mockBillingData.currentBalance.dueDate)}`}
								</p>
							</div>
						</CardContent>
						{mockBillingData.currentBalance.amount > 0 && (
							<CardFooter>
								<Button className="w-full">
									<BanknoteIcon className="h-4 w-4 mr-2" />
									Pay Now
								</Button>
							</CardFooter>
						)}
					</Card>
				</div>

				{/* Lease Info Card */}
				<Card className="mb-6">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl">Lease Information</CardTitle>
						<CardDescription>Details about your current lease agreement</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Move-In Date</p>
								<p className="text-lg font-bold">{formatDate(mockBillingData.moveInDate)}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lease End Date</p>
								<p className="text-lg font-bold">{formatDate(mockBillingData.leaseEndDate)}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Security Deposit</p>
								<p className="text-lg font-bold">{formatCurrency(mockBillingData.securityDeposit)}</p>
							</div>
						</div>

						<div className="flex justify-end">
							<Button variant="outline" className="text-sm">
								<FileText className="h-4 w-4 mr-2" />
								View Lease Agreement
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Payment History & Methods */}
				<Tabs defaultValue="history" className="space-y-6">
					<TabsList className="bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="history">Payment History</TabsTrigger>
						<TabsTrigger value="methods">Payment Methods</TabsTrigger>
						<TabsTrigger value="documents">Billing Documents</TabsTrigger>
					</TabsList>

					{/* Payment History Tab */}
					<TabsContent value="history">
						<Card>
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between">
									<div>
										<CardTitle>Payment History</CardTitle>
										<CardDescription>View your payment records and invoices</CardDescription>
									</div>
									<div className="flex items-center mt-4 md:mt-0">
										<Button variant="outline" size="sm" className="mr-2">
											<Filter className="h-4 w-4 mr-2" />
											Filter
										</Button>
										<div className="relative">
											<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
											<Input
												placeholder="Search invoices..."
												className="pl-8 w-[200px] h-9"
											/>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<div className="grid grid-cols-5 bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium">
										<div>Date</div>
										<div>Invoice ID</div>
										<div>Amount</div>
										<div className="text-right">Status</div>
										<div className="text-right">Actions</div>
									</div>
									{mockBillingData.invoices.map((invoice) => (
										<div
											key={invoice.id}
											className="grid grid-cols-5 p-3 text-sm border-t hover:bg-gray-50 dark:hover:bg-gray-800/50"
										>
											<div>{formatDate(invoice.date)}</div>
											<div>{invoice.id}</div>
											<div>{formatCurrency(invoice.amount)}</div>
											<div className="text-right">
												<Badge
													variant={invoice.status === "Paid" ? "outline" : "default"}
													className={invoice.latePayment ? "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100" : ""}
												>
													{invoice.status}{invoice.latePayment ? " (Late)" : ""}
												</Badge>
											</div>
											<div className="flex justify-end space-x-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setSelectedInvoice(invoice.id === selectedInvoice ? null : invoice.id)}
												>
													View
												</Button>
												<Button variant="ghost" size="sm">
													<Download className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>

								{/* Invoice Detail View */}
								{selectedInvoice && (
									<div className="mt-6 border rounded-md p-4">
										<div className="flex justify-between items-start mb-6">
											<div>
												<h3 className="text-lg font-bold">Invoice Detail</h3>
												<p className="text-sm text-gray-500">
													{selectedInvoice} • {
														formatDate(
															mockBillingData.invoices.find(i => i.id === selectedInvoice)?.date || ""
														)
													}
												</p>
											</div>
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Download PDF
											</Button>
										</div>

										<div className="space-y-4">
											{/* Invoice Items */}
											<div>
												<h4 className="font-medium mb-2">Invoice Items</h4>
												<div className="rounded-md border overflow-hidden">
													<div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800 p-2 text-sm font-medium">
														<div>Description</div>
														<div className="text-right">Amount</div>
													</div>

													{mockBillingData.invoices
														.find(i => i.id === selectedInvoice)?.items
														.map((item, idx) => (
															<div key={idx} className="grid grid-cols-2 p-2 text-sm border-t">
																<div>{item.description}</div>
																<div className="text-right">{formatCurrency(item.amount)}</div>
															</div>
														))
													}

													<div className="grid grid-cols-2 p-2 text-sm font-bold bg-gray-50 dark:bg-gray-800 border-t">
														<div>Total</div>
														<div className="text-right">
															{formatCurrency(
																mockBillingData.invoices.find(i => i.id === selectedInvoice)?.amount || 0
															)}
														</div>
													</div>
												</div>
											</div>

											{/* Payment Information */}
											<div>
												<h4 className="font-medium mb-2">Payment Information</h4>
												<div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 text-sm">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
														<div>
															<span className="text-gray-500">Status:</span>{" "}
															<Badge variant="outline">
																{mockBillingData.invoices.find(i => i.id === selectedInvoice)?.status}
															</Badge>
														</div>
														<div>
															<span className="text-gray-500">Payment Method:</span>{" "}
															{mockBillingData.invoices.find(i => i.id === selectedInvoice)?.paidWith}
														</div>
														<div>
															<span className="text-gray-500">Payment Date:</span>{" "}
															{formatDate(
																mockBillingData.invoices.find(i => i.id === selectedInvoice)?.paidOn || ""
															)}
														</div>
														<div>
															<span className="text-gray-500">Invoice Date:</span>{" "}
															{formatDate(
																mockBillingData.invoices.find(i => i.id === selectedInvoice)?.date || ""
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Payment Methods Tab */}
					<TabsContent value="methods">
						<Card>
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between">
									<div>
										<CardTitle>Payment Methods</CardTitle>
										<CardDescription>Manage your saved payment methods</CardDescription>
									</div>
									<Button className="mt-4 md:mt-0">
										<PlusCircle className="h-4 w-4 mr-2" />
										Add Payment Method
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{mockBillingData.paymentMethods.map((method) => (
										<div
											key={method.id}
											className={`border p-4 rounded-md ${method.isDefault ? 'border-primary' : ''}`}
										>
											<div className="flex justify-between items-center">
												<div className="flex items-center">
													{method.type === "card" ? (
														<CreditCard className="h-10 w-10 mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md" />
													) : (
														<Landmark className="h-10 w-10 mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md" />
													)}
													<div>
														<p className="font-medium">
															{method.type === "card"
																? `${method.brand ? method.brand.charAt(0).toUpperCase() + method.brand.slice(1) : 'Card'} •••• ${method.last4}`
																: `${method.bankName} •••• ${method.last4}`
															}
															{method.isDefault && (
																<Badge variant="outline" className="ml-2">Default</Badge>
															)}
														</p>
														{method.type === "card" && method.expMonth && method.expYear && (
															<p className="text-sm text-gray-500">
																Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
															</p>
														)}
													</div>
												</div>
												<div className="flex space-x-2">
													{!method.isDefault && (
														<Button variant="outline" size="sm">
															Set as Default
														</Button>
													)}
													<Button variant="ghost" size="sm">
														Edit
													</Button>
													<Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
														Remove
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
									<div className="flex items-start">
										<Shield className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
										<div>
											<h4 className="font-medium">Secure Payment Processing</h4>
											<p className="text-sm text-gray-500 mt-1">
												All payment information is encrypted and securely processed through our payment provider.
												We never store your full card details on our servers.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Billing Documents Tab */}
					<TabsContent value="documents">
						<Card>
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between">
									<div>
										<CardTitle>Billing Documents</CardTitle>
										<CardDescription>Access and download important billing documents</CardDescription>
									</div>
									<div className="flex mt-4 md:mt-0">
										<Button variant="outline" className="mr-2">
											<Receipt className="h-4 w-4 mr-2" />
											Request Receipt
										</Button>
										<Button variant="outline">
											<UploadIcon className="h-4 w-4 mr-2" />
											Upload Document
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="border rounded-md divide-y">
										{/* Lease Documents Section */}
										<div className="p-4">
											<h3 className="font-medium mb-3">Lease Documents</h3>
											<div className="space-y-2">
												<div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
													<div className="flex items-center">
														<FileText className="h-5 w-5 mr-2 text-gray-500" />
														<span>Lease Agreement</span>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</div>
												<div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
													<div className="flex items-center">
														<FileText className="h-5 w-5 mr-2 text-gray-500" />
														<span>House Rules Addendum</span>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</div>
												<div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
													<div className="flex items-center">
														<FileText className="h-5 w-5 mr-2 text-gray-500" />
														<span>Security Deposit Agreement</span>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</div>
											</div>
										</div>

										{/* Tax Documents Section */}
										<div className="p-4">
											<h3 className="font-medium mb-3">Tax Documents</h3>
											<div className="space-y-2">
												<div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
													<div className="flex items-center">
														<FileText className="h-5 w-5 mr-2 text-gray-500" />
														<span>2023 Rent Payment Statement</span>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</div>
												<div className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
													<div className="flex items-center">
														<FileText className="h-5 w-5 mr-2 text-gray-500" />
														<span>2022 Rent Payment Statement</span>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</div>
											</div>
										</div>

										{/* Receipt History Section */}
										<div className="p-4">
											<h3 className="font-medium mb-3">Receipt History</h3>
											<div className="space-y-2">
												{mockBillingData.invoices.map((invoice) => (
													<div key={invoice.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
														<div className="flex items-center">
															<Receipt className="h-5 w-5 mr-2 text-gray-500" />
															<span>Receipt for {invoice.id} ({formatDate(invoice.date)})</span>
														</div>
														<Button variant="ghost" size="sm">
															<Download className="h-4 w-4 mr-2" />
															Download
														</Button>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Billing FAQ Section */}
				<div className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Billing FAQ</CardTitle>
							<CardDescription>Common questions about billing and payments</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h3 className="font-medium">When is my payment due?</h3>
									<p className="text-sm text-gray-500 mt-1">
										Payments are due on the 1st of each month. Payments received after the 5th may incur a late fee.
									</p>
								</div>
								<div>
									<h3 className="font-medium">How do I update my payment method?</h3>
									<p className="text-sm text-gray-500 mt-1">
										You can update your payment method in the "Payment Methods" tab. Click "Add Payment Method" to add a new card or bank account.
									</p>
								</div>
								<div>
									<h3 className="font-medium">What payment methods are accepted?</h3>
									<p className="text-sm text-gray-500 mt-1">
										We accept all major credit cards (Visa, Mastercard, American Express, Discover) and ACH bank transfers.
									</p>
								</div>
								<div>
									<h3 className="font-medium">How do I get a receipt for my payment?</h3>
									<p className="text-sm text-gray-500 mt-1">
										Receipts are automatically generated for all payments and can be found in the "Billing Documents" tab. You can also request additional receipts if needed.
									</p>
								</div>
							</div>

							<div className="mt-6">
								<Button variant="outline" asChild>
									<Link href="/help/billing">
										View All Billing Questions
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
} 