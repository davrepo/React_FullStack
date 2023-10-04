import express from 'express';
import { getArticle, updateUpvotes, addComment } from './db';

const router = express.Router();

router.get('/api/articles/:name', async (req, res) => {
  const article = await getArticle(req.params.name);
  article ? res.status(200).json(article) : res.status(404).send('Article not found');
});

router.put('/api/articles/:name/upvote', async (req, res) => {
  const article = await updateUpvotes(req.params.name);
  article ? res.send(`${req.params.name} now has ${article.upvotes} upvotes`) : res.status(404).send('Article not found');
});

router.post('/api/articles/:name/comments', async (req, res) => {
  const article = await addComment(req.params.name, req.body);
  article ? res.send(article.comments) : res.send('That article doesn\'t exist!');
});

export default router;
