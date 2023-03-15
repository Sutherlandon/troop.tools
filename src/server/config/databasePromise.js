import { MongoClient } from 'mongodb';

const { MONGODB_URI, NODE_ENV } = process.env;

const uri = MONGODB_URI;
const options = {};

const client = new MongoClient(uri, options);
let clientPromise;

console.log('DBP MONGODB_URI', NODE_ENV, MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

// Export a module-scoped MongoDB connection. By doing this in a
// separate module, the connection can be shared across functions.
export default clientPromise;
