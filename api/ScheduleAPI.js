import makeRequest from './makeRequest';

/**
 * Calls the API to add a new event
 * @param {Object} item A new event item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function add(item) {
  return makeRequest({
    url: '/api/schedule',
    method: 'POST',
    data: item
  });
}

/**
 * Calls the API to add attendence for a patrol on certain event
 * @param {Object} formData Data from the attendance form
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function attendance(formData) {
  return makeRequest({
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
  return makeRequest({
    url: '/api/schedule',
  });
}

/**
 * Calls the API to remove a specified event
 * @param {Object} item The event item to remove
 * @returns <Promise> An object contianing `data` or `error`. `data` contians the schedule
 */
export function remove(item) {
  return makeRequest({
    url: `/api/schedule/remove`,
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
  return makeRequest({
    url: `/api/schedule`,
    method: 'PUT',
    data: formData,
  });

}