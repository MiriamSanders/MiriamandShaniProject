import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context';
import { Link ,useNavigate} from 'react-router-dom';
import AddItem from './AddItem';
import Delete from './Delete';
import '../css/album.css';
const Albums = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [albums, setAlbums] = useState([]);
  const { user } = useContext(UserContext);
  const fields = [{ name: "title", inputType: "text" }];
  const initialObject = { };
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3012/albums`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')), // Add your JWT token here
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 401) {
          localStorage.removeItem("user");
         navigate("/login");
        }
        return response.json();
      })
      .then(json => {
        if (json) {
          setAlbums(json);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching albums:', error);
        setLoading(false);
      });
  }, [user.id]);


  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <>
      <input
        type="text"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '5px', marginBottom: '10px' }}
      />

      <button onClick={() => setSearch("")}>
        Clear search
      </button>

      <AddItem fields={fields} initialObject={initialObject} setData={setAlbums} type={"albums"} />

      <div className="albums-grid">
        {albums.filter(album =>
          album.title.toLowerCase().includes(search.toLowerCase()) ||
          album.id.toString().includes(search)
        ).map((album, index) => (
          
            <div className="album" key={index}>
              <Link to={`/users/${user.id}/albums/${album.id}`} key={album.id} state={{ album }}>
                <p className='albumText'>{album.id}. {album.title}</p>
              </Link>
              <Delete
                setMyItem={setAlbums}
                id={album.id}
                type="albums"
                dependents={{ son: "photos", father: "album" }}
              />
            </div>
          
        ))}
      </div>
    </>
  );
};

export default Albums;