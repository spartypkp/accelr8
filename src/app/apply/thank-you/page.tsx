import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Home } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
	return (
		<PublicLayout>
			<div className="container mx-auto py-12 px-4 max-w-6xl">
				<Card className="border-none shadow-lg overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
						<div className="mx-auto bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6">
							<Check className="h-8 w-8 text-green-500" />
						</div>
						<CardTitle className="text-3xl font-bold text-white text-center">Application Submitted!</CardTitle>
						<CardDescription className="text-white text-center text-lg mt-2">
							Thanks for your interest in joining our community.
						</CardDescription>
					</CardHeader>

					<CardContent className="p-8">
						<div className="space-y-6">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="text-xl font-semibold mb-4">What Happens Next?</h3>
								<ol className="space-y-4">
									<li className="flex gap-3">
										<div className="bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
											<span className="font-medium text-blue-600">1</span>
										</div>
										<div>
											<p className="font-medium">Application Review</p>
											<p className="text-gray-600">We'll review your application within 24-48 hours.</p>
										</div>
									</li>
									<li className="flex gap-3">
										<div className="bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
											<span className="font-medium text-blue-600">2</span>
										</div>
										<div>
											<p className="font-medium">Interview or Tour</p>
											<p className="text-gray-600">If your application matches our community, we'll invite you for a virtual interview or in-person tour.</p>
										</div>
									</li>
									<li className="flex gap-3">
										<div className="bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
											<span className="font-medium text-blue-600">3</span>
										</div>
										<div>
											<p className="font-medium">Welcome to Accelr8!</p>
											<p className="text-gray-600">Once approved, we'll help you with the move-in process and welcome you to our community.</p>
										</div>
									</li>
								</ol>
							</div>

							<div className="text-center space-y-4">
								<p className="text-gray-700">Have questions while you wait?</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button variant="outline" className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										Book a Tour
									</Button>
									<Button variant="outline" className="flex items-center gap-2">
										<Home className="h-4 w-4" />
										<Link href="/houses">Browse Houses</Link>
									</Button>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter className="bg-gray-50 p-6 flex flex-col items-center">
						<p className="text-gray-600 text-center mb-2">
							We'll contact you via email soon with updates on your application status.
						</p>
						<p className="text-sm text-gray-500">
							If you don't hear from us within 48 hours, please check your spam folder or contact us.
						</p>
					</CardFooter>
				</Card>
			</div>
		</PublicLayout>
	);
} 