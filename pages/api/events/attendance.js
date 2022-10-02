import Event from '../../../models/event.model';
import Member from '../../../models/member.model';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const formData = req.body;

  await Event.updateAttendance(formData);
  await Member.updateAdvancement(formData);

  const events = await Event.getAll();

  return res.status(200).json(events);
};
