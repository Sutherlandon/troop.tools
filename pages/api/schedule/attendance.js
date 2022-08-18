import Event from '../../../models/event.model';
import connection from '../../../config/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  if (req.method !== 'POST') {
    return res.status(405);
  }

  const events = await Event.updateAttendance(req.body);

  return res.status(200).json(events);
};
