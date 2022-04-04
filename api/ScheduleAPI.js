import makeRequest from './makeRequest';

/**
 * Calls the API to add a new event
 * @param {Object} item A new event item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   including the new one just added
 */
export function add(item) {
  return makeRequest({
    url: '/api/schedule',
    method: 'POST',
    data: item
  });
}

/**
 * Calls the API to remove a specified event
 * @param {Object} item The event item to remove
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   including the new one just added
 */
export function remove(item) {
  return makeRequest({
    url: `/api/schedule/remove`,
    method: 'POST',
    data: item,
  });
}