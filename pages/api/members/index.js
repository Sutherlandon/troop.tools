import Member from '../../../models/member.model';
import connection from '../../../config/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  let members;

  switch (req.method) {
    case 'GET':
      members = await Member.getAll();
      break;
    case 'POST':
      members = await Member.add(req.body);
      break;
    case 'PUT':
      members = await Member.update(req.body);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(members);
};
