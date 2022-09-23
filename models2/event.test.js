import {
  afterAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import Event from './event.model';

let index = 0;
function makeEvent(branch) {
  index += 1;
  const eventId = `${index}`.padStart(2, '0');
  const memberName = `first-${eventId} last-${eventId}`;

  return {
    attendance: {
      foxes: { [memberName]: true },
      hawks: { [memberName]: true },
      mountainLions: { [memberName]: true },
      navigators: { [memberName]: true },
      adventurers: { [memberName]: true },
    },
    branch,
    date: `01/${eventId}`,
    name: 'Test Name',
    type: 'Core',
    year: '2022',
  };
}

afterAll(async () => {
  await Event.collection.drop();
  db.close();
});

it('Should get all the event sorted by date', async () => {
  const testEventsData = [
    makeEvent('Heritage'),
    makeEvent('Hobbies'),
    makeEvent('Values'),
  ];
  await Event.create(testEventsData);

  const received = await Event.getAll();
  expect(received.length).toEqual(3);
  expect(received[0].date).toEqual('01/01');
});

it('Should add a new event', async () => {
  const formData = {
    branch: 'Hobbies',
    date: '01/04',
    name: 'New Hobby',
    type: 'Core',
    year: '2022',
  };

  const received = await Event.add(formData);
  expect(received).toMatchObject(formData);

  Event.deleteOne({ _id: received._id });
});

it('Should update an event', async () => {
  const event = await Event.create({ name: 'Test name' });
  const formData = {
    _id: event._id,
    name: 'Upated Name',
  };

  const received = await Event.update(formData);
  expect(received).toMatchObject(formData);

  Event.deleteOne({ _id: event._id });
});

it('Should remove and event', async () => {
  let event = await Event.create({ name: 'Test name' });

  await Event.remove(event._id);
  event = await Event.findOne({ _id: event._id });

  expect(event).toBeNull();
});

it('Should save attendance', async () => {
  const event = await Event.create({ name: 'Test name' });
  const formData = {
    _id: event._id,
    attendance: {
      foxes: { 'first-10 last-10': true },
      hawks: { 'first-11 last-11': true },
      mountainLions: { 'first-12 last-12': true },
      navigators: { 'first-13 last-13': true },
      adventurers: { 'first-14 last-14': true },
    }
  };

  const received = await Event.updateAttendance(formData);
  expect(received).toMatchObject(formData);

  Event.deleteOne({ _id: event._id });
});
