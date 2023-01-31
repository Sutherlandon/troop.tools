import makeRequest from './makeRequest';

export function getSession() {
  return makeRequest({
    url: '/api/auth/session'
  });
}

export function get(email) {
  return makeRequest({
    url: `/api/users/${email}`,
  });
}

export function add(data) {
  return makeRequest({
    url: '/api/users',
    method: 'POST',
    data,
  });
}

export function update(data) {
  return makeRequest({
    url: '/api/users',
    method: 'PUT',
    data,
  });
}
