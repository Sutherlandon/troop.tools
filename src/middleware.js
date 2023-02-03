export { default } from 'next-auth/middleware';
// import { getServerSession } from 'next-auth';
// import { authOptions } from 'pages/api/auth/[...nextauth]';

// import { withAuth } from 'next-auth/middleware';

// export async function middleware(req, res) {
//   console.log('running middleware');
//   const session = await getServerSession(req, res, authOptions);

//   console.log('middlware session', session);

//   // no session, send to login
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/api/auth/signin',
//         permanent: false,
//       }
//     };
//   }

//   // no reason to be here if we have the information we need
//   if (!session.user?.firstName || !session.user?.lastName) {
//     return {
//       redirect: {
//         destination: '/onboarding',
//         permanent: false,
//       }
//     };
//   }

// // `withAuth` augments your `Request` with the user's token.
// return withAuth(
//   function middleware(req) {
//     console.log(req.nextauth.token);
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === 'admin',
//     },
//   }
// );
// }
