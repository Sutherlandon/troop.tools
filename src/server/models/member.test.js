import dayjs from 'dayjs';
import {
  afterAll,
  beforeAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import Lesson from './lesson.model';
import Member from './member.model';
import { PATROLS } from '../../shared/constants';

let index = 0;
function makeMember(patrol, adv = []) {
  index += 1;
  const memberId = `${index}`.padStart(2, '0');

  return {
    active: true,
    adv,
    firstName: `first-${memberId}`,
    lastName: `last-${memberId}`,
    patrol,
  };
}

const testDate = dayjs().format('DD/MM/YYYY');
const testLessons = [{
  lessonID: 'hbhmknwaozr5',
  branch: 'Heritage',
  name: 'Christian Heritage',
  type: 'core'
}, {
  lessonID: '33vyzrr0umju',
  branch: 'Heritage',
  name: 'Flag Etiquette and History',
  type: 'core'
}, {
  lessonID: 'etq3e8060lwm',
  branch: 'Heritage',
  name: 'Founding Fathers',
  type: 'core'
}];

beforeAll(async () => {
  await Lesson.create(testLessons);
});

afterAll(async () => {
  await Member.collection.drop();
  await Lesson.collection.drop();
  db.close();
});

it('Should get all the members', async () => {
  // first-01 for sorting name along with patrol
  const testAdvEntry = {
    date: testDate,
    lessonID: testLessons[0].lessonID,
    patrolID: PATROLS.adventurers.id,
  };
  const adventurer = makeMember('adventurers', [testAdvEntry]);
  const testMembers = await Member.create([
    makeMember('foxes'),
    makeMember('hawks'),
    makeMember('mountainLions'),
    makeMember('navigators'),
    makeMember('adventurers'),
    adventurer,
  ]);

  const received = await Member.getAll();
  expect(received.length).toEqual(6);
  expect(received[0].firstName).toEqual('first-01');
  expect(received[0].adv[0]).toMatchObject({
    ...testAdvEntry,
    ...testLessons[0],
    patrol: 'adventurers',
  });

  await Promise.all(testMembers.map(({ _id }) => Member.deleteOne({ _id })));
});

it('Should add a new member', async () => {
  const formData = makeMember('foxes'); // 7th
  const received = await Member.add(formData);
  expect(received).toMatchObject({
    active: true,
    adv: [],
    firstName: 'first-07',
    lastName: 'last-07',
    patrol: 'foxes',
  });

  Member.deleteOne({ _id: received._id });
});

it('Should update a member', async () => {
  const member = await Member.create(makeMember('foxes')); // 8th
  const formData = {
    _id: member._id,
    firstName: 'John',
    lastName: '117',
  };

  const received = await Member.update(formData);
  expect(received).toMatchObject({
    firstName: 'John',
    lastName: '117',
  });

  Member.deleteOne({ _id: member._id });
});

it('Should remove a member', async () => {
  let member = await Member.create(makeMember('mountainLions')); // 9th

  await Member.remove(member._id);
  member = await Member.findOne({ _id: member._id });

  expect(member).toBeNull();
});

it('Should add an advancement entry on one member', async () => {
  const member = await Member.create(makeMember('hawks')); // 10th
  const testEntry = {
    date: '2022-09-18',
    lessonID: testLessons[0].lessonID,
    patrolID: 'ib6d767d2f8e',
  };

  const received = await Member.addAdvancement(member._id, testEntry);
  expect(received.adv[0]).toMatchObject(testEntry);

  await Member.deleteOne({ _id: member._id });
});

it('Should removed an advancement entry on one member', async () => {
  const testEntry = {
    date: '2022-09-18',
    lessonID: testLessons[0].lessonID,
    patrolID: 'ib6d767d2f8e',
  };
  const member = await Member.create(makeMember('hawks', [testEntry])); // 11th

  const received = await Member.removeAdvancement(member._id, testEntry);
  expect(received.adv.length).toEqual(0);

  await Member.deleteOne({ _id: member._id });
});

it('Should update the advancement entries on many members', async () => {
  const testEntry = {
    lessonID: testLessons[0].lessonID,
    date: '2022-09-18',
  };
  const testMembers = await Member.create([
    makeMember('hawks', [{ ...testEntry, patrolID: 'ib6d767d2f8e' }]), // 12th
    makeMember('foxes'), // 13th
    makeMember('adventurers', [{ ...testEntry, patrolID: 'x1ff1de77400' }]), // 14th
  ]);
  const formData = {
    attendance: {
      [testMembers[0]._id]: true,
      [testMembers[1]._id]: true,
      [testMembers[2]._id]: false,
    },
    ...testEntry,
  };

  const received = await Member.updateAdvancement(formData);
  expect(received[0].adv.length).toEqual(1); // doesn't add duplicates
  expect(received[1].adv.length).toEqual(1); // adds if true and not present
  expect(received[2].adv.length).toEqual(0); // removes if false and present

  // tests adding patrol ID to adv entry
  expect(received[1].adv[0]).toEqual({ ...testEntry, patrolID: 'l3c59dc048e8' });

  await Promise.all(testMembers.map(({ _id }) => Member.deleteOne({ _id })));
});
