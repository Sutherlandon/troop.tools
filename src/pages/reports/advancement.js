import cloneDeep from 'lodash.clonedeep';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Typography,
} from '@mui/material';

import * as MembersAPI from '@client/api/MembersAPI';
import AccessDenied from '@client/components/AccessDenied';
import PageLayout from '@client/components/Layouts/PageLayout';
import { ADVANCEMENT, ADVANCEMENT_BLANK, PATROLS } from '@shared/constants';

export default function AdvancementReportPage(props) {
  const { query } = useRouter();
  const { data: user } = useSession();
  const [member, setMember] = useState();

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.get();

      if (error) {
        return console.error(error);
      }

      // find the member passed in by the query
      const member = data.filter((m) => m._id === query.id)[0];

      setMember(member);
    }

    loadMembers();
  }, [query]);

  if (!user.isParent) {
    return (
      <AccessDenied>
        You have not been granted access to the advancement report. Please
        contact your Troop Master and ask them to grant you the <b>Parent</b> role.
      </AccessDenied>
    );
  }

  if (!member) {
    return <CircularProgress />;
  }

  // process advancement to match the shape of the ADVANCMENT constanst
  const adv = {
    [PATROLS.foxes.id]: cloneDeep(ADVANCEMENT_BLANK),
    [PATROLS.hawks.id]: cloneDeep(ADVANCEMENT_BLANK),
    [PATROLS.mountainLions.id]: cloneDeep(ADVANCEMENT_BLANK)
  };

  // fill the advancement with lessons
  member.adv.forEach((lesson) => {
    adv[lesson.patrolID][lesson.branch][lesson.type] += 1;
  });

  return (
    <div>
      <Typography variant='h5'>
        Advancement Report for {member.firstName} {member.lastName}
      </Typography>
      <AdvancementPage title='Fox' adv={Object.values(adv)[0]} />
      <AdvancementPage title='Hawk' adv={Object.values(adv)[1]} />
      <AdvancementPage title='Mountain Lion' adv={Object.values(adv)[2]} />
    </div>
  );
}

function AdvancementPage({ adv, title }) {
  return (
    <PageLayout>
      <Typography variant='h4'>{title}</Typography>
      <ul>
        {Object.keys(adv).map((branch) => (
          <li key={branch}>
            {branch}: {
              Object.keys(adv[branch])
                .map((type) => (
                  <span key={type} style={{ marginRight: 8 }}>
                    {type}: {adv[branch][type]}/{ADVANCEMENT[branch][type] || 0}
                  </span>
                ))
            }
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}

AdvancementReportPage.auth = true;
