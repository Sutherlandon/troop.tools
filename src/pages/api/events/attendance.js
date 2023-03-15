import Event from '@server/models/event.model';
import Member from '@server/models/member.model';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const formData = req.body;

  // record event attendance
  await Event.updateAttendance(formData);

  // only update advancement if there is a lesson to give credit for
  if (formData.lessonID) {
    await Member.updateAdvancement(formData);
  }

  const events = await Event.getAll();

  return res.status(200).json(events);
};
