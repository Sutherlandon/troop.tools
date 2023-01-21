import { afterAll, expect, it } from '@jest/globals';

import db from '../config/database';
import User from './user.model';

let index = 0;
function makeUser() {
  index += 1;
  const userId = `${index}`.padStart(2, '0');

  return {
    email: `test-${userId}@troop.tools`,
    troop: 'NM1412',
    firstName: `first-${userId}`,
    lastName: `last-${userId}`,
  };
}

afterAll(async() => {
  await User.collection.drop();
  db.close();
});

it('should add a new user', async () => {
  const user = makeUser();
  const received = await User.add(user);
  expect(received).toMatchObject(user);

  await User.deleteOne({ _id: received._id });
});

it('Should get a user by email', async () => {
  const user = await User.create(makeUser());

  const received = await User.get(user.email);
  expect(received._id).toEqual(user._id);

  await User.deleteOne({ _id: received._id });
});

it('Should get a user by issuer', async () => {
  const user = await User.create(makeUser());

  const received = await User.get(user.issuer);
  expect(received._id).toEqual(user._id);

  await User.deleteOne({ _id: received._id });
});

it('Should get all the users sorted by last name', async () => {
  const testUser1 = makeUser();
  const testUser2 = makeUser();
  const user = await User.create(testUser2);
  const user2 = await User.create(testUser1);

  const received = await User.getAll();
  expect(received.length).toEqual(2);
  expect(received[0].lastName).toEqual(user2.lastName);

  await User.deleteOne({ _id: user._id });
  await User.deleteOne({ _id: user2._id });
});

it('should update a user\'s name with new values', async () => {
  const user = await User.create(makeUser());

  const formData = {
    email: user.email,
    firstName: 'Randle',
    lastName: 'Boss',
  };

  const received = await User.update(formData);
  expect(received).toMatchObject(formData);

  await User.deleteOne({ _id: user._id });
});
