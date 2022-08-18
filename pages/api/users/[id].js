import User from '../../../models/user.model';
import connection from '../../../config/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const user = await User.get(id);

      // if user found, return them
      if (user) {
        return res.status(200).json(user);
      }

      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }
    default:
      return res.status(405);
  }
};
