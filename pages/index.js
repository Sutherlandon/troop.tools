import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';

import SchedulePage from './schedule';
import * as ScheduleAPI from '../api/ScheduleAPI';
import * as MembersAPI from '../api/MembersAPI';

function HomePage() {
  const [loading, setLoading] = useState(true);

  // Prime the cache
  useEffect(() => {
    async function cacheData() {
      await Promise.all([
        ScheduleAPI.get(),
        MembersAPI.get(),
      ]);

      setLoading(false);
    }

    cacheData();
  });

  return loading
    ? <LinearProgress />
    : <SchedulePage />;
}

export default HomePage;
