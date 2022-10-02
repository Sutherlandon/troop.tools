import makeRequest from './makeRequest';

// cache the events when fetched
let _events;

/**
 * Make the request but cache the results for repeated gets
 */
async function makeCacheRequest(params) {
  const { data, error } = await makeRequest(params);

  _events = data;

  return { data, error };
}

/**
 * Calls the API to add a new event
 * @param {Object} item A new event item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function add(item) {
  return makeCacheRequest({
    url: '/api/events',
    method: 'POST',
    data: item,
  });
}

/**
 * Calls the API to add attendence for a patrol on certain event
 * @param {Object} formData Data from the attendance form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function attendance(formData) {
  return makeCacheRequest({
    url: '/api/events/attendance',
    method: 'POST',
    data: formData,
  });
}

/**
 * Fetches the list of events
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function get() {
  if (_events) {
    return { data: _events };
  }

  return makeCacheRequest({
    url: '/api/events',
  });
}

/**
 * Calls the API to remove a specified event
 * @param {Object} item The event item to remove
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function remove(item) {
  return makeCacheRequest({
    url: '/api/events/remove',
    method: 'POST',
    data: item,
  });
}

/**
 * Calls the API to update
 * @param {Object} formData The form data form the update form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function update(formData) {
  return makeCacheRequest({
    url: '/api/events',
    method: 'PUT',
    data: formData,
  });
}
