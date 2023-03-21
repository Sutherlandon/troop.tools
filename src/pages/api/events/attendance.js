import dayjs from 'dayjs';
import Event from '@server/models/event.model';
import Member from '@server/models/member.model';
import withAuthSession from '@server/withAuthSession';

export default withAuthSession(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const { body: formData, session } = req;

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
