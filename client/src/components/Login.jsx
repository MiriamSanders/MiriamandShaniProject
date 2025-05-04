import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './context';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css'

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [userLogin, setUserLogin] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3012/users?username=${userLogin.name}&website=${userLogin.password}`);
      const data = await response.json();
      if (data.length > 0) {
        const foundUser = data[0];
        if (foundUser) {
          localStorage.setItem('user', JSON.stringify(foundUser));
          setUser(foundUser);
          navigate(`/users/${foundUser.id}/home`);

          setError('');
        } else {
          setError('Wrong password');
        }
      } else {
        setError('Username not found');
      }
    } catch (err) {
      setError('An error occurred while connecting');
    }
  };

  return (
    <>
      <Link to="/users/guest/home">
        <button className="nav-button">🏠</button>
      </Link>
      <div className='loginForm'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={userLogin.name}
              onChange={(e) => setUserLogin(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Type username..."
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={userLogin.password}
              onChange={(e) => setUserLogin(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Type password..."
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        <div className="toSignUp">Don&apos;t have an account?
          <Link to="/signup"> Create an account</Link>
        </div>
      </div>
    </>
  );
};

export default Login;