import * as Members from '../../../data/membersData';

export default async function handler(req, res) {
  const { name } = req.query;
  let members = [];

  switch (req.method) {
    case 'DELETE':
      members = await Members.remove(name);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  