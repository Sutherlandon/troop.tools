import Event from '../../../models/event.model';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const events = await Event.updateAttendance(req.body);

  return res.status(200).json(events);
};
