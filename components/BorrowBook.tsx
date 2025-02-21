'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { borrowBook } from '@/lib/actions/book';

interface Props {
	bookId: string;
	userId: string;
	borrowingElgibility: {
		isEligible: boolean;
		message: string;
	};
}

const BorrowBook = ({
	bookId,
	userId,
	borrowingElgibility: { isEligible, message },
}: Props) => {
	const router = useRouter();

	const [borrowing, setBorrowing] = useState(false);

	const handleBorrowBook = async () => {
		if (!isEligible) {
			toast({
				title: 'Error',
				description: message,
				variant: 'destructive',
			});
		}

		setBorrowing(true);
		try {
			const result = await borrowBook({ bookId, userId });

			if (result.success) {
				toast({
					title: 'Success',
					description: 'Book borrowed successfully',
					variant: 'success',
				});
				router.push('/my-profile');
			} else {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: 'An error occurred while borrowing the book',
				variant: 'destructive',
			});
		} finally {
			setBorrowing(false);
		}
	};
	return (
		<Button
			onClick={handleBorrowBook}
			disabled={borrowing}
			className='book-overview_btn'
		>
			<Image src='/icons/book.svg' alt='book' width={20} height={20} />
			<p className='font-bebas-nue text-xl text-dark-100'>
				{borrowing ? 'Borrowing...' : 'Borrow Book'}
			</p>
		</Button>
	);
};

export default BorrowBook;
