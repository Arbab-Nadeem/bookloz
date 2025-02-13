// /lib/workflow.ts
import emailjs from 'emailjs-com';
import { Client as WorkflowClient } from '@upstash/workflow';
import config from '@/lib/config';

export const workflowClient = new WorkflowClient({
	baseUrl: config.env.upstash.qstashUrl,
	token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
	email,
	fullName,
	subject,
	message,
}: {
	email: string;
	fullName: string;
	subject: string;
	message: string;
}) => {
	try {
		console.log('Sending email via EmailJS:', { email, subject, fullName });
		const response = await emailjs.send(
			config.env.emailJs.serviceId,
			config.env.emailJs.templateId,
			{
				// These keys match your template placeholders:
				from_name: 'Bookloz', // Sender name (could also come from config)
				from_email: 'noreply@bookloz.com', // Sender email address
				to_name: fullName, // Recipient’s name
				// We combine subject and message so that the subject is visible in the body.
				message: `${subject}\n\n${message}`,
			},
			config.env.emailJs.publicKey
		);
		console.log('EmailJS response:', response);
		return response;
	} catch (error) {
		console.error('EmailJS error:', error);
		throw error;
	}
};
