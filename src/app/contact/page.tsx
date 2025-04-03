import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Mail,
	MapPin,
	Phone,
	Send
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us | Accelr8",
	description: "Get in touch with the Accelr8 team for inquiries about our houses, applications, or partnerships.",
};

export default function ContactPage() {
	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-blue-950 z-0"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Get in <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Touch</span>
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Have questions about Accelr8? We're here to help.
							Reach out to us and our team will get back to you shortly.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Form and Information */}
			<section className="py-20 bg-gray-950">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Contact Information */}
						<div>
							<h2 className="text-3xl font-bold mb-8">Contact Information</h2>

							<div className="space-y-8">
								<div className="flex items-start">
									<div className="bg-blue-900/30 p-3 rounded-lg mr-4">
										<MapPin className="h-6 w-6 text-blue-400" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">Headquarters</h3>
										<p className="text-gray-400">1551 Larkin Street</p>
										<p className="text-gray-400">San Francisco, CA 94109</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-purple-900/30 p-3 rounded-lg mr-4">
										<Mail className="h-6 w-6 text-purple-400" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">Email</h3>
										<p className="text-gray-400">
											<a
												href="mailto:hello@accelr8.io"
												className="hover:text-blue-400 transition-colors"
											>
												hello@accelr8.io
											</a>
										</p>
										<p className="text-gray-400 mt-1">
											<a
												href="mailto:applications@accelr8.io"
												className="hover:text-blue-400 transition-colors"
											>
												applications@accelr8.io
											</a>
											{" "}
											(for applicants)
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<div className="bg-green-900/30 p-3 rounded-lg mr-4">
										<Phone className="h-6 w-6 text-green-400" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">Phone</h3>
										<p className="text-gray-400">
											<a
												href="tel:+14155551234"
												className="hover:text-blue-400 transition-colors"
											>
												(415) 555-1234
											</a>
										</p>
										<p className="text-gray-400 text-sm mt-1">
											Monday - Friday, 9am - 5pm PT
										</p>
									</div>
								</div>
							</div>

							<div className="mt-12">
								<h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
								<div className="flex space-x-4">
									{/* Social Media Icons - Replace with actual social icons when available */}
									<a href="https://twitter.com/accelr8" className="bg-gray-900 hover:bg-gray-800 p-3 rounded-full transition-colors">
										<span className="sr-only">Twitter</span>
										<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
										</svg>
									</a>

									<a href="https://linkedin.com/company/accelr8" className="bg-gray-900 hover:bg-gray-800 p-3 rounded-full transition-colors">
										<span className="sr-only">LinkedIn</span>
										<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
										</svg>
									</a>

									<a href="https://instagram.com/accelr8housing" className="bg-gray-900 hover:bg-gray-800 p-3 rounded-full transition-colors">
										<span className="sr-only">Instagram</span>
										<svg className="h-5 w-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
										</svg>
									</a>
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
							<h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

							<form className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											placeholder="Your name"
											className="bg-gray-800 border-gray-700 focus:border-blue-500"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											className="bg-gray-800 border-gray-700 focus:border-blue-500"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="subject">Subject</Label>
									<Select>
										<SelectTrigger className="bg-gray-800 border-gray-700 focus:border-blue-500">
											<SelectValue placeholder="Select a subject" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="general">General Inquiry</SelectItem>
											<SelectItem value="application">Application Question</SelectItem>
											<SelectItem value="residency">Current Residency</SelectItem>
											<SelectItem value="partnerships">Partnership Opportunities</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="message">Message</Label>
									<Textarea
										id="message"
										placeholder="How can we help you?"
										rows={5}
										className="bg-gray-800 border-gray-700 focus:border-blue-500"
									/>
								</div>

								<Button type="submit" className="w-full">
									<Send className="mr-2 h-4 w-4" />
									Send Message
								</Button>
							</form>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section (Placeholder) */}
			<section className="bg-gray-950 py-20">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">Visit Us</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">
							Our headquarters is located in the heart of San Francisco,
							with easy access to public transportation and nearby amenities.
						</p>
					</div>

					{/* Map Placeholder - Replace with an actual map component */}
					<div className="bg-gray-900 h-[400px] rounded-lg border border-gray-800 flex items-center justify-center">
						<div className="text-center">
							<MapPin className="h-12 w-12 text-gray-700 mx-auto mb-4" />
							<p className="text-gray-400">Interactive map will be displayed here</p>
						</div>
					</div>
				</div>
			</section>
		</PublicLayout>
	);
} 