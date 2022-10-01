import {
  afterAll,
  expect,
  it,
} from '@jest/globals';

import db from '../config/database';
import User from './user.model';

const testUser = {
  email: 'test@gmail.com',
  issuer: 'testrandomtokenstringthing',
  firstName: 'Mike',
  lastName: 'Wasowski',
};
const testUser2 = {
  email: 'test2@gmail.com',
  issuer: 'testrandomtokenstringthing2',
  firstName: 'Sully',
  lastName: 'Moster',
};

afterAll(async() => {
  await User.collection.drop();
  db.close();
});

it('should add a new user', async () => {
  const received = await User.add(testUser);
  expect(received).toMatchObject(testUser);
});

it('Should get a user by email', async () => {
  const received = await User.get(testUser.email);
  expect(received).toMatchObject(testUser);
});

it('Should get a user by issuer', async () => {
  const received = await User.get(testUser.issuer);
  expect(received).toMatchObject(testUser);
});

it('Should get all the users sorted by last name', async () => {
  await User.create(testUser2);
  const received = await User.getAll();
  expect(received.length).toEqual(2);
  expect(received[0].lastName).toEqual(testUser2.lastName);
});

it('should update a user\'s name with new values', async () => {
  const user = await User.findOne({ issuer: testUser.issuer });

  const formData = {
    _id: user._id,
    firstName: 'Randle',
    lastName: 'Boss',
  };

  const received = await User.update(formData);

  expect(received[0]).toMatchObject(formData);
});
