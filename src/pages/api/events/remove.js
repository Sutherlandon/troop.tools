import dayjs from 'dayjs';
import Event from '@server/models/event.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  let events;

  const { body: formData, session } = req;

  if (req.method === 'POST') {
    await Event.remove(formData);
    // return the schedule for the same year as the event was in
    const year = String(dayjs(formData.date).year());
    events = await Event.getByYear(year, session.troop);
  } else {
    return res.status(405);
  }

  return res.status(200).json(events);
});
