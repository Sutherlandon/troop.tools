import sortBy from 'lodash.sortby';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import db from '../config/database';

// define the default collection name
let collection = 'users';

// use a random table name for testing
if (process.env.NODE_ENV === 'test') {
  collection = `${collection}-${nanoid()}`;
}

// cached users for repeated get calls this cache is updated
// everytime an upate is made to the list
let _users = [];

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  roles: Object,
  troop: String,
}, {
  collection,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
});

UserSchema.statics = {
  async add(formData) {
    const user = await this.create(formData);

    return user;
  },

  async get(id) {
    const user = await this.findOne({ email: id }).lean();
    return user;
  },

  async getAll() {
    const users = await this.find().lean();

    _users = sortBy(users, 'lastName');

    return _users;
  },

  async update(formData) {
    const { email, firstName, lastName, roles, troop } = formData;

    await this.findOneAndUpdate(
      { email },
      { firstName, lastName, roles, troop },
      { new: true }
    ).lean();

    return this.getAll();
  },

  async delete(_id) {
    await this.findOneAndDelete({ _id });
  }
};

let User;
if (process.env.NODE_ENV === 'development') {
  // always start fresh, we need to do this because Next preserves the
  // mongoose instance of User so we cant build a new one
  console.log('Rebuilding User Model');
  delete db.models.User;

  User = db.model('User', UserSchema);
} else {
  User = db.models.User || db.model('User', UserSchema);
}

export default User;
