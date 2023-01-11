import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import mongooseClient from '@server/config/database';

// extract the MongoDB Client from the mongoose instance
const mongoClient = mongooseClient.db.s.client;

export const authOptions = {
  // add a database adapter for saving verification links
  adapter: MongoDBAdapter(Promise.resolve(mongoClient)),

  // gimme those messages...
  debug: true,

  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PW,
        },
      },
      from: 'no-reply@troop.tools',
    }),
  ],
};

export default NextAuth(authOptions);
