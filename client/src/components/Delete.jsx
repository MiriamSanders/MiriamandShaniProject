import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/delete.css'
import { FaTrash } from 'react-icons/fa';
const Delete = (props) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const deleteItem = async (itemId) => {
        try {
            await fetch(`http://localhost:3012/${props.type}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401) {
                localStorage.removeItem("user");
                navigate("/login");
               }
            props.setMyItem(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error deleting task or dependents:', err);
        } finally {
            setShowConfirmation(false);
        }
    };

    const handleDeleteClick = () => {
        if (props?.dependents?.son) {
            setShowConfirmation(true);
        } else {
            deleteItem(props.id);
        }
    };

    const handleConfirmDelete = () => {
        deleteItem(props.id);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    return (
        <div>
            <span onClick={handleDeleteClick}><FaTrash /></span>
            {showConfirmation && (
                <div className="confirmation-dialog">-
                    <p>{`This ${props?.dependents?.father} has ${props?.dependents?.son}. Are you sure you want to delete?`}</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}
        </div>
    );
};

export default Delete;