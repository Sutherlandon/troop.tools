import makeRequest from './makeRequest';

/**
 * Calls the API to add a new member 
 * @param {Object} item A new member item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   including the new one just added
 */
export function add(item) {
  return makeRequest({
    url: '/api/members',
    method: 'POST',
    data: item
  });
}

/**
 * Calls the API to add a new member 
 * @param {Object} item A new member item
 * @returns <Promise> An object contianing `data` or `error`. `data` contians list of members
 *   including the new one just added
 */
export function remove(id) {
  return makeRequest({
    url: `/api/members/${id}`,
    method: 'DELETE',
  });
}