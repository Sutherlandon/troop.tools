import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';

import * as EventsAPI from '@client/api/EventsAPI';
import * as MembersAPI from '@client/api/MembersAPI';
import SchedulePage from './schedule';

function HomePage() {
  const [loading, setLoading] = useState(true);

  // Prime the cache
  useEffect(() => {
    async function cacheData() {
      await Promise.all([
        EventsAPI.get(),
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
