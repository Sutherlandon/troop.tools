import Member from '../../../models/members.model';
import connection from '../../../models/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  const { id } = req.query;
  let members = [];

  switch (req.method) {
    case 'DELETE':
      members = await Member.remove(id);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  