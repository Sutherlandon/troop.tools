import { differenceInHours, format } from 'date-fns';
import { docClient } from './awsConfig';

let cacheUpdated;
let _events = [];

export async function getAll() {
  // re-up the cache only every 12 hours
  if (!cacheUpdated || differenceInHours(cacheUpdated, new Date()) > 12) {
    try {
      // fetch the members data
      const results = await docClient.scan({ TableName: 'events' }).promise();
      cacheUpdated = new Date();
      console.log("Events Cached", format(cacheUpdated, 'yyyy-MM-dd hh:mm:ss'));

      // cache the members
      _events = results.Items;

    } catch (err) {
      console.error("Unable to fetch Events.", err);
    }
  }

  return _events;
}

// const testEvents = [
//   {date: '3/10/2022', name: 'Personal Safety', branch: 'Life Skills', type: 'core'},
//   {date: '3/17/2022', name: 'Maps Skills', branch: 'Life Skills', type: 'elective'},
//   {date: '3/19/2022', name: 'Fire Station Tour', branch: 'Life Skills', type: 'htt'},
// ]

// testEvents.forEach((event) => 
//   docClient.put({ TableName: 'events', Item: event }, function(err, data) {
//       if (err) {
//           console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("PutItem succeeded:", JSON.stringify(data, null, 2));
//       }
//   }));
