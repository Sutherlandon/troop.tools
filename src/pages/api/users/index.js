import User from '@server/models/user.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { body: formData, session } = req;
  let users;

  switch (req.method) {
    case 'GET':
      users = await User.getAll(session.troop);
      break;
    case 'POST':
      users = await User.add(formData);
      break;
    case 'PUT':
      users = await User.update(formData);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(users);
});
