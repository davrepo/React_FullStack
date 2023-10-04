import express from 'express';

const app = express();
app.use(express.json()); // middleware to parse JSON

let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: [], 
  },
  {
    name: 'learn-node',
    upvotes: 0,
    comments: [],
  },
  {
    name: 'mongodb',
    upvotes: 0,
    comments: [],
}]

// PUT /articles/learn-react/upvote
app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  // find article with name
  const article = articlesInfo.find(article => article.name === name);
  if (article) {
    article.upvotes += 1;
    res.send(`${name} now has ${article.upvotes} upvotes`);
  } else {
    res.status(404).send('Article not found');
  }
});

app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const article = articlesInfo.find(a => a.name === name);

  if (article) {
      article.comments.push({ postedBy, text });
      res.send(article.comments);
  } else {
      res.send('That article doesn\'t exist!');
  }
});

// start the server
app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});