import React, { useContext } from 'react';
import { UserContext } from './context';
import '../css/home.css'; // Import the CSS file for styling
const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className='userName'>
      <div><div className="animated-title">Welcome to  {user ? user.name : "Guest user"}'s Dashboard</div><h1 className="welcome-message">Welcome to our website! your one-stop platform for managing todos, sharing posts, exploring albums, engaging with comments, and viewing user data! Whether you're staying organized, expressing your thoughts, or browsing memories, we've got you covered.</h1></div>

    </div>
  );
};

export default Home;