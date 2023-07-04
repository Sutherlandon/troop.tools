import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { query: { id } } = req;

  // bad method
  if (req.method !== 'GET') {
    return res.status(405).json('WRONG METHOD ONLY GET');
  }

  // no id found
  if (!id) {
    return res.status(400).json('BAD REQUEST ID NOT DEFINED');
  }

  // retrieve the one attendance record
  const member = await Member.getById(id);

  // member not found
  if (!member) {
    return res.status(404).json('NOT FOUND');
  }

  return res.status(200).json(member);
});
