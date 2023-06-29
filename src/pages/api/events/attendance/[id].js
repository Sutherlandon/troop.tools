import Event from '@server/models/event.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const { query: { id } } = req;

  // retrieve the one attendance record
  const event = await Event.getById(id);

  return res.status(200).json(event);
});
