import {
  afterAll,
  beforeAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import Member from './member.model';

let testMembers;

let index = 0;
function makeMember(patrol) {
  index += 1;
  const memberId = `${index}`.padStart(2, '0');

  return {
    active: true,
    name: `first-${memberId} last-${memberId}`,
    patrol,
  };
}

afterAll(async() => {
  await Member.collection.drop();
  db.close();
});

beforeAll(async () => {
  const testUsersData = [
    makeMember('fox'),
    makeMember('fox'),
    makeMember('hawk'),
    makeMember('hawk'),
    makeMember('mountain lion'),
    makeMember('mountain lion'),
    makeMember('navigator'),
    makeMember('navigator'),
    makeMember('adventurer'),
    makeMember('adventurer'),
  ];

  testMembers = await Member.create(testUsersData);
});

it('Should get all the members', async () => {
  const received = await Member.getAll();
  expect(received.length).toEqual(10);
  expect(received[0]).toMatchObject({ name: 'first-09 last-09' });
});

it('Should add a new member', async () => {
  const formData = makeMember('adventurer');
  const received = await Member.add(formData);
  expect(received[2]).toMatchObject({ name: 'first-11 last-11' });
});

it('Should update a member', async () => {
  const formData = {
    _id: testMembers[0]._id,
    name: 'John 117',
  };

  const received = await Member.update(formData);
  expect(received[3]).toMatchObject({ name: 'John 117' });
});

it('Should remove a member', async () => {
  const received = await Member.remove(testMembers[0]._id);
  expect(received.filter(m => m._id === testMembers[0]._id).length).toEqual(0);
});
