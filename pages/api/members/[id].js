import * as Members from '../../../models/members.model';

export default async function handler(req, res) {
  const { id } = req.query;
  let members = [];

  switch (req.method) {
    case 'DELETE':
      members = await Members.remove(id);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  