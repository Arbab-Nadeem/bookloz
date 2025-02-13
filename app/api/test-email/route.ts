// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/workflow';

/**
 * This endpoint tests the sendEmail function in isolation.
 *
 * To test, send a POST request with a JSON body like:
 * {
 *   "email": "recipient@example.com",
 *   "fullName": "Recipient Name",
 *   "subject": "Test Email Subject",
 *   "message": "This is a test message from the isolated API route."
 * }
 */
export async function POST(req: Request) {
	try {
		const data = await req.json();

		// Optionally, use default test data if not provided
		const {
			email = 'recipient@example.com',
			fullName = 'Desert Rose',
			subject = 'Test Email Subject',
			message = 'This is a test message from the isolated API route.',
		} = data || {};

		const response = await sendEmail({ email, fullName, subject, message });
		return NextResponse.json({ success: true, response });
	} catch (error: any) {
		console.error('Error sending test email:', error);
		return NextResponse.json(
			{ success: false, error: error.message || error.toString() },
			{ status: 500 }
		);
	}
}
