import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';

// define the default collection name
let collection = 'events';

// use a random table name for testing
if (process.env.NODE_ENV === 'test') {
  collection = `${collection}-${nanoid()}`;
}

// cached schedule for repeated get calls this cache is updated
// everytime an upate is made to the list
let _events = [];

const EventSchema = new mongoose.Schema({
  attendance: {},
  branch: String,
  date: String,
  name: String,
  type: String,
  year: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

EventSchema.statics = {
  /**
   * Adds a new event to the schedule
   * @param {Obejct} formData Form data contianing the new item
   * @returns the updated schedule
   */
  async add(formData) {
    const newEvent = {
      ...formData,
      attendance: {},
      id: nanoid(),
    };

    // create the new schedule
    await this.create(newEvent);

    // return the updated schedule
    const events = await this.getAll();

    return events;
  },

  async getAll() {
    // fetch the members data
    const events = await this.find().lean();

    // cache the events
    _events = sortBy(events, 'date');

    return _events;
  },

  /**
   * Deletes a event from the DB and returns the updated schedule
   * @param {String} name The name of the user to delete
   * @returns The new list of events
   */
  async remove(event) {
    const { name, date } = event;

    // delete the event from the DB
    await this.deleteOne({ name, date });

    // return the updated schedule
    const events = await this.getAll();

    return events;
  },

  /**
   * Updates the info for an event.
   * @param {Obejct} formData Event data 
   * @returns The new list of events
   */
  async update(formData) {
    const { _id, ...eventUpdate } = formData;

    await this.findOneAndUpdate({ _id }, { ...eventUpdate });

    // return the updated schedule
    const schedule = await this.getAll();

    return schedule;
  },

  /**
   * Sets the attendance for an event
   * @param {Obejct} formData Attendance data
   * @returns The new list of events
   */
  async updateAttendance(formData) {
    const { _id, attendance } = formData;

    // don't save false values
    const filteredAttendance = {
      Foxes: {},
      Hawks: {},
      'Mountain Lions': {},
    };

    Object.keys(attendance).forEach((patrol) => {
      Object.keys(attendance[patrol]).forEach((member) => {
        if (attendance[patrol][member]) {
          filteredAttendance[patrol][member] = true;
        }
      })
    })

    // put the new event in the DB
    await this.findOneAndUpdate({ _id }, { $set: { attendance: filteredAttendance } });

    // return the updated schedule
    const schedule = await this.getAll();

    return schedule;
  },
};


let Event;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // mongoose instance of Event so we cant build a new one
  console.log('Rebuilding Event Model')
  delete mongoose.models.Event;

  Event = mongoose.model('Event', EventSchema);
} else {
  Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
}

export default Event;