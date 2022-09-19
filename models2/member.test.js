import {
  afterAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import Member from './member.model';

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

afterAll(async() => {
  await Member.collection.drop();
  db.close();
});

it('Should get all the members', async () => {
  // first-01 for sorting name along with patrol
  const adventurer = makeMember('adventurer');
  const testUsersData = [
    makeMember('fox'),
    makeMember('hawk'),
    makeMember('mountainLion'),
    makeMember('navigator'),
    makeMember('adventurer'),
    adventurer,
  ];
  await Member.create(testUsersData);

  const received = await Member.getAll();
  expect(received.length).toEqual(6);
  expect(received[0].firstName).toEqual('first-01');
});

it('Should add a new member', async () => {
  const formData = makeMember('fox'); // 7th
  const received = await Member.add(formData);
  expect(received).toMatchObject({
    active: true,
    adv: [],
    firstName: 'first-07',
    lastName: 'last-07',
    patrol: 'fox',
  });

  Member.deleteOne({ _id: received._id });
});

it('Should update a member', async () => {
  const member = await Member.create(makeMember('fox')); // 8th
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
  let member = await Member.create(makeMember('mountainLion')); // 9th

  await Member.remove(member._id);
  member = await Member.findOne({ _id: member._id });

  expect(member).toBeNull();
});

it('Should add an advancement entry on the member', async () => {
  const member = await Member.create(makeMember('hawk')); // 10th
  const testEntry = { lessonID: 1, date: '2022-09-18' };

  const received = await Member.addAdvancement(member._id, testEntry);
  expect(received.adv[0]).toMatchObject(testEntry);

  await Member.deleteOne({ _id: member._id });
});

it('Should removed an advancement entry on the member', async () => {
  const testEntry = { lessonID: 1, date: '2022-09-18' };
  const member = await Member.create(makeMember('hawk', [testEntry])); // 11th

  const received = await Member.removeAdvancement(member._id, testEntry);
  expect(received.adv.length).toEqual(0);

  await Member.deleteOne({ _id: member._id });
});
