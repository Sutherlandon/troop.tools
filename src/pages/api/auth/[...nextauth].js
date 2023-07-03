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
      // construct the session user object with only the fields we want
      // on the front end
      const { email, firstName, lastName, roles, troop } = user;
      const filteredUser = { email, firstName, lastName, roles, troop };

      // data must be serializeable which means no undefined values
      Object.keys(filteredUser).forEach((key) => {
        if (filteredUser[key] === undefined) {
          delete filteredUser[key];
        }
      });

      // assign escalating user roles
      const isAdmin = Boolean(roles?.admin);
      const isTrailGuide = isAdmin || Boolean(roles?.trailguide);
      const isParent = isAdmin || isTrailGuide || Boolean(roles?.parent);

      return {
        ...filteredUser,
        isAdmin,
        isParent,
        isTrailGuide,
      };
    }
  },

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },

  // add the logo and theme color to the default sign in pages
  theme: {
    brandColor: '#228B22',
    logo: logo.src,
  },
};

export default NextAuth(authOptions);
