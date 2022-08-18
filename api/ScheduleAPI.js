import makeRequest from './makeRequest';

// cache the members when fetched
let _schedule;

/**
 * Make the request but cache the results for repeated gets
 */
async function makeCacheRequest(params) {
  const { data, error } = await makeRequest(params);

  _schedule = data;

  return { data, error };
}

/**
 * Calls the API to add a new event
 * @param {Object} item A new event item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function add(item) {
  return makeCacheRequest({
    url: '/api/schedule',
    method: 'POST',
    data: item,
  });
}

/**
 * Calls the API to add attendence for a patrol on certain event
 * @param {Object} formData Data from the attendance form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function attendance(formData) {
  return makeCacheRequest({
    url: '/api/schedule/attendance',
    method: 'POST',
    data: formData,
  });
}

/**
 * Fetches the schedule
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function get() {
  if (_schedule) {
    return { data: _schedule };
  }

  return makeCacheRequest({
    url: '/api/schedule',
  });
}

/**
 * Calls the API to remove a specified event
 * @param {Object} item The event item to remove
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function remove(item) {
  return makeCacheRequest({
    url: '/api/schedule/remove',
    method: 'POST',
    data: item,
  });
}

/**
 * Calls the API to update
 * @param {Object} formData The form data form the update form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function update(formData) {
  return makeCacheRequest({
    url: '/api/schedule',
    method: 'PUT',
    data: formData,
  });
}
