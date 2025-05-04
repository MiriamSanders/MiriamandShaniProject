import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from './context';
import '../css/navigation.css'

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [buttonColor, setButtonColor] = useState(false);
    const [message, setMessage] = useState('');

    if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/editInfoNewUser') {
        return null;
    }

    const handleBack = () => {
        if (location.pathname !== '/login' || location.pathname === '/signup') {
            navigate(-1);
        }
    };

    const handleRestrictedAccess = (e) => {
        if (!user) {
            e.preventDefault();
            setMessage("You must log in or sign up to access this page.");
            setButtonColor(true);
            setTimeout(() => {
                setButtonColor(false);
                setMessage('');
            }, 1000);
        }
    };

    return (
        <>
            <nav className="navigation">
                <button className="nav-button" onClick={handleBack}>↪️</button>
                <Link to={`/users/${user ? user.id : 'guest'}/home`}>
                    <button className="nav-button">🏠</button>
                </Link>
                <Link to={`/users/${user ? user.id : 'guest'}/posts`}>
                    <button className="nav-button">Posts</button>
                </Link>
                <Link to={`/users/${user ? user.id : ''}/albums`} onClick={handleRestrictedAccess}>
                    <button className="nav-button">Albums</button>
                </Link>
                <Link to={`/users/${user ? user.id : ''}/tasks`} onClick={handleRestrictedAccess}>
                    <button className="nav-button">Tasks</button>
                </Link>
                <Link to={`/users/${user ? user.id : ''}/info`} onClick={handleRestrictedAccess}
                >
                    <button className="nav-button">Info</button>
                </Link>
                {user ? <Link to="/login">
                    <button className="nav-button" onClick={() => { localStorage.removeItem('user'); setUser(null); }}>Log out</button>
                </Link> :
                    <>
                        <Link to="/login">
                            <button className={`nav-button ${buttonColor ? 'pink' : ''}`}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className={`nav-button ${buttonColor ? 'pink' : ''}`}>Sign up</button>
                        </Link>
                    </>
                }

                <div className='userName'>Hello {user ? user.name : "Guest user"}!</div>
            </nav>

            {message && (
                <div className="notification">
                    {message}
                </div>
            )}
        </>
    );
};

export default Navigation;