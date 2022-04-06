import { updateAttendance } from '../../../models/schedule.model';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  
  const updatedEvent = await updateAttendance(req.body);

  return res.status(200).json(updatedEvent);
}  