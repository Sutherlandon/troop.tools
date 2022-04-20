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
  id: {
    type: String,
    unique: true,
  },
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

    const newMember = {
      id: nanoid(),
      ...formData
    };

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
    const results = await this.find().lean();

    // cache the members
    _members = sortBy(results, ['patrol', 'name']);

    return _members;
  },


  /**
   * Updates the info for an event.
   * @param {Obejct} formData Event data 
   * @returns The new list of events
   */
  async update(formData) {
    const { id, ...update } = formData;

    // make the update
    await this.findOneAndUpdate({ id }, { ...update });

    // return the updated memberList
    const members = await this.getAll();

    return members;
  },


  /**
   * Deletes a member from the DB and returns an updated list of members
   * @param {String} id The id of the user to delete
   * @returns The new list of members
   */
  async remove(id) {
    // delete the member from the DB
    await this.deleteOne({ id });

    // return a new list of all memebers
    const members = await this.getAll();

    return members;
  },
};

const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);

export default Member;
