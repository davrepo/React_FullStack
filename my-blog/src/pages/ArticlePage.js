// localhost:3000/article/learn-node
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import articles from './article-content';
import NotFoundPage from './NotFoundPage';
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

import axios from 'axios';

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });
  const { articleId } = useParams();
  const { user, isLoading } = useUser();

  useEffect(() => { 
    const loadArticleInfo = async () => {
      try {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const result = await axios.get(`/api/articles/${articleId}`, { headers });
        setArticleInfo(result.data);
      } catch (error) {
        console.error("An error occurred while loading article: ", error);
      }
    }
    loadArticleInfo();
  } , [articleId]); // only run when articleId changes
  
  // same as,
  // const params = useParams();
  // const articleId = params.articleId;
  const article = articles.find(article => article.name === articleId);

  const addUpvote = async () => {
    const result = await axios.put(`/api/articles/${articleId}/upvote`);
    const updatedArticle = result.data;
    setArticleInfo(updatedArticle);
  }
  
  if (!article) return <NotFoundPage />;

  return (
    <>
      <h1>{article.title}</h1>
      
      <div className="upvotes-section">
        {user 
          ? <button onClick={addUpvote}>Upvote</button>
          : <button>Log in to upvote</button>
        }
        <p>This article has {articleInfo.upvotes} upvotes(s)</p>
      </div>
      
      {article.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
      ))}
      {user 
        ? <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
        : <button>Log in to add a comment</button>
      }

      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
