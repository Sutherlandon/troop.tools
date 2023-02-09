import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@server/config/databasePromise';
import logo from '@shared/images/brand/Logo-light.png';

export const authOptions = {
  // add a database adapter for saving verification links
  adapter: MongoDBAdapter(clientPromise),

  // gimme those messages...
  debug: false,

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
      const { email, firstName, lastName, roles, troop } = user;
      session.user = { email };

      // only include fields if they have value
      if (firstName) { session.user.firstName = firstName; }
      if (lastName) { session.user.lastName = lastName; }
      if (roles) { session.user.roles = roles; }
      if (troop) { session.user.troop = troop; }

      return session;
    }
  },

  // pages: {
  //   signIn: '/auth/signin'
  // }

  // add the logo and theme color to the default sign in pages
  theme: {
    brandColor: '#228B22',
    logo: logo.src,
  },
};

export default NextAuth(authOptions);
