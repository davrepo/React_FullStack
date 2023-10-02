// localhost:3000/article/learn-node
import { useParams } from "react-router-dom";
import articles from './article-content';
import NotFoundPage from './NotFoundPage';

const ArticlePage = () => {
  const { articleId } = useParams();
  // same as,
  // const params = useParams();
  // const articleId = params.articleId;
  const article = articles.find(article => article.name === articleId);
  
  if (!article) return <NotFoundPage />;

  return (
    <>
      <h1>{article.title}</h1>
      {article.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
      ))}
    </>
  );
};

export default ArticlePage;
