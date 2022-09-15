import User from '../../../models/user.model';

export default async function handler(req, res) {
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
