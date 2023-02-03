import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@server/config/databasePromise';
import logo from '@shared/images/brand/Logo-light.png';

console.log(logo);

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
      session.user = { email };

      // only include fields if they have value
      if (roles) { session.user.roles = roles; }
      if (firstName) { session.user.firstName = firstName; }
      if (lastName) { session.user.lastName = lastName; }

      return session;
    }
  },

  // pages: {
  //   signIn: '/auth/signin'
  // }

  theme: {
    brandColor: '#228B22',
    logo: logo.src,
  },
};

export default NextAuth(authOptions);
