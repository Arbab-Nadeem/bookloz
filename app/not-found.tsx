import Link from 'next/link';

const NotFound = () => {
	return (
		<section className='bg-gray-900 h-screen w-screen py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex justify-center items-center flex-col'>
			<h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary'>
				404
			</h1>
			<p className='mb-4 text-3xl tracking-tight font-bold  md:text-4xl text-white'>
				{`Something's`} missing.
			</p>
			<p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
				Sorry, we {`can't`} find that page. {`You'll`} find lots to explore on
				the home page.{' '}
			</p>
			<Link
				href='/'
				className='inline-flex text-dark-100 bg-primary focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4'
			>
				Back to Homepage
			</Link>
		</section>
	);
};

export default NotFound;
