import Event from '@server/models/event.model';

export default async function handler(req, res) {
  const { year } = req.query;
  let events;

  switch (req.method) {
    case 'GET':
      events = await Event.getByYear(year);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
};
