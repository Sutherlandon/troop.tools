/**
 * Makes a request using the fetch API
 * @param {Object} params A config object for the fetch request. Takes all the same
 *  parameters as a fetch request
 * @returns An object containing keys `data` and `error`. Only one key
 *  will be populated determined by the success or error of the fetch call
 */
export default async function makeRequest({ url, data, method='GET', ...rest }) {
  try {
    // make the request
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      method,
      ...rest
    });

    // return the response data
    return { data: await response.json() };

  } catch (error) {
    // log and return any errors
    console.error(url, data, error);
    return { error };
  }
}