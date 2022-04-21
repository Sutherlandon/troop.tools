import Event from '../../../models/event.model';
import connection from '../../../config/mongooseConfig';

export default async function handler(req, res) {
  await connection;

  let events;

  if (req.method === 'POST') {
    events = await Event.remove(req.body);
  } else {
    return res.status(405);
  }

  return res.status(200).json(events);
}  