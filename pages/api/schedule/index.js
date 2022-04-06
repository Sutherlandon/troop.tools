import * as Schedule from '../../../models/schedule.model';

export default async function handler(req, res) {
  let members = [];

  switch (req.method) {
    case 'POST':
      members = await Schedule.add(req.body);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(members);
}  