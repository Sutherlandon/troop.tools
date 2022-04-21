import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';

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
  name: String,
  patrol: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  }
});

// Static Model Methods
MemberSchema.statics = {
  /**
   * Adds a new member to the system 
   * @param {Obejct} formData Form data contianing the new item
   * @returns All members including the new one
   */
  async add(formData) {

    const newMember = { ...formData };

    // put the new member in the DB
    await this.create(newMember);

    // return a new list of all memebers
    const members = await this.getAll();

    return members;
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
    _members = sortBy(members, ['patrol', 'name']);

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
    await this.findOneAndUpdate({ _id }, { ...update });

    // return the updated memberList
    const members = await this.getAll();

    return members;
  },


  /**
   * Deletes a member from the DB and returns an updated list of members
   * @param {String} _id The _id of the user to delete
   * @returns The new list of members
   */
  async remove(_id) {
    // delete the member from the DB
    await this.deleteOne({ _id });

    // return a new list of all memebers
    const members = await this.getAll();

    return members;
  },
};

let Member;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // mongoose instance of Member so we cant build a new one
  console.log('Rebuilding Member Model')
  delete mongoose.models.Member;

  Member = mongoose.model('Member', MemberSchema);
} else {
  Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);
}

export default Member;
