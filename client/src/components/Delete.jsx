import React, { useState } from 'react';
import '../css/delete.css'

const Delete = (props) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const deleteItem = async (itemId) => {
        try {
            if (props.dependents) {
                const response = await fetch(
                    `http://localhost:3012/${props.dependents.son}?${props.dependents.father}Id=${itemId}`
                );
                const dependents = await response.json();

                await Promise.all(
                    dependents.map(dependent =>
                        fetch(`http://localhost:3012/${props.dependents.son}/${dependent.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                    )
                );
            }

            await fetch(`http://localhost:3012/${props.type}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

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
            <span onClick={handleDeleteClick}>🗑️</span>
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