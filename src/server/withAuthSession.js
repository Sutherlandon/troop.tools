import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default function withAuthSession(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    // TODO: validate session here

    // attach session to req object
    req.session = session;

    return handler(req, res);
  };
}
