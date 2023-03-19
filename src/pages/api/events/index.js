import dayjs from 'dayjs';
import Event from '@server/models/event.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { body: formData, session } = req;
  let events;
  let year;

  // return the schedule for the same year as the event was in
  if (formData?.date) {
    year = String(dayjs(formData.date).year());
  }

  switch (req.method) {
    case 'GET':
      events = await Event.getAll('NM1412');
      break;
    case 'POST':
      await Event.add(formData, session.troop);
      events = await Event.getByYear(year, session.troop);
      break;
    case 'PUT':
      await Event.update(formData);
      events = await Event.getByYear(year, session.troop);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
});
