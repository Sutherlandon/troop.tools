import dayjs from 'dayjs';
import Event from '@server/models/event.model';

export default async function handler(req, res) {
  let events;

  if (req.method === 'POST') {
    await Event.remove(req.body);
    // return the schedule for the same year as the event was in
    const year = String(dayjs(req.body.date).year());
    events = await Event.getByYear(year);
  } else {
    return res.status(405);
  }

  return res.status(200).json(events);
};
