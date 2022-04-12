import sortBy from 'lodash.sortby';
import * as yup from 'yup';
import { format } from 'date-fns';
import { docClient } from './awsConfig';

let _schedule = [];

export const EVENT_TYPES = [
  'Core',
  'Elective',
  'HTT',
  'Other',
];

export const BRANCHES = [
  'Heritage',
  'Hobbies',
  'Life Skills',
  'Outdoor Skills',
  'Science/Tech',
  'Sports/Fitness',
  'Values',
  'Award',
  'Board',
  'Camp',
  'Fundraiser',
  'General',
  'Day Hike',
];

export const BRANCH_COLORS = {
  'Award': {
    b: 'purple',
    t: 'white',
  },
  'Board': {
    b: 'lightgray',
    t: 'black',
  },
  'Camp': {
    b: 'yellow',
    t: 'black',
  },
  'Day Hike': {
    b: 'yellow',
    t: 'black',
  },
  'Fundraiser': {
    b: 'limegreen',
    t: 'black',
  },
  'General': {
    b: 'white',
    t: 'black',
  },
  'Heritage': {
    b: '#896400',
    t: 'white',
  },
  'Hobbies': {
    b: '#212121',
    t: 'white',
  },
  'Life Skills': {
    b: '#8c1006',
    t: 'white',
  },
  'Outdoor Skills': {
    b: '#005283',
    t: 'white',
  },
  'Science/Tech': {
    b: '#ffb130',
    t: 'black',
  },
  'Sports/Fitness': {
    b: '#425b21',
    t: 'white',
  },
  'Values': {
    b: '#c5171c',
    t: 'white',
  }
}

const blankError = 'This field cannot be left blank';
export const EventSchema = yup.object({
  attendance: yup.object(),
  branch: yup.string().oneOf(BRANCHES).required(blankError),
  date: yup.string().required(blankError),
  name: yup.string().required(blankError),
  type: yup.string().oneOf(EVENT_TYPES).required(blankError),
  year: yup.number(),
});

/**
 * Adds a new event to the schedule
 * @param {Obejct} formData Form data contianing the new item
 * @returns the updated schedule
 */
export async function add(formData) {
  const item = {
    ...formData,
    attendance: {}
  };

  // validate the new event
  try {
    await EventSchema.validate(item);
  } catch (err) {
    console.error(err);
  }

  try {
    // put the new event in the DB
    await docClient.put({ TableName: 'events', Item: item }).promise();

  } catch (err) {
    console.error("Unable to add new event.", item, err);
  }

  // return the updated schedule
  const schedule = await get();

  return schedule;
}

export async function get() {
  try {
    // fetch the members data
    const results = await docClient.scan({ TableName: 'events' }).promise();

    // cache the events
    _schedule = sortBy(results.Items, 'date');

  } catch (err) {
    console.error("Unable to fetch Events.", err);
  }

  return _schedule;
}

/**
 * Deletes a event from the DB and returns the updated schedule
 * @param {String} name The name of the user to delete
 * @returns The new list of events
 */
export async function remove(item) {
  const { name, date } = item;

  // delete the event from the DB
  try {
    await docClient.delete({ TableName: 'events', Key: { name, date } }).promise();
  } catch (err) {
    console.error(`Unable to delete event. ${name}, ${date}`, err);
  }

  // return the updated schedule
  const schedule = await get();

  return schedule;
}

/**
 * Updates the info for an event.
 * If the name or date (primary key fields) are updated, we have to delete
 * the record and create a new one.  Since this is 90% of what updates are
 * going to be, we will just do that in any case for simplicity.
 * @param {Obejct} formData Event data 
 * @returns The new list of events
 */
export async function update(formData) {
  const { eventIndex, year = '2022', ...eventData } = formData;
  const { name, date, attendance } = _schedule[eventIndex];
  const item = { ...eventData, attendance };

  try {
    // delete and recreate if one of the primary key values has been changed
    if (name !== eventData.name || date !== eventData.date) {
      // delete and create the new record with a transaction
      await docClient.transactWrite({
        TransactItems: [
          { 'Delete': { TableName: 'events', Key: { name, date } } },
          { 'Put': { TableName: 'events', Item: item } },
        ]
      }).promise();

    } else {
      // just update
      await docClient.update({
        TableName: 'events',
        Key: { name, date },
        ExpressionAttributeNames: {
          '#type': 'type',
          '#branch': 'branch',
          '#year': 'year',
        },
        ExpressionAttributeValues: {
          ':type': eventData.type,
          ':branch': eventData.branch,
          ':year': year
        },
        UpdateExpression: 'SET #type = :type, #branch = :branch, #year = :year',
      }).promise();
    }
  } catch (err) {
    console.error("Unable to updated event", JSON.stringify(formData), err);
  }

  // return the updated schedule
  const schedule = await get();

  return schedule;
}

/**
 * Sets the attendance for an event
 * @param {Obejct} formData Attendance data
 * @returns The new list of events
 */
export async function updateAttendance(formData) {
  const { event: { name, date }, members } = formData;
  const patrol = formData.patrol.toLowerCase();

  // put the new event in the DB
  try {
    const updatedEvent = await docClient.update({
      TableName: 'events',
      Key: { name, date },
      ExpressionAttributeNames: { '#patrol': patrol },
      ExpressionAttributeValues: { ':members': members },
      UpdateExpression: 'SET attendance.#patrol = :members',
      ReturnValues: 'ALL_NEW',
    }).promise();
  } catch (err) {
    console.error("Unable to update attendance.", JSON.stringify(formData), err);
  }

  // return the updated schedule
  const schedule = await get();

  return schedule;
}
