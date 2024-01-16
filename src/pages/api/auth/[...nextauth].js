import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
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
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username is demo@troop.tools', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password is comesee', type: 'password' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = {
          email: 'demo@troop.tools',
          firstName: 'Landon',
          lastName: 'Sutherland',
          roles: {
            admin: true
          },
          troop: 'DM-1234',
        };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      token.user = user;

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;

      return { ...session, ...token.user };
    }
    // async session({ session, token, user }) {
    //   // construct the session user object with only the fields we want
    //   // on the front end
    //   const { email, firstName, lastName, roles, troop } = user;
    //   const filteredUser = { email, firstName, lastName, roles, troop };

    //   // data must be serializeable which means no undefined values
    //   Object.keys(filteredUser).forEach((key) => {
    //     if (filteredUser[key] === undefined) {
    //       delete filteredUser[key];
    //     }
    //   });

    //   // assign escalating user roles
    //   const isAdmin = Boolean(roles?.admin);
    //   const isTrailGuide = isAdmin || Boolean(roles?.trailguide);
    //   const isParent = isAdmin || isTrailGuide || Boolean(roles?.parent);

    //   return {
    //     ...filteredUser,
    //     isAdmin,
    //     isParent,
    //     isTrailGuide,
    //   };
    // }
  },

  // pages: {
  //   // signIn: '/auth/signin',
  //   // verifyRequest: '/auth/verify-request',
  //   // newUser: '/auth/new-user',
  // },

  // add the logo and theme color to the default sign in pages
  theme: {
    brandColor: '#228B22',
    logo: logo.src,
  },
};

export default NextAuth(authOptions);
