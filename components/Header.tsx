import Image from 'next/image';
import Link from 'next/link';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { signOut } from '@/auth';
import { Button } from './ui/button';

const Header = () => {
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
					<form
						action={async () => {
							'use server';
							await signOut();
						}}
						className='mb-10'
					>
						<Button>Logout</Button>
					</form>
				</li>
				{/* <li>
					<Link href='/my-profile'>
						<Avatar>
							<AvatarFallback className='text-dark-100 bg-amber-100'>
								{getInitials(session?.user?.name || '')}
							</AvatarFallback>
						</Avatar>
					</Link>
				</li> */}
			</ul>
		</header>
	);
};

export default Header;
