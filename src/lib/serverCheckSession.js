import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function serverCheckSession(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.log('serverCheckSession: session not found, redirecting to signin', req.url);
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    };
  }

  console.log('serverCheckSession: session found, loading page...', req.url);
  return { props: { session } };
}
