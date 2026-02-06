import { redirect } from 'next/navigation';

const HomePage = () => {
  redirect('/chats');
};

export default HomePage;
