import Event from '../../../models/event.model';

export default async function handler(req, res) {
  let events;

  switch (req.method) {
    case 'GET':
      events = await Event.getAll();
      break;
    case 'POST':
      await Event.add(req.body);
      events = await Event.getAll();
      break;
    case 'PUT':
      await Event.update(req.body);
      events = await Event.getAll();
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
};
