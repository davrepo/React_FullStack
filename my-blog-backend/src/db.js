import { MongoClient } from 'mongodb';

let db;

export async function connectDB() {
  const url = process.env.MONGO_URL;
  const client = new MongoClient(url);

  await client.connect();
  db = client.db('react');
}

export async function getArticleByName(name) {
  return await db.collection('articles').findOne({ name });
}

export async function upvoteArticle(name, uid) {
  await db.collection('articles').updateOne({ name }, {
    '$inc': { upvotes: 1 },
    '$push': { upvoteIds: uid },
  });
  return await getArticleByName(name);
}

export async function addCommentToArticle(name, newComment) {
  await db.collection('articles').updateOne({ name }, {
    '$push': { comments: newComment }, // Push the newComment object
  });
  return await getArticleByName(name);
}
