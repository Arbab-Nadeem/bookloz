// /api/workflows/onboarding/route.ts
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';
import { eq } from 'drizzle-orm';

type UserState = 'non-active' | 'active';

type InitialData = {
	email: string;
	fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (user.length === 0) return 'non-active';

	const lastActivityDate = new Date(user[0].lastActivityDate!);
	const now = new Date();
	const timeDifference = now.getTime() - lastActivityDate.getTime();

	if (
		timeDifference > THREE_DAYS_IN_MS &&
		timeDifference <= THIRTY_DAYS_IN_MS
	) {
		return 'non-active';
	}

	return 'active';
};

export const { POST } = serve<InitialData>(async (context) => {
	const { email, fullName } = context.requestPayload;

	// Send welcome email on new sign-up.
	await context.run('new-signup', async () => {
		try {
			await sendEmail({
				email,
				fullName,
				subject: 'Welcome to the platform',
				message: `Glad to see you here, ${fullName}!`,
			});
		} catch (err) {
			console.error('Error in new-signup step:', err);
			throw err;
		}
	});

	// Wait for 3 days before sending follow-up.
	await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3);

	while (true) {
		const state = await context.run('check-user-state', async () => {
			return await getUserState(email);
		});

		if (state === 'non-active') {
			await context.run('send-email-non-active', async () => {
				await sendEmail({
					email,
					fullName,
					subject: 'Are you still there?',
					message: `Hey ${fullName}, we miss you.`,
				});
			});
		} else if (state === 'active') {
			await context.run('send-email-active', async () => {
				await sendEmail({
					email,
					fullName,
					subject: 'Welcome back!',
					message: `Glad to see you active, ${fullName}!`,
				});
			});
		}

		// Wait for 1 month before checking user state again.
		await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
	}
});
