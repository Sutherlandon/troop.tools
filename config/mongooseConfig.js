import mongoose from 'mongoose';

const { MONGODB_URI, NODE_ENV } = process.env

const uri = MONGODB_URI;
const options = {};

let connection;

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.connect(uri, options);
  }
  connection = global._mongooseConnection;
} else {
  // In production mode, it's best to not use a global variable.
  connection = mongoose.connect(uri, options);
}

// not working atm
// mongoose.connection.on('connected', () => {
//   if (NODE_ENV === 'test') {
//     console.log('Database connected!');
//   }
// })

// mongoose.connection.on('error', () => {
//   console.error('Error: Unable to connect to DB');
// });

// Export a module-scoped Mongoose connection. By doing this in a
// separate module, the connection can be shared across functions.
export default connection;
