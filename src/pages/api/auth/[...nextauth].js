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
  // debug: true,

  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      id: 'email',
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

  callbacks: {
    async session({ session, token, user }) {
      // add the users's name and roles to the session;
      session.user.firstName = user.firstName;
      session.user.lastName = user.lastName;
      session.user.roles = user.roles || [];

      return session;
    }
  },

  // pages: {
  //   signIn: '/app/auth/signin'
  // }
};

export default NextAuth(authOptions);
