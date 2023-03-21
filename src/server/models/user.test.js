import { afterAll, expect, it } from '@jest/globals';

import db from '../config/database';
import User from './user.model';

const testTroop = 'NM-1412';

let index = 0;
function makeUser() {
  index += 1;
  const userId = `${index}`.padStart(2, '0');

  return {
    email: `test-${userId}@troop.tools`,
    troop: testTroop,
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

it('Should return an error for a getAll() request with no troop', async () => {
  // Example of asserting throws from a function that returns a promise
  await expect(User.getAll()).rejects.toThrow(
    new Error('Error: You cannot call User.getAll(troop) without specifying a troop')
  );
});

it('Should get all the users sorted by last name', async () => {
  const user1 = makeUser();
  const user2 = makeUser();
  const testUsers = await User.create([
    user2,
    user1,
    { ...makeUser(), troop: 'TX-9874' } // should not be included in the return
  ]);

  const received = await User.getAll(testTroop);
  expect(received.length).toEqual(2);
  expect(received[0].lastName).toEqual(testUsers[1].lastName);

  await Promise.all(testUsers.map(({ _id }) => User.deleteOne({ _id })));
});

it('should update a user\'s name with new values', async () => {
  const user = await User.create(makeUser());

  const formData = {
    email: user.email,
    troop: user.troop,
    firstName: 'Randle',
    lastName: 'Boss',
  };

  const received = await User.update(formData);
  expect(received[0]).toMatchObject(formData);

  await User.deleteOne({ _id: user._id });
});
