import Event from '../../../models/event.model';

export default async function handler(req, res) {
  let events;

  if (req.method === 'POST') {
    await Event.remove(req.body);
    events = await Event.getAll();
  } else {
    return res.status(405);
  }

  return res.status(200).json(events);
};
