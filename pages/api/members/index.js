import * as Members from '../../../models/members.model';

export default async function handler(req, res) {
  // Process a POST request
  let members = [];
  switch (req.method) {
    case 'POST':
      members = await Members.add(req.body);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  