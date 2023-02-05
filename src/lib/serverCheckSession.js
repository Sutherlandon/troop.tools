import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function serverCheckSession(req, res, isOboarding) {
  const session = await getServerSession(req, res, authOptions);

  console.log('referer', req.headers.referer);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      }
    };
  }

  // if isOboarding, check profile completeness
  if (isOboarding) {
    // redirect home if we reached onboarding but have a complete profile
    if (session.user?.firstName && session.user?.lastName) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      };
    }
  } else {
    // Onboard if we don't have all the info we need
    if (!session.user?.firstName || !session.user?.lastName) {
      return {
        redirect: {
          destination: '/onboarding',
          permanent: false,
        }
      };
    }
  }

  return { props: { session } };
}
