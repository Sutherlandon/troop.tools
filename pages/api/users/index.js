import User from '../../../models/user.model';
import connection from '../../../config/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  let users;

  switch (req.method) {
    case 'GET':
      users = await User.getAll();
      break;
    case 'POST':
      users = await User.add(req.body);
      break;
    case 'PUT':
      users = await User.update(req.body);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(users);
};
