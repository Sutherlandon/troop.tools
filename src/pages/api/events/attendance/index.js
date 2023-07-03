import dayjs from 'dayjs';
import Event from '@server/models/event.model';
import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const { body: formData, session } = req;

  // if the hashes don't match report a conflict istead of overriding current values
  const currentEvent = await Event.getById(formData._id);
  if (formData.hash !== currentEvent.hash) {
    return res.status(409).json('CONFLICT');
  }

  // record event attendance
  await Event.updateAttendance(formData, session.troop);

  // only update advancement if there is a lesson to give credit for
  if (formData.lessonID) {
    await Member.updateAdvancement(formData, session.troop);
  }

  // return the schedule for the same year as the event was in
  const year = String(dayjs(req.body.date).year());
  const events = await Event.getByYear(year, session.troop);

  return res.status(200).json(events);
});
