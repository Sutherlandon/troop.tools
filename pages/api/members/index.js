import Member from '../../../models/member.model';

export default async function handler(req, res) {
  // A list of users or the member created/updated
  let results;

  switch (req.method) {
    case 'GET':
      results = await Member.getAll();
      break;
    case 'POST':
      await Member.add(req.body);
      results = await Member.getAll();
      break;
    case 'PUT':
      await Member.update(req.body);
      results = await Member.getAll();
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(results);
};
