import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const {
    body: formData,
    query: { id },
    session,
  } = req;

  // no id found
  if (!id) {
    return res.status(400).json('BAD REQUEST ID NOT DEFINED');
  }

  if (req.method === 'GET') {
    // retrieve the one attendance record
    const member = await Member.getById(id);

    // member not found
    if (!member) {
      return res.status(404).json('NOT FOUND');
    }

    return res.status(200).json(member);
  }

  if (req.method === 'POST') {
    const member = Member.hydrateMember(await Member.addAdvancement(id, formData));
    return res.status(200).json(member);
  }

  if (req.method === 'DELETE') {
    // verify member existance
    const member = await Member.findOne({ _id: id });

    // member not found
    if (!member) {
      return res.status(404).json('NOT FOUND');
    }

    // Delete member and return list of members
    await Member.realDelete(id);
    const members = await Member.getAll(session.troop);

    return res.status(200).json(members);
  }

  // bad method
  return res.status(405).json('WRONG METHOD');
});
