// localhost:3000/article/learn-node
import { useParams } from "react-router-dom";
import articles from './article-content';
import NotFoundPage from './NotFoundPage';
import { useState, useEffect } from "react";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });

  useEffect(() => { setArticleInfo({ upvotes: 3, comments: [] }); }, []); // empty array means only run once


  const { articleId } = useParams();
  // same as,
  // const params = useParams();
  // const articleId = params.articleId;
  const article = articles.find(article => article.name === articleId);
  
  if (!article) return <NotFoundPage />;

  return (
    <>
      <h1>{article.title}</h1>
      <p>This post has been upvoted {articleInfo.upvotes} times</p>
      {article.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
      ))}
    </>
  );
};

export default ArticlePage;
