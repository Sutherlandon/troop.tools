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
export function get() {
  if (_members) {
    return { data: _members };
  }

  return makeCacheRequest({
    url: '/api/members',
  });
}

/**
 * Calls the API to add a new member
 * @param {Object} item A new member item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   excluding the new one just removed
 */
export function remove(id) {
  return makeCacheRequest({
    url: `/api/members/${id}`,
    method: 'DELETE',
  });
}

/**
 * Calls the API to update a member
 * @param {Object} formData The form data form the update form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of members
 */
export function update(formData) {
  return makeCacheRequest({
    url: '/api/members',
    method: 'PUT',
    data: formData,
  });
}
