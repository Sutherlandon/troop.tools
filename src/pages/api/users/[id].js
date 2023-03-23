import User from '@server/models/user.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
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

    case 'DELETE': {
      await User.delete(id);
      return res.status(200).send();
    }

    default:
      return res.status(405);
  }
});
