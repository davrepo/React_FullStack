import React, { useState } from "react";
import axios from 'axios';

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  
  const addComment = async () => {
    const result = await axios.post(`/api/articles/${articleName}/comments`, {
      postedBy: username,
      text: commentText
    });
    const updatedArticle = result.data;
    onArticleUpdated(updatedArticle);
    setUsername("");
    setCommentText("");
  }
  
  return (
    <div id="add-comment-form">
      <h3>Add a Comment</h3>
      <label>
        Name:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Comment:
        <textarea rows="4" cols="50" value={commentText} onChange={e => setCommentText(e.target.value)} />
      </label>
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default AddCommentForm;