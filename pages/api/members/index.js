import Member from '../../../models/member.model';

export default async function handler(req, res) {
  // A list of users or the member created/updated
  let result;

  switch (req.method) {
    case 'GET':
      result = await Member.getAll();
      break;
    case 'POST':
      result = await Member.add(req.body);
      break;
    case 'PUT':
      result = await Member.update(req.body);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(result);
};
