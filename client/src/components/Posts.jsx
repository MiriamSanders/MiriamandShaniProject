import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import '../css/posts.css';
import { UserContext } from './context';
import AddItem from "./AddItem";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const postFields = [{ name: "title", inputType: "text" }, { name: "body", inputType: "textArea" }];
  const initialObject = { userId: user?.id };

  useEffect(() => {
    fetchPosts()
  }, [user?.id]);

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3012/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`postsElements ${isModalOpen ? 'modal-open' : ''}`}>
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

      {user && <button
        onClick={() => setViewMyPosts(prev => !prev)}
        style={{
          backgroundColor: viewMyPosts ? 'pink' : '',
          color: viewMyPosts ? 'white' : ''
        }}
      >
        {viewMyPosts ? 'view all posts' : 'view my posts'}
      </button>}
      {user && <AddItem fields={postFields} initialObject={initialObject} type="posts" setData={setPosts} />}      <div className="container">
        <div className="posts-list">
          {posts.filter(post =>
            ((
              post.title.toLowerCase().includes(search.toLowerCase()) ||
              post.id.toString().includes(search))) &&
            (!viewMyPosts || post.userId === user?.id)
          ).map(post => (
            <div
              key={post.id}
              className="post"
              onClick={() => setSelectedPost(post)}
              style={{
                backgroundColor: post.userId === user?.id ? 'pink' : ''
              }}
            >
              <h3>{post.title}</h3>
            </div>
          ))}
          {loading && <p>Loading more posts...</p>}
        </div>

        <div className="post-details">
          {selectedPost && (!viewMyPosts || (selectedPost.userId === user.id)) ? (
            <Post post={selectedPost} setPosts={setPosts} setSelectedPost={setSelectedPost} />
          ) : (
            <div className="no-post">Nothing to show here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;