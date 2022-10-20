import { DateTime } from 'luxon';
import { LESSONS } from '@shared/constants';
import {
  afterAll,
  beforeAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import Event from './event.model';
import Member from './member.model';

let testMembers;
const testDate = DateTime.fromISO('2022-01-01');
const testEvent = {
  title: 'Test name',
  lessonID: 2,
  date: testDate.toString(),
  desc: 'Hello TLUSA',
};

beforeAll(async () => {
  // create a pool of test members
  testMembers = await Member.create([
    { firstName: 'first-01', lastName: 'last-01', patrol: 'fox', active: true },
    { firstName: 'first-02', lastName: 'last-02', patrol: 'hawk', active: true },
    { firstName: 'first-03', lastName: 'last-03', patrol: 'moutainLion', active: true },
    { firstName: 'first-04', lastName: 'last-04', patrol: 'moutainLion', active: false },
  ]);
});

afterAll(async () => {
  await Event.collection.drop();
  await Member.collection.drop();
  db.close();
});

it('Should add no-lesson event', async () => {
  const formData = {
    title: 'Family Hike',
    date: testDate.toString(),
    desc: 'Meet at the Red Dot trailhead at 8am sharp',
  };

  const received = await Event.add(formData);
  expect(received).toMatchObject(formData);

  await Event.deleteOne({ _id: received._id });
});

it('Should add lesson event', async () => {
  const formData = {
    date: testDate.toString(),
    lessonID: 1,
  };

  const received = await Event.add(formData);
  expect(received).toMatchObject(formData);

  await Event.deleteOne({ _id: received._id });
});

it('Should get all the events, sorted by date, with hydrated lessons', async () => {
  // create a pool of test events
  const testEvents = await Event.create([
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.plus({ week: 1 }).toString(),
      lessonID: 5
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.plus({ days: 10 }).toString(),
      lessonID: 13
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.toString(), // first date not first to test sorting
      lessonID: 1
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.plus({ weeks: 2 }).toString(),
      title: 'Custom Title',
      desc: 'This is what we are doing',
    },
  ]);

  const received = await Event.getAll();
  expect(received.length).toEqual(4); // total number
  expect(received[0].date).toEqual(testDate.toString()); // sort order
  expect(received[1].lesson).toEqual(LESSONS[5]); // lesson hydration
  expect(received[3].lesson).toBeUndefined(); // no lesson
  expect(received[0].attendance.length).toEqual(3); // active members only
  expect(received[0].attendance[0]).toMatchObject({ // member hydration
    _id: testMembers[0]._id,
    name: 'first-01 last-01',
    patrol: 'fox',
  });

  await Promise.all(testEvents.map(({ _id }) => Event.deleteOne({ _id })));
});

it('Should update an event', async () => {
  const event = await Event.create(testEvent);
  const formData = {
    _id: event._id,
    title: 'Upated Name',
  };

  const received = await Event.update(formData);
  expect(received).toMatchObject(formData);

  await Event.deleteOne({ _id: received._id });
});

it('Should remove and event', async () => {
  let event = await Event.create(testEvent);

  await Event.remove(event._id);
  event = await Event.findOne({ _id: event._id });
  expect(event).toBeNull();
});

it('Should update event attendence', async () => {
  const event = await Event.create(testEvent);
  const formData = {
    _id: event._id,
    attendance: testMembers.map((m) => m._id),
  };

  const received = await Event.updateAttendance(formData);
  expect(received).toMatchObject(formData);

  await Event.deleteOne({ _id: received._id });
});
