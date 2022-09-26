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
    _id: false, // no _id's for $addToSet comparison to work
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
   * Updates the advancement of many members based on the formData submitted
   * @param {Object} formData Data from the attendance form
   */
  async updateAdvancement(formData) {
    const { members, lessonID, date } = formData;
    const memberIDs = Object.keys(members);

    const entry = { lessonID, date };
    let addMembers = [];
    let removeMembers = [];

    // build the add/remove lists
    memberIDs.forEach((_id) => {
      if (members[_id]) {
        addMembers.push(_id);
      } else {
        removeMembers.push(_id);
      }
    });

    addMembers = await this.updateMany(
      { _id: { $in: addMembers } },
      { $addToSet: { adv: entry } },
      { new: true }
    );

    removeMembers = await this.updateMany(
      { _id: { $in: removeMembers } },
      { $pull: { adv: entry } },
      { new: true }
    );

    const updatedMembers = await this.find({ _id: { $in: memberIDs } });

    console.log(updatedMembers[0].adv);

    return updatedMembers;
  },

  /**
   * Add an advancement entry to the member's record
   * @param {String} _id Member ID
   * @param {Object} entry lessonID and date of the entry
   */
  async addAdvancement(_id, entry) {
    const update = { $addToSet: { adv: entry } };
    const member = await this.findOneAndUpdate({ _id }, update, { new: true });
    return member;
  },

  /**
   * Remove an advancement entry from the member's record
   * @param {String} _id Member ID
   * @param {Object} entry lessonID and date of the entry
   */
  async removeAdvancement(_id, entry) {
    // pull the entry out of the member's advancement list
    const update = { $pull: { adv: entry } };
    const member = await this.findOneAndUpdate({ _id }, update, { new: true });
    return member;
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
