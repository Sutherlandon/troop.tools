import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';

import SchedulePage from './schedule';
import * as EventsAPI from '../client_api/EventsAPI';
import * as MembersAPI from '../client_api/MembersAPI';

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
