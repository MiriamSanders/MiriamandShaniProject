import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './context';
import '../css/editInfo.css';

function EditInfo() {
    const navigate = useNavigate();
    const { user: contextUser, setUser } = useContext(UserContext);
    const location = useLocation();
    const initialUser = contextUser;
    const bool = location.state?.bool;
    const [userDetails, setUserDetails] = useState(initialUser);

    const handleChange = (e, key, nestedKey, nestedNestedKey) => {
        if (nestedNestedKey) {
            setUserDetails(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    [nestedKey]: {
                        ...prev[key][nestedKey],
                        [nestedNestedKey]: e.target.value
                    }
                }
            }));
        } else if (nestedKey) {
            setUserDetails(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    [nestedKey]: e.target.value
                }
            }));
        } else {
            setUserDetails(prev => ({
                ...prev,
                [key]: e.target.value
            }));
        }
    };

    const handleCancel = () => {
        setUserDetails(contextUser);
        navigate(`/users/${userDetails.id}/info`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = bool === "edit" ? await fetch(`http://localhost:3012/users/${contextUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            }) :
                await fetch(`http://localhost:3012/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetails)
                });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                navigate(`/users/${userDetails.id}/info`);
            } else {
                alert('Failed to save user details.');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    };

    return (
        <div>
            <h2 className='title'>{bool === "edit" ? "Edit User Details" : "Create Account"}</h2>
            <div className="userForm">
                <form onSubmit={handleSubmit}>
                    <div>
                        Username: {userDetails.username}
                    </div>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={userDetails.name}
                            onChange={(e) => handleChange(e, 'name')}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={userDetails.email}
                            onChange={(e) => handleChange(e, 'email')}
                        />
                    </div>
                    <div>
                        <label>Street:</label>
                        <input
                            type="text"
                            value={userDetails.address?.street}
                            onChange={(e) => handleChange(e, 'address', 'street')}
                        />
                    </div>
                    <div>
                        <label>Suite:</label>
                        <input
                            type="text"
                            value={userDetails.address?.suite}
                            onChange={(e) => handleChange(e, 'address', 'suite')}
                        />
                    </div>
                    <div>
                        <label>City:</label>
                        <input
                            type="text"
                            value={userDetails.address?.city}
                            onChange={(e) => handleChange(e, 'address', 'city')}
                        />
                    </div>
                    <div>
                        <label>Zipcode:</label>
                        <input
                            type="text"
                            value={userDetails.address?.zipcode}
                            onChange={(e) => handleChange(e, 'address', 'zipcode')}
                        />
                    </div>
                    <div>
                        <label>Latitude:</label>
                        <input
                            type="text"
                            value={userDetails.address?.geo?.lat}
                            onChange={(e) => handleChange(e, 'address', 'geo', 'lat')}
                        />
                    </div>
                    <div>
                        <label>Longitude:</label>
                        <input
                            type="text"
                            value={userDetails.address?.geo?.lng}
                            onChange={(e) => handleChange(e, 'address', 'geo', 'lng')}
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={userDetails.phone}
                            onChange={(e) => handleChange(e, 'phone')}
                        />
                    </div>
                    <div>
                        <label>Website:</label>
                        <input
                            type="text"
                            value={userDetails.website}
                            onChange={(e) => handleChange(e, 'website')}
                        />
                    </div>
                    <div>
                        <label>Company Name:</label>
                        <input
                            type="text"
                            value={userDetails.company?.name}
                            onChange={(e) => handleChange(e, 'company', 'name')}
                        />
                    </div>
                    <div>
                        <label>Company Catch Phrase:</label>
                        <input
                            type="text"
                            value={userDetails.company?.catchPhrase}
                            onChange={(e) => handleChange(e, 'company', 'catchPhrase')}
                        />
                    </div>
                    <div>
                        <label>Company BS:</label>
                        <input
                            type="text"
                            value={userDetails.company?.bs}
                            onChange={(e) => handleChange(e, 'company', 'bs')}
                        />
                    </div>
                    <button type="submit">{bool === "edit" ? "Save Changes" : "Create Account"}</button>
                    <button type="button" onClick={handleCancel} className="cancelButton">Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default EditInfo;