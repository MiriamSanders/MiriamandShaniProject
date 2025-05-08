import React, { useState, useEffect, useContext } from "react";
import '../css/photos.css';
import AddItem from "./AddItem";
import { UserContext } from './context';
import { Link, useLocation } from 'react-router-dom';
import Delete from "./Delete";
import EditItem from "./EditItem";
import { FaEdit } from 'react-icons/fa';
const Photos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const { user } = useContext(UserContext);
    const location = useLocation();
    const album = location.state?.album;

    const fields = [
        { name: "title", inputType: "text" },
        { name: "url", inputType: "text" }
    ];

    const initialObject = { albumId: album.id };

    useEffect(() => {
        fetchPhotos();
    }, [page]);

    const fetchPhotos = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3012/photos?albumId=${album.id}&&_page=${page}&&limit=10`);
            const result = await response.json();
            console.log(result);
            
            const newPhotos = result.filter((photo) =>
                !photos.some((existingPhoto) => existingPhoto.id === photo.id)
            );
            if (newPhotos.length < 10) {
                setHasMore(false);
            }
            setPhotos((prev) => [...prev, ...newPhotos]);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadPhotos = () => {
        setPage(prev => prev + 1);
    };

    const photoToEdit = photos.find(photo => photo.id === editingPhotoId);

    return (
        <>
            <Link to={`/users/${user.id}/albums`}>
                <button className="backToAlbums">Back to albums</button>
            </Link>
            <div>
                <h1 className='albumName'>{album.title}</h1>

                <AddItem fields={fields} initialObject={initialObject} type="photos" setData={setPhotos} />

                {editingPhotoId && photoToEdit && (
                    <div className="overlay">
                        <div className="modal">
                            <EditItem
                                item={photoToEdit}
                                fields={fields}
                                type="photos"
                                setData={setPhotos}
                                setIsEditing={setEditingPhotoId}
                            />
                        </div>
                    </div>
                )}

                <div className="photos-grid">
                    {photos.map((photo) => (
                        <div key={photo.id} className="photo-item">
                            <img src={photo.url} alt={photo.title} className="photo-img" />
                            <p className="photo-title">{photo.title}</p>
                            <button onClick={() => setEditingPhotoId(photo.id)}><FaEdit/> Edit</button>
                            <Delete setMyItem={setPhotos} id={photo.id} type="photos" />
                        </div>
                    ))}
                    {loading && <div>Loading more photos...</div>}
                </div>
                {hasMore ? <button onClick={loadPhotos}>Load More</button> : <div>No More Photos</div>}
            </div>
        </>
    );
};

export default Photos;