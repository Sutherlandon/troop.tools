import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';

import db from '../config/database';
import { arrayToObject } from '../../shared/helpers';
import {
  LESSONS_BY_ID,
  PATROLS,
  PATROLS_ARRAY
} from '../../shared/constants';

// define the default collection name
let collection = 'members';

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
    lessonID: String,
    patrolID: String,
  }],
  firstName: String,
  lastName: String,
  patrol: String,
  troop: String,
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
   * @param {String} troop The troop to add the member too
   * @returns All members including the new one
   */
  async add(formData, troop) {
    // put the new member in the DB
    const member = await this.create({ ...formData, troop });
    return member;
  },

  /**
   * Gets a list of all the members in the DB
   * @param {String} troop The troop to return all members for.
   * @returns A list of all members
   */
  async getAll(troop) {
    // troop is required
    if (!troop) {
      throw new Error('Error: You cannot call Member.getAll(troop) without specifying a troop');
    }

    // fetch the members data
    const members = await this.find({ troop }).lean();
    const patrolKeysById = {};
    PATROLS_ARRAY.forEach((p) => (patrolKeysById[p.id] = p.key));

    const membersHydratedd = members.map((member) => {
      const advHydratedd = member.adv
        .map((entry) => ({
          ...entry,
          ...LESSONS_BY_ID[entry.lessonID],
          patrol: patrolKeysById[entry.patrolID]
        }));
      return { ...member, adv: advHydratedd };
    });

    // cache the members
    _members = sortBy(membersHydratedd, ['patrol', 'firstName']);

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
  async updateAdvancement(formData, troop) {
    const { attendance, lessonID, date } = formData;
    const memberIDs = Object.keys(attendance);
    const members = arrayToObject(await Member.find({ troop }), '_id');

    // build the add/remove lists
    const updatedMembers = await Promise.all(
      memberIDs.map(async (_id) => {
        const entry = {
          date,
          lessonID,
          patrolID: PATROLS[members[_id].patrol].id
        };

        if (attendance[_id]) {
          return this.addAdvancement(_id, entry);
        } else {
          return this.removeAdvancement(_id, entry);
        }
      })
    );

    return updatedMembers;
  },

  /**
   * Add an advancement entry to the member's record
   * @param {String} _id Member ID
   * @param {Object} entry lessonID and date of the entry
   */
  async addAdvancement(_id, entry) {
    const update = { $addToSet: { adv: entry } };
    const member = await this.findOneAndUpdate({ _id }, update, { new: true }).lean();
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
    const member = await this.findOneAndUpdate({ _id }, update, { new: true }).lean();
    return member;
  }
};

let Member;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // db instance of Member so we cant build a new one
  console.log('Rebuilding Member Model');
  delete db.models.Member;

  Member = db.model('Member', MemberSchema);
} else {
  Member = db.models.Member || db.model('Member', MemberSchema);
}

export default Member;
