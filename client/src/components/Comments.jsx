import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./context";
import Delete from "./Delete";
import AddItem from "./AddItem";
import EditItem from "./EditItem";

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(null);
  const [editedComment, setEditedComment] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3012/comments?postId=${postId}`);
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
          initialObject={{ postId, body: "", email: user?.email || "unknown" }}
          type="comments"
          setData={setComments}
        />
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <b>Owner: {comment.email}</b>
            {!isEditing || isEditing !== comment.id ? (
              <>
                <p>{comment.body}</p>
                {comment.email === user?.email && (
                  <>
                    <Delete setMyItem={setComments} id={comment.id} type="comments" />
                    <div onClick={() => handleEdit(comment)}>✏️</div>
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