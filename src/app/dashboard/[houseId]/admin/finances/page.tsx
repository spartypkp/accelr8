import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ArrowUpRight,
	Calendar,
	CreditCard,
	DollarSign,
	Download,
	MoreHorizontal,
	Plus,
	ReceiptIcon,
	WalletIcon
} from 'lucide-react';

// Mock data
const PAYMENT_HISTORY = [
	{
		id: '1',
		resident: 'Emma Thompson',
		room: '101',
		amount: 2500,
		status: 'paid',
		date: '2023-08-01',
		method: 'Credit Card',
	},
	{
		id: '2',
		resident: 'James Wilson',
		room: '102',
		amount: 2500,
		status: 'paid',
		date: '2023-08-01',
		method: 'Bank Transfer',
	},
	{
		id: '3',
		resident: 'Sophia Garcia',
		room: '203',
		amount: 2800,
		status: 'paid',
		date: '2023-08-02',
		method: 'Credit Card',
	},
	{
		id: '4',
		resident: 'Michael Chen',
		room: '205',
		amount: 2800,
		status: 'paid',
		date: '2023-08-01',
		method: 'Bank Transfer',
	},
	{
		id: '5',
		resident: 'Lisa Johnson',
		room: '204',
		amount: 2800,
		status: 'pending',
		date: '2023-08-10',
		method: 'Pending',
	},
];

const BUDGET_ITEMS = [
	{
		id: '1',
		category: 'Maintenance',
		budgeted: 3000,
		spent: 1250,
		remaining: 1750,
		lastUpdated: '2023-08-15',
	},
	{
		id: '2',
		category: 'Utilities',
		budgeted: 2500,
		spent: 1800,
		remaining: 700,
		lastUpdated: '2023-08-15',
	},
	{
		id: '3',
		category: 'Events',
		budgeted: 2000,
		spent: 950,
		remaining: 1050,
		lastUpdated: '2023-08-15',
	},
	{
		id: '4',
		category: 'Supplies',
		budgeted: 1000,
		spent: 520,
		remaining: 480,
		lastUpdated: '2023-08-15',
	},
	{
		id: '5',
		category: 'Cleaning',
		budgeted: 1500,
		spent: 1200,
		remaining: 300,
		lastUpdated: '2023-08-15',
	},
];

const EXPENSES = [
	{
		id: '1',
		description: 'Cleaning Service',
		category: 'Cleaning',
		amount: 800,
		date: '2023-08-10',
		status: 'processed',
	},
	{
		id: '2',
		description: 'HVAC Repair',
		category: 'Maintenance',
		amount: 450,
		date: '2023-08-12',
		status: 'processed',
	},
	{
		id: '3',
		description: 'Electricity Bill',
		category: 'Utilities',
		amount: 1200,
		date: '2023-08-05',
		status: 'processed',
	},
	{
		id: '4',
		description: 'Internet Service',
		category: 'Utilities',
		amount: 350,
		date: '2023-08-05',
		status: 'processed',
	},
	{
		id: '5',
		description: 'Water Bill',
		category: 'Utilities',
		amount: 250,
		date: '2023-08-05',
		status: 'processed',
	},
	{
		id: '6',
		description: 'Game Night Supplies',
		category: 'Events',
		amount: 150,
		date: '2023-08-15',
		status: 'pending',
	},
];

// ChartPlaceholder component for where real charts would go
const ChartPlaceholder = ({ title }: { title: string; }) => (
	<div className="w-full h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
		<div className="text-center">
			<p className="text-sm font-medium">{title}</p>
			<p className="text-xs text-muted-foreground">Chart visualization would go here</p>
		</div>
	</div>
);

export default function FinancesManagement({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;

	// Calculate totals
	const totalIncome = PAYMENT_HISTORY.reduce((sum, payment) =>
		payment.status === 'paid' ? sum + payment.amount : sum, 0);

	const pendingIncome = PAYMENT_HISTORY.reduce((sum, payment) =>
		payment.status === 'pending' ? sum + payment.amount : sum, 0);

	const totalExpenses = EXPENSES.reduce((sum, expense) =>
		expense.status === 'processed' ? sum + expense.amount : sum, 0);

	const pendingExpenses = EXPENSES.reduce((sum, expense) =>
		expense.status === 'pending' ? sum + expense.amount : sum, 0);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
				<div className="flex gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Record Expense
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Monthly Income
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
						<Progress value={(totalIncome / (totalIncome + pendingIncome)) * 100} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							${pendingIncome.toLocaleString()} pending
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Monthly Expenses
						</CardTitle>
						<ReceiptIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
						<Progress value={(totalExpenses / 10000) * 100} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							${pendingExpenses.toLocaleString()} pending
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Net Income
						</CardTitle>
						<WalletIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${(totalIncome - totalExpenses).toLocaleString()}</div>
						<div className="flex items-center pt-1">
							<ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
							<span className="text-xs text-green-500 font-medium">+8%</span>
							<span className="text-xs text-muted-foreground ml-1">from last month</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Budget Utilization
						</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">72%</div>
						<Progress value={72} className="mt-2" />
						<div className="flex items-center pt-1">
							<ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
							<span className="text-xs text-green-500 font-medium">On track</span>
							<span className="text-xs text-muted-foreground ml-1">for this month</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="payments" className="space-y-4">
				<TabsList>
					<TabsTrigger value="payments">Payments</TabsTrigger>
					<TabsTrigger value="expenses">Expenses</TabsTrigger>
					<TabsTrigger value="budget">Budget</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
				</TabsList>

				<TabsContent value="payments">
					<Card>
						<CardHeader>
							<CardTitle>Payment History</CardTitle>
							<CardDescription>
								Track resident payments and rental income
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Resident</TableHead>
										<TableHead>Room</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Payment Method</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{PAYMENT_HISTORY.map((payment) => (
										<TableRow key={payment.id}>
											<TableCell className="font-medium">{payment.resident}</TableCell>
											<TableCell>{payment.room}</TableCell>
											<TableCell>${payment.amount.toLocaleString()}</TableCell>
											<TableCell>{payment.date}</TableCell>
											<TableCell>{payment.method}</TableCell>
											<TableCell>
												<Badge
													variant={payment.status === 'paid' ? 'default' : 'outline'}
													className={payment.status === 'paid' ? 'bg-green-500' : 'border-yellow-500 text-yellow-500'}
												>
													{payment.status === 'paid' ? 'Paid' : 'Pending'}
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>View Details</DropdownMenuItem>
														<DropdownMenuItem>Download Receipt</DropdownMenuItem>
														<DropdownMenuItem>Send Reminder</DropdownMenuItem>
														<DropdownMenuItem>Mark as Paid</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Previous Month</Button>
							<Button variant="outline">Next Month</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="expenses">
					<Card>
						<CardHeader>
							<CardTitle>Expense Tracking</CardTitle>
							<CardDescription>
								Manage and categorize house expenses
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Description</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{EXPENSES.map((expense) => (
										<TableRow key={expense.id}>
											<TableCell className="font-medium">{expense.description}</TableCell>
											<TableCell>{expense.category}</TableCell>
											<TableCell>${expense.amount.toLocaleString()}</TableCell>
											<TableCell>{expense.date}</TableCell>
											<TableCell>
												<Badge
													variant={expense.status === 'processed' ? 'default' : 'outline'}
													className={expense.status === 'processed' ? 'bg-blue-500' : 'border-yellow-500 text-yellow-500'}
												>
													{expense.status === 'processed' ? 'Processed' : 'Pending'}
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>View Details</DropdownMenuItem>
														<DropdownMenuItem>Edit Expense</DropdownMenuItem>
														<DropdownMenuItem>Download Receipt</DropdownMenuItem>
														<DropdownMenuItem>Mark as Processed</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Add Expense
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="budget">
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Monthly Budget</CardTitle>
								<CardDescription>
									Track budget allocation and spending by category
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Category</TableHead>
											<TableHead>Budget</TableHead>
											<TableHead>Spent</TableHead>
											<TableHead>Remaining</TableHead>
											<TableHead>Usage</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{BUDGET_ITEMS.map((item) => (
											<TableRow key={item.id}>
												<TableCell className="font-medium">{item.category}</TableCell>
												<TableCell>${item.budgeted.toLocaleString()}</TableCell>
												<TableCell>${item.spent.toLocaleString()}</TableCell>
												<TableCell>${item.remaining.toLocaleString()}</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Progress
															value={(item.spent / item.budgeted) * 100}
															className="h-2 w-[100px]"
														/>
														<span className="text-sm">
															{Math.round((item.spent / item.budgeted) * 100)}%
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter>
								<Button>
									<Plus className="mr-2 h-4 w-4" />
									Add Budget Item
								</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Budget Overview</CardTitle>
								<CardDescription>
									Visual breakdown of budget allocation
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Budget Allocation" />
								<div className="space-y-4 mt-4">
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-1">
											<div className="h-3 w-3 rounded-full bg-blue-500"></div>
											<span>Maintenance</span>
										</span>
										<span>30%</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-1">
											<div className="h-3 w-3 rounded-full bg-green-500"></div>
											<span>Utilities</span>
										</span>
										<span>25%</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-1">
											<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
											<span>Events</span>
										</span>
										<span>20%</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-1">
											<div className="h-3 w-3 rounded-full bg-purple-500"></div>
											<span>Supplies</span>
										</span>
										<span>10%</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-1">
											<div className="h-3 w-3 rounded-full bg-red-500"></div>
											<span>Cleaning</span>
										</span>
										<span>15%</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="reports">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Income vs. Expenses</CardTitle>
								<CardDescription>
									Financial performance over time
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Monthly Income vs. Expenses" />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Expense Breakdown</CardTitle>
								<CardDescription>
									Categories of expenses by month
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartPlaceholder title="Expense Categories" />
							</CardContent>
						</Card>

						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Financial Reports</CardTitle>
								<CardDescription>
									Download periodic financial reports
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 border rounded-md">
										<div className="flex items-center gap-4">
											<Calendar className="h-8 w-8 text-muted-foreground" />
											<div>
												<p className="font-medium">August 2023 Financial Summary</p>
												<p className="text-sm text-muted-foreground">Monthly financial report</p>
											</div>
										</div>
										<Button variant="outline" size="sm">
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>

									<div className="flex items-center justify-between p-4 border rounded-md">
										<div className="flex items-center gap-4">
											<Calendar className="h-8 w-8 text-muted-foreground" />
											<div>
												<p className="font-medium">Q3 2023 Budget Report</p>
												<p className="text-sm text-muted-foreground">Quarterly budget analysis</p>
											</div>
										</div>
										<Button variant="outline" size="sm">
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>

									<div className="flex items-center justify-between p-4 border rounded-md">
										<div className="flex items-center gap-4">
											<Calendar className="h-8 w-8 text-muted-foreground" />
											<div>
												<p className="font-medium">2023 YTD Financial Statement</p>
												<p className="text-sm text-muted-foreground">Year-to-date financial overview</p>
											</div>
										</div>
										<Button variant="outline" size="sm">
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
} 