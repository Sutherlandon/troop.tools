import dayjs from 'dayjs';
import Event from '@server/models/event.model';

export default async function handler(req, res) {
  let events;
  let year;

  switch (req.method) {
    case 'GET':
      events = await Event.getAll();
      break;
    case 'POST':
      await Event.add(req.body);
      // return the schedule for the same year as the event was in
      year = String(dayjs(req.body.date).year());
      events = await Event.getByYear(year);
      break;
    case 'PUT':
      await Event.update(req.body);
      // return the schedule for the same year as the event was in
      year = String(dayjs(req.body.date).year());
      events = await Event.getByYear(year);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
};
