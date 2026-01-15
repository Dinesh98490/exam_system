import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/exam-portal?directConnection=true';

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("DB: Using existing open connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    console.log("DB: Starting new connection to", MONGODB_URI.split('@').pop());

    // Set global bufferCommands to false to prevent the annoying timeout error
    mongoose.set('bufferCommands', false);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("DB: mongoose.connect resolved. ReadyState:", m.connection.readyState);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;

    // Wait for the connection to be fully open if it's still connecting
    if (mongoose.connection.readyState !== 1) {
      console.log("DB: Waiting for connection to open... Current state:", mongoose.connection.readyState);
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("DB: Timeout waiting for connection to open")), 5000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          console.log("DB: Connection opened event received");
          resolve(true);
        });
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    }

    console.log("DB: Connection is ready");
  } catch (e) {
    console.error("DB: Connection failed", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
