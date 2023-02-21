import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function serverCheckSession(req, res) {
  console.log('Getting Session');
  const session = await getServerSession(req, res, authOptions);
  console.log('Complete: ', session);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      }
    };
  }

  return { props: { session } };
}
