import express from 'express';
import { connectDB, getArticleByName, upvoteArticle, addCommentToArticle } from './db.js';
import dotenv from 'dotenv';
import fs from 'fs';
import admin from 'firebase-admin';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

async function start() {
  await connectDB();

  const app = express();
  app.use(express.json()); // middleware to parse JSON
  app.use(express.static(path.join(__dirname, '../build')));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
  
  app.use(async (req, res, next) => {
    const { authtoken } = req.headers;
    if (authtoken) {
      try {
        req.user = await admin.auth().verifyIdToken(authtoken);
      } catch (error) {
        return res.sendStatus(400);
      }
    }

    req.user = req.user || {};

    next();
  });

  app.use((req, res, next) => {
    if (req.user) { // if user is logged in
      next(); // call next middleware
    } else {
      res.sendStatus(401); // unauthorized
    }
  });

  app.get('/api/articles/:name', async (req, res) => {
    const article = await getArticleByName(req.params.name);
    const { uid } = req.user || {};
    if (article) {
      const upvoteIds = article.upvoteIds || [];
      article.canUpvote = uid && !upvoteIds.includes(uid);
      res.json(article);
    } else {
      res.status(404).send('Article not found');
    }
  });

  app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;
    
    const article = await getArticleByName(name);  // Fetch the article
  
    if (article) {
      const upvoteIds = article.upvoteIds || [];
      const canUpvote = uid && !upvoteIds.includes(uid);

      console.log('UID:', uid);
      console.log('Upvote IDs:', upvoteIds);
      console.log('Can Upvote:', canUpvote);
      
      if (canUpvote) {
        const updatedArticle = await upvoteArticle(name, uid);  // Pass uid to upvoteArticle
        res.json(updatedArticle);
      } else {
        res.status(403).send('You already upvoted this article');
      }
    } else {
      res.status(404).send('Article not found');
    }
  });
      

  app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body; // Assuming text is the content of the comment
    const { email } = req.user; // get uid from req.user

    const handle = email.split('@')[0];

    const newComment = {
      postedBy: handle,
      text
    };

    const updatedArticle = await addCommentToArticle(name, newComment);

    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.send('That article doesn\'t exist!');
    }
  });

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
  });
}

start();
