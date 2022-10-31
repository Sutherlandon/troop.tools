import mongoose from 'mongoose';
import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';
import db from '../config/database';

// define the default collection name
let collection = 'lessons';

// use a random table name for testing
if (process.env.NODE_ENV === 'test') {
  collection = `${collection}-${nanoid()}`;
}

// cached members for repeated get calls this cache is updated
// everytime an upate is made to the list
let _lessons = [];

// Model Schema
const LessonSchema = new mongoose.Schema({
  lessonID: String,
  branch: String,
  name: String,
  type: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
});

// Static Model Methods
LessonSchema.statics = {
  /**
   * Gets a list of all the Lessons in the DB
   * @param {Boolean} bustCache True means ignore bust the cache and fetch all new data
   * @returns A list of all members
   */
  async getAll() {
    // fetch the members data
    const lessons = await this.find().lean();

    // cache the members
    _lessons = sortBy(lessons, ['branch', 'type']);

    return _lessons;
  },
};

let Lesson;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // db instance of Member so we cant build a new one
  console.log('Rebuilding Lesson Model');
  delete db.models.Lesson;

  Lesson = db.model('Member', LessonSchema);
} else {
  Lesson = db.models.Member || db.model('Lesson', LessonSchema);
}

export default Lesson;
