import React, { useState, useEffect, useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "./context";
import Delete from "./Delete";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import { FaEdit } from 'react-icons/fa';
function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(null);
  const [editedComment, setEditedComment] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3012/comments?postId=${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')), // Add your JWT token here
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setIsEditing(comment.id);
    setEditedComment(comment);
  };

  return (
    <div>
      <div className="add-comment-button">
        <AddItem
          fields={[{ name: "body", inputType: "textArea" }]}
          initialObject={{ postId, body: "", email: user?.email || "unknown", name: user?.userName || "unknown" }}
          type="comments"
          setData={setComments}
        />
      </div>

      {loading ? (
        <p className='loading'>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <b>{comment.name}</b>
            <br />
            <b>{comment.email}</b>
            {!isEditing || isEditing !== comment.id ? (
              <>
                <p>{comment.body}</p>
                {comment.email === user?.email && (
                  <>
                    <Delete setMyItem={setComments} id={comment.id} type="comments" />
                    <div onClick={() => handleEdit(comment)}><FaEdit /></div>
                  </>
                )}
              </>
            ) : (
              <EditItem
                item={editedComment}
                fields={[{ name: "body", inputType: "textArea" }]}
                type="comments"
                setData={setComments}
                setIsEditing={setIsEditing}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Comments;