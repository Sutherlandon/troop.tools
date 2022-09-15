import mongoose from 'mongoose';

const { MONGODB_URI, NODE_ENV } = process.env;

const uri = MONGODB_URI;
const options = {};

let db;

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.createConnection(uri, options);
  }
  db = global._mongooseConnection;
} else {
  // In production mode, it's best to not use a global variable.
  db = mongoose.createConnection(uri, options);
}

mongoose.connection.on('connected', () => {
  console.log('Database connected!');
});

mongoose.connection.on('error', () => {
  console.error('Error: Unable to connect to DB');
});

// Export a module-scoped Mongoose connection. By doing this in a
// separate module, the connection can be shared across functions.
export default db;
