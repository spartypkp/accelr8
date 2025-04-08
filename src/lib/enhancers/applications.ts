import { Person as SanityPerson } from '../sanity/sanity.types';
import { SupabaseApplication, SupabaseApplicationInterview } from '../types';

/**
 * Application with enhanced data
 */
export interface EnhancedApplication extends SupabaseApplication {
	sanityPerson?: SanityPerson;
	interviews?: SupabaseApplicationInterview[];
}

/**
 * Enhances a Supabase application with additional data
 */
export function enhanceApplication(
	application: SupabaseApplication,
	options?: {
		sanityPerson?: SanityPerson | null;
		interviews?: SupabaseApplicationInterview[];
	}
): EnhancedApplication {
	// Start with the base application
	const enhancedApplication: EnhancedApplication = {
		...application,

		// Add Sanity data if available
		sanityPerson: options?.sanityPerson || undefined,

		// Add interviews if available
		interviews: options?.interviews
	};

	return enhancedApplication;
}

/**
 * Calculate application-specific metrics
 */
export function calculateApplicationMetrics(
	application: SupabaseApplication
): {
	isComplete: boolean;
	daysSinceSubmission?: number;
	daysSinceReview?: number;
	isPending: boolean;
	isApproved: boolean;
	isRejected: boolean;
	isActive: boolean;
} {
	const now = new Date();

	// Check if application is complete
	const isComplete = !!application.submitted_at;

	// Calculate days since submission
	let daysSinceSubmission: number | undefined;
	if (application.submitted_at) {
		const submittedDate = new Date(application.submitted_at);
		daysSinceSubmission = Math.ceil((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
	}

	// Calculate days since review
	let daysSinceReview: number | undefined;
	if (application.reviewed_at) {
		const reviewedDate = new Date(application.reviewed_at);
		daysSinceReview = Math.ceil((now.getTime() - reviewedDate.getTime()) / (1000 * 60 * 60 * 24));
	}

	// Check application status
	const isPending = ['submitted', 'reviewing', 'interview_scheduled', 'interview_completed'].includes(application.status);
	const isApproved = ['approved', 'accepted'].includes(application.status);
	const isRejected = ['rejected', 'waitlisted'].includes(application.status);
	const isActive = application.status !== 'cancelled' && application.status !== 'draft';

	return {
		isComplete,
		daysSinceSubmission,
		daysSinceReview,
		isPending,
		isApproved,
		isRejected,
		isActive
	};
}

/**
 * Application with enhanced status information
 */
export interface ApplicationWithStatusInfo extends SupabaseApplication {
	statusLabel: string;
	statusDescription: string;
	nextSteps?: string;
	color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
}

/**
 * Add user-friendly status information to an application
 */
export function addApplicationStatusInfo(
	application: SupabaseApplication
): ApplicationWithStatusInfo {
	let statusLabel = '';
	let statusDescription = '';
	let nextSteps: string | undefined;
	let color: 'green' | 'blue' | 'yellow' | 'red' | 'gray' = 'gray';

	switch (application.status) {
		case 'draft':
			statusLabel = 'Draft';
			statusDescription = 'Your application has not been submitted yet.';
			nextSteps = 'Complete and submit your application to be considered.';
			color = 'gray';
			break;
		case 'submitted':
			statusLabel = 'Submitted';
			statusDescription = 'Your application has been submitted and is waiting for review.';
			nextSteps = 'We will review your application soon.';
			color = 'blue';
			break;
		case 'reviewing':
			statusLabel = 'Under Review';
			statusDescription = 'Your application is currently being reviewed.';
			nextSteps = 'We will reach out to schedule an interview if it seems like a good fit.';
			color = 'blue';
			break;
		case 'interview_scheduled':
			statusLabel = 'Interview Scheduled';
			statusDescription = 'Your interview has been scheduled.';
			nextSteps = 'Please prepare for your upcoming interview.';
			color = 'blue';
			break;
		case 'interview_completed':
			statusLabel = 'Interview Completed';
			statusDescription = 'Your interview has been completed and is under final review.';
			nextSteps = 'We are making a final decision on your application.';
			color = 'blue';
			break;
		case 'approved':
			statusLabel = 'Approved';
			statusDescription = 'Your application has been approved!';
			nextSteps = 'Please confirm your acceptance to proceed with move-in.';
			color = 'green';
			break;
		case 'rejected':
			statusLabel = 'Not Accepted';
			statusDescription = 'Your application has not been accepted at this time.';
			color = 'red';
			break;
		case 'waitlisted':
			statusLabel = 'Waitlisted';
			statusDescription = 'You have been added to our waitlist.';
			nextSteps = 'We will contact you when a spot becomes available.';
			color = 'yellow';
			break;
		case 'accepted':
			statusLabel = 'Accepted';
			statusDescription = 'You have accepted our offer!';
			nextSteps = 'Our team will reach out with next steps for moving in.';
			color = 'green';
			break;
		case 'cancelled':
			statusLabel = 'Cancelled';
			statusDescription = 'This application has been cancelled.';
			color = 'gray';
			break;
	}

	return {
		...application,
		statusLabel,
		statusDescription,
		nextSteps,
		color
	};
} 