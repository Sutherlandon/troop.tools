import dayjs from 'dayjs';
import { LESSONS_BY_ID } from '../../shared/constants';
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
const testDate = dayjs('2022-01-01');
const testEvent = {
  branch: 'General',
  date: testDate.toString(),
  desc: 'Hello TLUSA',
  lessonID: 2,
  title: 'Test name',
};

beforeAll(async () => {
  // create a pool of test members
  testMembers = await Member.create([
    { firstName: 'first-01', lastName: 'last-01', patrol: 'foxes', active: true },
    { firstName: 'first-02', lastName: 'last-02', patrol: 'hawks', active: true },
    { firstName: 'first-03', lastName: 'last-03', patrol: 'moutainLions', active: true },
    { firstName: 'first-04', lastName: 'last-04', patrol: 'moutainLions', active: false },
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
    lessonID: '1',
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
      date: testDate.add(1, 'week').format(),
      lessonID: 'c9us5tnvarab'
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.add(10, 'days').format(),
      lessonID: '9ez9g5w5c4r1'
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.format(), // first date not first to test sorting
      lessonID: 'a911ldcyi1hc'
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.add(2, 'weeks').format(),
      title: 'Custom Title',
      desc: 'This is what we are doing',
    },
  ]);

  const received = await Event.getAll();
  expect(received.length).toEqual(4); // total number
  expect(received[0].date).toEqual(testDate.format()); // sort order
  expect(received[1].lesson).toEqual(LESSONS_BY_ID.c9us5tnvarab); // lesson hydration
  expect(received[3].lesson).toBeUndefined(); // no lesson
  expect(received[0].attendance.length).toEqual(3); // active members only
  expect(received[0].attendance[0]).toMatchObject({ // member hydration
    _id: testMembers[0]._id,
    name: 'first-01 last-01',
    patrol: 'foxes',
  });

  await Promise.all(testEvents.map(({ _id }) => Event.deleteOne({ _id })));
});

it('Should get all the events for a given year', async () => {
  // create a pool of test events
  const testEvents = await Event.create([
    { // 1 year 2021
      attendance: testMembers.map((m) => m._id),
      date: testDate.subtract(2, 'days').format(),
      lessonID: 'a911ldcyi1hc'
    },
    { // 2 for year 2022
      attendance: testMembers.map((m) => m._id),
      date: testDate.add(1, 'week').format(),
      lessonID: 'c9us5tnvarab'
    },
    {
      attendance: testMembers.map((m) => m._id),
      date: testDate.add(10, 'days').format(),
      lessonID: '9ez9g5w5c4r1'
    },
  ]);

  const received2021 = await Event.getByYear('2021');
  const received2022 = await Event.getByYear('2022');

  expect(received2021.length).toEqual(1);
  expect(received2022.length).toEqual(2);

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
