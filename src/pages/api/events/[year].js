import Event from '@server/models/event.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  const { query: { year }, session } = req;
  let events;

  switch (req.method) {
    case 'GET':
      events = await Event.getByYear(year, session.troop);
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(events);
});
