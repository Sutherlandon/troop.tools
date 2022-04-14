import * as Members from '../../../models/members.model';

export default async function handler(req, res) {
  let members = [];

  switch (req.method) {
    case 'GET':
      members = await Members.getAll();
      break;
    case 'POST':
      members = await Members.add(req.body);
      break;
    case 'PUT':
      members = await Members.update(req.body);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  