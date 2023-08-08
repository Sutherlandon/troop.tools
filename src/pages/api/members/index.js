import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { body: formData, session } = req;

  let member;

  switch (req.method) {
    case 'GET':
      break;
    case 'POST':
      await Member.add(formData, session.troop);
      break;
    case 'PUT':
      // updates are only done on one member at a time, so just
      // respond with the updated member
      member = await Member.update(formData);
      return res.status(200).json(member);
    default:
      return res.status(405);
  }

  // A list of users or the member created/updated
  const results = await Member.getAll(session.troop);

  return res.status(200).json(results);
});
