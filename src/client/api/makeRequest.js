/**
 * Makes a request using the fetch API
 * @param {Object} params A config object for the fetch request. Takes all the same
 *  parameters as a fetch request
 * @returns An object containing keys `data` and `error`. Only one key
 *  will be populated determined by the success or error of the fetch call
 */
export default async function makeRequest({
  url,
  data: formData,
  headers,
  method = 'GET',
  ...rest
}) {
  try {
    // make the request
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(formData),
      method,
      ...rest,
    });

    // if the response is not ok (ie. 500, 404) return the error
    if (!response.ok) {
      const error = {
        status: response.status,
        text: await response.text(),
      };

      return { error };
    }

    const data = await response.json();

    // return the response data
    return { data };
  } catch (error) {
    // log and return any errors
    console.error('Error: makeRequest()', { url, data: formData, error });
    return { error };
  }
}
