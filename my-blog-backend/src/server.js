import express from 'express';
import { connectDB, getArticleByName, upvoteArticle, addCommentToArticle } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  await connectDB();

  const app = express();
  app.use(express.json()); // middleware to parse JSON

  app.get('/api/articles/:name', async (req, res) => {
    const article = await getArticleByName(req.params.name);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).send('Article not found');
    }
  });

  app.put('/api/articles/:name/upvote', async (req, res) => {
    const article = await upvoteArticle(req.params.name);
    if (article) {
      res.send(`${req.params.name} now has ${article.upvotes} upvotes`);
    } else {
      res.status(404).send('Article not found');
    }
  });

  app.post('/api/articles/:name/comments', async (req, res) => {
    const article = await addCommentToArticle(req.params.name, req.body);
    if (article) {
      res.send(article.comments);
    } else {
      res.send('That article doesn\'t exist!');
    }
  });

  app.listen(8000, () => {
    console.log('Server is listening on port 8000');
  });
}

start();
