import Lesson from '@server/models/lesson.model';

export default async function handler(req, res) {
  // A list of users or the member created/updated
  let results;

  switch (req.method) {
    case 'GET':
      results = await Lesson.getAll();
      break;
    default:
      return res.status(405);
  }

  return res.status(200).json(results);
};
