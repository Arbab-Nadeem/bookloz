'use server';

import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import ratelimit from '@/lib/ratelimit';

export const signInWithCredentials = async (
	params: Pick<AuthCredentials, 'email' | 'password'>
) => {
	const { email, password } = params;

	const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
	const { success } = await ratelimit.limit(ip);

	if (!success) return redirect('/too-fast');

	try {
		console.log('Attempting sign-in with:', email, password);
		console.log('Attempting sign-in with:', email, password);

		const result = await signIn('credentials', {
			email, // ✅ Pass email directly
			password, // ✅ Pass password directly
			redirect: false,
		});

		console.log('Sign-in result:', result);

		if (result?.error) {
			console.error('❌ Sign-in error:', result.error);
			return { success: false, error: result.error };
		}

		return { success: true };
	} catch (error) {
		console.error('❌ Sign-in failed:', error);
		return { success: false, error: 'Signing Error' };
	}
};

export const signUp = async (params: AuthCredentials) => {
	const { fullName, email, password, universityId, universityCard } = params;

	const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
	const { success } = await ratelimit.limit(ip);

	if (!success) return redirect('/too-fast');

	const existingUser = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existingUser.length > 0) {
		return { success: false, error: 'User already exists' };
	}

	const hashedPassword = await hash(password, 10);

	try {
		await db.insert(users).values({
			fullName,
			email,
			password: hashedPassword,
			universityId,
			universityCard,
		});

		await signInWithCredentials({ email, password });
		return { success: true };
	} catch (error) {
		console.log(error, 'Signup failed');
		return { success: false, error: 'Signup Error' };
	}
};
