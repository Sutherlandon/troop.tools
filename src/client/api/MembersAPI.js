import makeRequest from './makeRequest';

// cache the members when fetched
let _members;

/**
 * Make the request but cache the results for repeated gets
 */
async function makeCacheRequest(params) {
  const { data, error } = await makeRequest(params);

  _members = data;

  return { data, error };
}

/**
 * Calls the API to add a new member
 * @param {Object} item A new member item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   including the new one just added
 */
export function add(item) {
  return makeCacheRequest({
    url: '/api/members',
    method: 'POST',
    data: item,
  });
}

/**
 * Fetches the member list
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 */
export function getAll() {
  if (_members) {
    return { data: _members };
  }

  return makeCacheRequest({
    url: '/api/members',
  });
}

/**
 * Fetches a single member matching the given ID
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the member matching the id
 */
export async function get(id) {
  return makeRequest({
    url: `/api/members/${id}`,
  });
}

/**
 * Calls the API to update a member
 * @param {Object} formData The form data form the update form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of members
 */
export async function update(formData) {
  const { data, error } = await makeRequest({
    url: '/api/members',
    method: 'PUT',
    data: formData,
  });

  // update the member in the cache
  if (data && _members) {
    for (let i = 0; i < _members.length; i++) {
      if (data._id === _members[i]._id) {
        _members[i] = data;
        break;
      }
    }
  }

  return { data, error };
}

/**
 * Calls the API to add an individual advancement
 * @param {Object} formData The form data form the update form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of members
 */
export async function addIndividualAdv(id, formData) {
  const { data, error } = await makeRequest({
    url: `/api/members/${id}`,
    method: 'POST',
    data: formData,
  });

  // update the member in the cache
  if (data && _members) {
    for (let i = 0; i < _members.length; i++) {
      if (data._id === _members[i]._id) {
        _members[i] = data;
        break;
      }
    }
  }

  return { data, error };
}

/**
 * Really and truly deletes a member with all of it's attendance data.
 * @param {String} id The _id of the member to delete
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of members
 */
export function realDelete(id) {
  return makeCacheRequest({
    url: `/api/members/${id}`,
    method: 'DELETE'
  });
}
