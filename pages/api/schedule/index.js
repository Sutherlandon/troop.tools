import Event from '../../../models/event.model';

export default async function handler(req, res) {
  let events;

  switch (req.method) {
    case 'GET':
      events = await Event.getAll();
      break;
    case 'POST':
      events = await Event.add(req.body);
      break;
    case 'PUT':
      events = await Event.update(req.body);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
};
