import { useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { UserContext } from './context';
import '../css/info.css';

function Info() {
    const { user } = useContext(UserContext);
    return (
        <div className="userInfo">
            <h2>User Information</h2>
            <div>
                <strong>Name:</strong> {user.name}
            </div>
            <div>
                <strong>User Name:</strong> {user.username}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            <div>
                <strong>Phone:</strong> {user.phone}
            </div>
        </div>
    );
}

export default Info;