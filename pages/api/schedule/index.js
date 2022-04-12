import * as Schedule from '../../../models/schedule.model';

export default async function handler(req, res) {
  let schedule = [];

  switch (req.method) {
    case 'GET':
      schedule = await Schedule.get();
      break;
    case 'POST':
      schedule = await Schedule.add(req.body);
      break;
    case 'PUT':
      schedule = await Schedule.update(req.body);
      break;
    default:
      return res.status(405);
  }
  
  return res.status(200).json(schedule);
}  