const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition_db';
  try {
    // Attempt connecting to local MongoDB with 2-second timeout
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected to local MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Local MongoDB connection failed (${error.message}).`);
    console.log(`[MongoDB] Spinning up in-memory MongoDB server fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] In-memory MongoDB failed: ${memErr.message}`);
    }
  }
};

module.exports = connectDB;
