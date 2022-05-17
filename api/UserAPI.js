import makeRequest from './makeRequest';

export function login2(didToken) {
  return makeRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + didToken,
    },
  });
}

export function login(didToken) {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + didToken,
    },
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