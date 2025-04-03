"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	ArrowDown,
	ArrowUp,
	Calendar,
	DollarSign,
	Download,
	FileText,
	Filter,
	MoreHorizontal,
	TrendingUp
} from "lucide-react";
import { useParams } from "next/navigation";

// Mock financial data
const TRANSACTIONS = [
	{
		id: "1",
		date: "2023-08-28",
		description: "Rent Payment - Alex Johnson",
		type: "income",
		amount: 2400,
		category: "Rent",
		status: "completed"
	},
	{
		id: "2",
		date: "2023-08-27",
		description: "Rent Payment - Jamie Smith",
		type: "income",
		amount: 2400,
		category: "Rent",
		status: "completed"
	},
	{
		id: "3",
		date: "2023-08-25",
		description: "Plumbing Repair - Bathroom 2",
		type: "expense",
		amount: 350,
		category: "Maintenance",
		status: "completed"
	},
	{
		id: "4",
		date: "2023-08-20",
		description: "Electricity Bill - August",
		type: "expense",
		amount: 580,
		category: "Utilities",
		status: "completed"
	},
	{
		id: "5",
		date: "2023-08-15",
		description: "Internet Service - August",
		type: "expense",
		amount: 120,
		category: "Utilities",
		status: "completed"
	},
	{
		id: "6",
		date: "2023-08-10",
		description: "Cleaning Service",
		type: "expense",
		amount: 200,
		category: "Services",
		status: "completed"
	},
	{
		id: "7",
		date: "2023-08-05",
		description: "Kitchen Supplies",
		type: "expense",
		amount: 85,
		category: "Supplies",
		status: "completed"
	},
	{
		id: "8",
		date: "2023-09-01",
		description: "Rent Payment - Taylor Williams",
		type: "income",
		amount: 2400,
		category: "Rent",
		status: "pending"
	}
];

// Mock payment data
const PAYMENTS = [
	{
		id: "1",
		resident: "Alex Johnson",
		email: "alex@example.com",
		room: "101",
		amount: 2400,
		dueDate: "2023-08-01",
		status: "paid",
		paidDate: "2023-07-28"
	},
	{
		id: "2",
		resident: "Jamie Smith",
		email: "jamie@example.com",
		room: "102",
		amount: 2400,
		dueDate: "2023-08-01",
		status: "paid",
		paidDate: "2023-07-31"
	},
	{
		id: "3",
		resident: "Taylor Williams",
		email: "taylor@example.com",
		room: "103",
		amount: 2400,
		dueDate: "2023-08-01",
		status: "overdue",
		paidDate: null
	},
	{
		id: "4",
		resident: "Riley Garcia",
		email: "riley@example.com",
		room: "105",
		amount: 2400,
		dueDate: "2023-08-01",
		status: "paid",
		paidDate: "2023-07-29"
	},
	{
		id: "5",
		resident: "Jordan Miller",
		email: "jordan@example.com",
		room: "106",
		amount: 2400,
		dueDate: "2023-09-01",
		status: "pending",
		paidDate: null
	}
];

// Mock monthly summary data
const MONTHLY_SUMMARY = [
	{
		month: "August 2023",
		income: 9600,
		expenses: 1335,
		profit: 8265,
		occupancyRate: 90
	},
	{
		month: "July 2023",
		income: 12000,
		expenses: 1425,
		profit: 10575,
		occupancyRate: 95
	},
	{
		month: "June 2023",
		income: 9600,
		expenses: 1520,
		profit: 8080,
		occupancyRate: 85
	}
];

export default function FinancialManagementPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	const totalIncome = TRANSACTIONS
		.filter(tx => tx.type === "income" && tx.status === "completed")
		.reduce((sum, tx) => sum + tx.amount, 0);

	const totalExpenses = TRANSACTIONS
		.filter(tx => tx.type === "expense" && tx.status === "completed")
		.reduce((sum, tx) => sum + tx.amount, 0);

	const currentProfit = totalIncome - totalExpenses;
	const profitMargin = totalIncome > 0 ? Math.round((currentProfit / totalIncome) * 100) : 0;

	const pendingPayments = PAYMENTS.filter(p => p.status === "pending").length;
	const overduePayments = PAYMENTS.filter(p => p.status === "overdue").length;

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
						<p className="text-muted-foreground">
							Manage finances for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>

					<div className="flex gap-2">
						<Button variant="outline">
							<Calendar className="mr-2 h-4 w-4" />
							August 2023
						</Button>
						<Button variant="outline">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Income</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<ArrowUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">+8%</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<ArrowDown className="mr-1 h-3 w-3 text-red-500" />
								<span className="text-red-500 font-medium">-3%</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Current Profit</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">${currentProfit.toLocaleString()}</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<ArrowUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">+12%</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{profitMargin}%</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">+5%</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="transactions" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-4">
						<TabsTrigger value="transactions">Transactions</TabsTrigger>
						<TabsTrigger value="payments">Resident Payments</TabsTrigger>
						<TabsTrigger value="reports">Financial Reports</TabsTrigger>
					</TabsList>

					<TabsContent value="transactions">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Recent Transactions</CardTitle>
								<CardDescription>
									All financial transactions for the house
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Date</TableHead>
												<TableHead>Description</TableHead>
												<TableHead>Category</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="w-[50px]"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{TRANSACTIONS.map((transaction) => (
												<TableRow key={transaction.id}>
													<TableCell>
														{new Date(transaction.date).toLocaleDateString()}
													</TableCell>
													<TableCell>{transaction.description}</TableCell>
													<TableCell>
														<Badge variant="outline">{transaction.category}</Badge>
													</TableCell>
													<TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
														{transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																transaction.status === "completed"
																	? "outline"
																	: transaction.status === "pending"
																		? "secondary"
																		: "destructive"
															}
														>
															{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
														</Badge>
													</TableCell>
													<TableCell>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">Actions</span>
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-6 md:grid-cols-2 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Income Breakdown</CardTitle>
									<CardDescription>
										Income sources by category
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{[
											{ category: "Rent", percentage: 95, amount: totalIncome * 0.95 },
											{ category: "Services", percentage: 3, amount: totalIncome * 0.03 },
											{ category: "Other", percentage: 2, amount: totalIncome * 0.02 },
										].map((item, index) => (
											<div key={index}>
												<div className="flex justify-between mb-1">
													<span className="text-sm font-medium">{item.category}</span>
													<div className="text-sm font-medium flex items-center">
														<span className="mr-2">{item.percentage}%</span>
														<span className="text-muted-foreground">${item.amount.toLocaleString()}</span>
													</div>
												</div>
												<div className="w-full bg-muted rounded-full h-2.5">
													<div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Expense Breakdown</CardTitle>
									<CardDescription>
										Expenses by category
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{[
											{ category: "Utilities", percentage: 55, amount: totalExpenses * 0.55 },
											{ category: "Maintenance", percentage: 25, amount: totalExpenses * 0.25 },
											{ category: "Services", percentage: 15, amount: totalExpenses * 0.15 },
											{ category: "Supplies", percentage: 5, amount: totalExpenses * 0.05 },
										].map((item, index) => (
											<div key={index}>
												<div className="flex justify-between mb-1">
													<span className="text-sm font-medium">{item.category}</span>
													<div className="text-sm font-medium flex items-center">
														<span className="mr-2">{item.percentage}%</span>
														<span className="text-muted-foreground">${item.amount.toLocaleString()}</span>
													</div>
												</div>
												<div className="w-full bg-muted rounded-full h-2.5">
													<div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="payments">
						<Card>
							<CardHeader className="pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
								<div>
									<CardTitle>Resident Payments</CardTitle>
									<CardDescription>
										Manage and track resident payments
									</CardDescription>
								</div>
								<div className="mt-2 md:mt-0 flex gap-2">
									<Button variant="outline">
										<Filter className="mr-2 h-4 w-4" />
										All Statuses
									</Button>
									<Button>
										<DollarSign className="mr-2 h-4 w-4" />
										Record Payment
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Resident</TableHead>
												<TableHead>Room</TableHead>
												<TableHead>Due Date</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="w-[50px]"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{PAYMENTS.map((payment) => (
												<TableRow key={payment.id}>
													<TableCell>
														<div className="font-medium">{payment.resident}</div>
														<div className="text-sm text-muted-foreground">{payment.email}</div>
													</TableCell>
													<TableCell>{payment.room}</TableCell>
													<TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
													<TableCell>${payment.amount.toLocaleString()}</TableCell>
													<TableCell>
														<Badge
															variant={
																payment.status === "paid"
																	? "success"
																	: payment.status === "pending"
																		? "secondary"
																		: "destructive"
															}
														>
															{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
														</Badge>
													</TableCell>
													<TableCell>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">Actions</span>
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-6 md:grid-cols-3 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Payment Summary</CardTitle>
									<CardDescription>
										Current month payment status
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Paid</p>
												<p className="text-2xl font-bold">
													{PAYMENTS.filter(p => p.status === "paid").length}
												</p>
											</div>
											<Badge variant="success">Paid</Badge>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Pending</p>
												<p className="text-2xl font-bold">{pendingPayments}</p>
											</div>
											<Badge variant="secondary">Pending</Badge>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Overdue</p>
												<p className="text-2xl font-bold">{overduePayments}</p>
											</div>
											<Badge variant="destructive">Overdue</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="md:col-span-2">
								<CardHeader>
									<CardTitle>Payment Status</CardTitle>
									<CardDescription>
										August 2023 collection rate
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Collection Rate</span>
												<span className="text-sm font-medium">
													{Math.round((PAYMENTS.filter(p => p.status === "paid").length / PAYMENTS.length) * 100)}%
												</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div
													className="bg-primary h-2.5 rounded-full"
													style={{
														width: `${Math.round(
															(PAYMENTS.filter(p => p.status === "paid").length / PAYMENTS.length) * 100
														)}%`,
													}}
												></div>
											</div>
											<p className="mt-2 text-sm text-muted-foreground">
												${PAYMENTS.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
												collected of
												${PAYMENTS.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} total
											</p>
										</div>

										<div className="pt-4">
											<h4 className="text-sm font-medium mb-2">Outstanding Balance</h4>
											<div className="text-2xl font-bold">
												${PAYMENTS.filter(p => p.status !== "paid").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
											</div>
											<p className="text-sm text-muted-foreground">
												Due from {PAYMENTS.filter(p => p.status !== "paid").length} residents
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="reports">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Monthly Financial Summary</CardTitle>
								<CardDescription>
									Overview of monthly finances
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Month</TableHead>
												<TableHead>Income</TableHead>
												<TableHead>Expenses</TableHead>
												<TableHead>Profit</TableHead>
												<TableHead>Margin</TableHead>
												<TableHead className="w-[50px]"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{MONTHLY_SUMMARY.map((month, index) => (
												<TableRow key={index}>
													<TableCell className="font-medium">{month.month}</TableCell>
													<TableCell>${month.income.toLocaleString()}</TableCell>
													<TableCell>${month.expenses.toLocaleString()}</TableCell>
													<TableCell>${month.profit.toLocaleString()}</TableCell>
													<TableCell>{Math.round((month.profit / month.income) * 100)}%</TableCell>
													<TableCell>
														<Button variant="ghost" size="icon">
															<FileText className="h-4 w-4" />
															<span className="sr-only">View Report</span>
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-6 md:grid-cols-2 mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Available Reports</CardTitle>
									<CardDescription>
										Download financial reports
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{[
											{ name: "August 2023 Income Report", date: "2023-08-31" },
											{ name: "August 2023 Expense Report", date: "2023-08-31" },
											{ name: "Q3 Financial Forecast", date: "2023-07-15" },
											{ name: "2023 YTD Financial Summary", date: "2023-08-01" },
										].map((report, index) => (
											<div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
												<div>
													<p className="font-medium">{report.name}</p>
													<p className="text-sm text-muted-foreground">
														Generated: {new Date(report.date).toLocaleDateString()}
													</p>
												</div>
												<Button variant="ghost" size="icon">
													<Download className="h-4 w-4" />
													<span className="sr-only">Download</span>
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Financial Metrics</CardTitle>
									<CardDescription>
										Key performance indicators
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center border-b pb-3">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Avg. Monthly Revenue</p>
												<p className="text-2xl font-bold">
													${Math.round(
														MONTHLY_SUMMARY.reduce((sum, month) => sum + month.income, 0) / MONTHLY_SUMMARY.length
													).toLocaleString()}
												</p>
											</div>
											<div className="flex items-center text-xs">
												<ArrowUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">+5%</span>
											</div>
										</div>

										<div className="flex justify-between items-center border-b pb-3">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Avg. Profit Margin</p>
												<p className="text-2xl font-bold">
													{Math.round(
														MONTHLY_SUMMARY.reduce((sum, month) => sum + (month.profit / month.income) * 100, 0) /
														MONTHLY_SUMMARY.length
													)}%
												</p>
											</div>
											<div className="flex items-center text-xs">
												<ArrowUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">+2%</span>
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Avg. Occupancy Rate</p>
												<p className="text-2xl font-bold">
													{Math.round(
														MONTHLY_SUMMARY.reduce((sum, month) => sum + month.occupancyRate, 0) / MONTHLY_SUMMARY.length
													)}%
												</p>
											</div>
											<div className="flex items-center text-xs">
												<ArrowUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">+3%</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
} 