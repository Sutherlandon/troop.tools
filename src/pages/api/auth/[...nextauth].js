import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@server/config/databasePromise';

export const authOptions = {
  // add a database adapter for saving verification links
  adapter: MongoDBAdapter(clientPromise),

  // gimme those messages...
  debug: true,

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
      // construct the session user object
      const { email, firstName, lastName, roles } = user;
      session.user = { email, firstName, lastName, roles };

      return session;
    }
  },

  // pages: {
  //   signIn: '/auth/signin'
  // }
};

export default NextAuth(authOptions);
