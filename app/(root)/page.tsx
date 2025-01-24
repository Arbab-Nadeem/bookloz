import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { sampleBooks } from '@/constants';

const Home = () => (
	<>
		<BookOverview {...sampleBooks[0]} />
		<BookList
			title='Latest Books'
			containerClassName='mt-28'
			books={sampleBooks}
		/>
	</>
);

export default Home;
