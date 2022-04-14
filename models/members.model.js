import sortBy from 'lodash.sortby';
import * as yup from 'yup';
import { nanoid } from 'nanoid';

import { docClient } from './awsConfig';

let _members = [];

export const PATROLS = [
  'Foxes',
  'Hawks',
  'Mountain Lions',
  'Navigators',
  'Adventurers',
];

export const PATROL_COLORS = {
  'Foxes': '#b97c38',
  'Hawks': '#eab71b',
  'Mountain Lions': '#cea54a',
};

export const memberSchema = yup.object({
  id: yup.string(),
  name: yup.string().required('This field cannot be left blank'),
  patrol: yup.string().oneOf(PATROLS).required('This field cannot be left blank'),
});

/**
 * Adds a new member to the system 
 * @param {Obejct} formData Form data contianing the new item
 * @returns All members including the new one
 */
export async function add(formData) {
  const item = {
    id: nanoid(),
    ...formData
  };

  // validate the new member
  try {
    await memberSchema.validate(item);
  } catch (err) {
    console.error(err);
  }

  // put the new member in the DB
  try {
    await docClient.put({ TableName: 'members', Item: item }).promise();
  } catch (err) {
    console.error("Unable to add new member.", JSON.stringify(item), err);
  }

  // return a new list of all memebers
  const members = await getAll();

  return members;
}


/**
 * Gets a list of all the members in the DB
 * @param {Boolean} bustCache True means ignore bust the cache and fetch all new data
 * @returns A list of all members
 */
export async function getAll() {
  try {
    // fetch the members data
    const results = await docClient.scan({ TableName: 'members' }).promise();

    // cache the members
    _members = sortBy(results.Items, ['patrol', 'name']);

  } catch (err) {
    console.error("Unable to fetch Members.", err);
  }

  return _members;
}

/**
 * Updates the info for an event.
 * @param {Obejct} formData Event data 
 * @returns The new list of events
 */
export async function update(formData) {
  const { id, name, patrol } = formData;

  try {
      // just update
      await docClient.update({
        TableName: 'members',
        Key: { id },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#patrol': 'patrol',
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':patrol': patrol,
        },
        UpdateExpression: 'SET #name = :name, #patrol = :patrol',
      }).promise();
  } catch (err) {
    console.error("Unable to updated member", JSON.stringify(formData), err);
  }

  // return the updated memberList
  const schedule = await getAll();

  return schedule;
}


/**
 * Deletes a member from the DB and returns an updated list of members
 * @param {String} id The id of the user to delete
 * @returns The new list of members
 */
export async function remove(id) {
  // delete the member from the DB
  try {
    await docClient.delete({ TableName: 'members', Key: { id } }).promise();
  } catch (err) {
    console.error(`Unable to delete member. ${id}`, err);
  }

  // return a new list of all memebers
  const members = await getAll(true);

  return members;
}

// const testMembers = [
//   { name: 'Elijah Sutherland', patrol: 'fox' },
//   { name: 'Mark Griffin', patrol: 'fox' },
//   { name: 'Fin Gauss', patrol: 'hawk' },
//   { name: 'Conner Holowell', patrol: 'hawk' },
//   { name: 'Colton wasowski', patrol: 'lion' },
//   { name: 'Collin McGuire-Something', patrol: 'lion' },
// ]

// testMembers.forEach((item) =>
//   docClient.put({ TableName: 'members', Item: item }, function(err, data) {
//       if (err) {
//           console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("PutItem succeeded:", JSON.stringify(item, null, 2));
//       }
//   }));