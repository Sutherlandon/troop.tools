import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { body: formData, session } = req;

  switch (req.method) {
    case 'GET':
      break;
    case 'POST':
      await Member.add(formData, session.troop);
      break;
    case 'PUT':
      await Member.update(formData);
      break;
    default:
      return res.status(405);
  }

  // A list of users or the member created/updated
  const results = await Member.getAll(session.troop);

  return res.status(200).json(results);
});
