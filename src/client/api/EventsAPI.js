import makeRequest from './makeRequest';

/**
 * Calls the API to add a new event
 * @param {Object} item A new event item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function add(item) {
  return makeRequest({
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
  return makeRequest({
    url: '/api/events/attendance',
    method: 'POST',
    data: formData,
  });
}

/**
 * Fetches the list of events
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function get(year) {
  let url = '/api/events';

  // add the year if it's given
  if (year) {
    url += `/${year}`;
  }

  return makeRequest({ url });
}

/**
 * Calls the API to remove a specified event
 * @param {Object} item The event item to remove
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the list of events
 */
export function remove(item) {
  return makeRequest({
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
  return makeRequest({
    url: '/api/events',
    method: 'PUT',
    data: formData,
  });
}
