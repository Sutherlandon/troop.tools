import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';
import db from '../config/database';

// define the default collection name
let collection = 'members2';

// use a random table name for testing
if (process.env.NODE_ENV === 'test') {
  collection = `${collection}-${nanoid()}`;
}

// cached members for repeated get calls this cache is updated
// everytime an upate is made to the list
let _members = [];

// Model Schema
const MemberSchema = new mongoose.Schema({
  active: Boolean,
  adv: [{
    date: String,
    lessonID: Number,
  }],
  firstName: String,
  lastName: String,
  patrol: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
});

// Static Model Methods
MemberSchema.statics = {
  /**
   * Adds a new member to the system
   * @param {Obejct} formData Form data contianing the new item
   * @returns All members including the new one
   */
  async add(formData) {
    // put the new member in the DB
    const member = await this.create(formData);

    return member;
  },

  /**
   * Gets a list of all the members in the DB
   * @param {Boolean} bustCache True means ignore bust the cache and fetch all new data
   * @returns A list of all members
   */
  async getAll() {
    // fetch the members data
    const members = await this.find().lean();

    // cache the members
    _members = sortBy(members, ['patrol', 'firstName']);

    return _members;
  },

  /**
   * Updates the info for an event.
   * @param {Obejct} formData Event data
   * @returns The new list of events
   */
  async update(formData) {
    const { _id, ...update } = formData;

    // make the update
    const member = await this.findOneAndUpdate({ _id }, { ...update }, { new: true });

    return member;
  },

  /**
   * Deletes a member from the DB and returns an updated list of members
   * @param {String} _id The _id of the user to delete
   * @returns The new list of members
   */
  async remove(_id) {
    // delete the member from the DB
    await this.deleteOne({ _id });
  },

  /**
   * Add an advancement entry to the member's record
   * @param {String} id Member ID
   * @param {Object} entry lessonID and date of the entry
   */
  async addAdvancement(id, entry) {
    const update = { $push: { adv: entry } };
    const member = await this.findOneAndUpdate({ _id: id }, update, { new: true });
    return member;
  },

  /**
   * Remove an advancement entry from the member's record
   * @param {String} id Member ID
   * @param {Object} entry lessonID and date of the entry
   */
  async removeAdvancement(id, entry) {
    // filter the entry out of the member's list
    const member = await this.findOne({ _id: id });
    const filterdAdv = member.adv
      .filter((entry2) => entry.lessonID !== entry2.lessonID || entry.date !== entry2.date);

    // updated the member with the filtered adv
    const newMember = await this.findOneAndUpdate({ _id: id }, { adv: filterdAdv }, { new: true });
    return newMember;
  }
};

let Member;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // db instance of Member so we cant build a new one
  console.log('Rebuilding Member Model');
  delete db.models.Member;

  Member = db.model('Member2', MemberSchema);
} else {
  Member = db.models.Member || db.model('Member2', MemberSchema);
}

export default Member;
