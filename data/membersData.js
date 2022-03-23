import { differenceInHours, format } from 'date-fns';
import { docClient } from './awsConfig';

let cacheUpdated;
let _members = [];

export async function getAll() {
  // re-up the cache only every 12 hours
  if (!cacheUpdated || differenceInHours(cacheUpdated, new Date()) > 12) {
    try {
      // fetch the members data
      const results = await docClient.scan({ TableName: 'members' }).promise();
      cacheUpdated = new Date();
      console.log("Members Cached",  format(cacheUpdated, 'yyyy-MM-dd hh:mm:ss'));

      // cache the members
      _members = results.Items;

    } catch (err) {
      console.error("Unable to fetch Members.", err);
    }
  }

  return _members;
}


// const testMembers = [
//   { name: 'Elijah Sutherland', patrol: 'fox' },
//   { name: 'Mark Griffin', patrol: 'fox' },
//   { name: 'Fin Gauss', patrol: 'hawk' },
//   { name: 'Conner Holowell', patrol: 'hawk' },
//   { name: 'Colton wasowski', patrol: 'lion' },
//   { name: 'Collin McGuire-Something', patrol: 'lion' },
// ]

// testMembers.forEach((item) => 
//   docClient.put({ TableName: 'members', Item: item }, function(err, data) {
//       if (err) {
//           console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("PutItem succeeded:", JSON.stringify(item, null, 2));
//       }
//   }));