import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

let db;

export const connectDB = async () => {
  await client.connect();
  db = client.db('react');
};

export const getArticle = async (name) => {
  return await db.collection('articles').findOne({ name });
};

export const updateUpvotes = async (name) => {
  await db.collection('articles').updateOne({ name }, {
    '$inc': { upvotes: 1 },
  });
  return getArticle(name);
};

export const addComment = async (name, comment) => {
  await db.collection('articles').updateOne({ name }, {
    '$push': { comments: comment },
  });
  return getArticle(name);
};
