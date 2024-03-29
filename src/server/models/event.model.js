import crypto from 'crypto';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';
import { LESSONS_BY_ID } from '../../shared/constants';

import db from '../config/database';
import Member from './member.model';
import isEmpty from 'lodash.isempty';

// define the default collection name
let collection = 'events';

// use a random table name for testing
if (process.env.NODE_ENV === 'test') {
  collection = `${collection}-${nanoid()}`;
}

// cached events for repeated get calls this cache is updated
// everytime an upate is made to the list
let _events = [];

const EventSchema = new mongoose.Schema({
  attendance: [String],
  branch: String,
  date: String,
  desc: String,
  lessonID: String,
  title: String,
  troop: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
});

EventSchema.statics = {
  /**
   * Adds a new event to the list of events
   * @param {Object} formData Form data contianing the new item
   * @param {String} troop The troop this even belongs to
   * @returns the event that was created
   */
  async add(formData, troop) {
    // create the new event
    const event = await this.create({ ...formData, troop });

    return event;
  },

  /**
   * Calculates a hash of the events attendance and lessonID for verification
   * of latest version used in the document merge strategy.
   * @param {Object} event And event object
   * @returns sha256 representation of the events Attendance and LessonID
   */
  getHash(event) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(event.attendance) + event.lessonID)
      .digest('hex');
  },

  /**
   * Hydrates the Lesson and Attendance records of an event
   * @param {Object} event And event object
   * @returns An object with hydrated lesson and attendance records
   */
  async hydrate({ attendance, lessonID, ...rest }) {
    const event = { ...rest };
    event.date = dayjs(event.date).format();

    // hydrate a lesson if it exists
    if (lessonID) {
      event.lesson = LESSONS_BY_ID[lessonID];
    }

    // hydrate the members in attendence
    if (isEmpty(attendance)) {
      event.attendance = [];
    } else {
      event.attendance = (await Member.find({ _id: { $in: attendance } }))
        .filter(({ active }) => active)
        .map((
          { _id, patrol, firstName, lastName }
        ) => (
          { _id, patrol, name: `${firstName} ${lastName}` }
        ));
    }

    return event;
  },

  /**
   * Retrieves a single record by the given _id
   * @param {String} id The _id of a record
   */
  async getById(id) {
    const event = await this.findOne({ _id: id }).lean();

    // hydrate the current event
    const hydratedEvent = await this.hydrate(event);

    // calculate hash for document merge strategy
    hydratedEvent.hash = this.getHash(event);

    return hydratedEvent;
  },

  /**
   * Gets a list of all the events
   * @param {String} troop The troop to return all events for.
   * @returns An array of all the events
   */
  async getAll(troop) {
    // troop is required
    if (!troop) {
      throw new Error('Error: You cannot call Event.getAll(troop) without specifying a troop');
    }

    // pull all events and hydrate the lessons if they exist
    const events = await Promise.all(
      (await this.find({ troop }).lean())
        .map(this.hydrate)
    );

    // cache the events
    // TODO: use the cache
    _events = sortBy(events, 'date');

    return _events;
  },

  /**
   * Gets a list of events for a given year
   * @param {String} troop The troop to return all events for.
   * @param {String} year The year you want events for
   * @returns An Object with the `events` as an array of events belonging to the given year, and
   *  `yearOptions` an array of all the years this troop has events
   */
  async getByYear(year, troop) {
    const allEvents = await this.getAll(troop);

    // assemble a list of unique years
    const years = allEvents.reduce((years, event) => {
      const year = dayjs(event.date).year();
      if (!years.includes(year)) {
        years.push(year);
      }

      return years;
    }, []);

    // assemble list of events for the given year
    const events = allEvents.filter((event) => String(dayjs(event.date).year()) === year);
    const schedule = { events, years };

    return schedule;
  },

  /**
   * Deletes a event from the DB
   * @param {String} name The name of the user to delete
   * @returns The new list of events
   */
  async remove(_id) {
    // delete the event from the DB
    await this.deleteOne({ _id });
  },

  /**
   * Updates the info for an event.
   * @param {Obejct} formData Event data
   * @returns The new list of events
   */
  async update(formData) {
    const { _id, ...eventUpdate } = formData;

    const event = await this.findOneAndUpdate({ _id }, { ...eventUpdate }, { new: true });

    return event;
  },

  /**
   * Sets the attendance for an event
   * @param {Obejct} formData Attendance data
   * @returns The new list of events
   */
  async updateAttendance(formData) {
    const { _id } = formData;
    const attendance = Object.keys(formData.attendance)
      .filter((key) => formData.attendance[key]);

    // put the new event in the DB
    const event = await this.findOneAndUpdate({ _id }, { $set: { attendance } }, { new: true });

    return event;
  },
};

let Event;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // mongoose instance of Event so we cant build a new one
  console.log('Rebuilding Event Model');
  delete db.models.Event;

  Event = db.model('Event', EventSchema);
} else {
  Event = db.models.Event || db.model('Event', EventSchema);
}

export default Event;
