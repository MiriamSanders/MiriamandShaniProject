import React, { useContext } from 'react';
import { UserContext } from './context';
import '../css/home.css'; // Import the CSS file for styling
const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className='userName'>
      <div>
        <div className="animated-title">
          Welcome to {user ? user.name : "Guest user"}'s Dashboard
        </div>
        <h1 className="welcome-message">
          Welcome to our website!                                Your one-stop platform for:
        </h1>
        <div className="features-list">
          <div>Managing todos</div>
          <div>Sharing posts</div>
          <div>Exploring albums</div>
          <div>Engaging with comments</div>
          <div>Viewing user data</div>
        </div>
        <p className="closing-message">
          Whether you're staying organized, expressing your thoughts, or browsing memories, we've got you covered.
        </p>
      </div>
    </div>
  );
};

export default Home;