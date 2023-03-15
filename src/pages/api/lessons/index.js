import { LESSONS } from '@shared/constants';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(LESSONS);
    default:
      return res.status(405);
  }
};
