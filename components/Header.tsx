'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import React from 'react';
import { Session } from 'next-auth';

const Header = ({ session }: { session: Session }) => {
	const pathname = usePathname();
	return (
		<header className='my-10 flex justify-between gap-5'>
			<Link
				href='/'
				className='text-white text-2xl font-semibold flex items-end gap-1'
			>
				<Image src='/icons/logo.svg' alt='logo' width={40} height={40} />
				Bookloz
			</Link>

			<ul className='flex flex-row gap-8 items-center'>
				<li>
					<Link
						href='/library'
						className={cn(
							'text-base cursor-pointer capitalize',
							pathname === '/library' ? 'text-light-200' : 'text-light-100'
						)}
					>
						Library
					</Link>
					<li>
						<Link href='/my-profile'>
							<Avatar>
								<AvatarFallback className='text-white'>
									{session?.user?.name}
								</AvatarFallback>
							</Avatar>
						</Link>
					</li>
				</li>
			</ul>
		</header>
	);
};

export default Header;
