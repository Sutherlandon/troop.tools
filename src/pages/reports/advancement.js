import cloneDeep from 'lodash.clonedeep';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSession } from 'next-auth';
import {
  CircularProgress,
  Typography,
} from '@mui/material';

import { authOptions } from 'pages/api/auth/[...nextauth]';
import * as MembersAPI from '@client/api/MembersAPI';
import { ADVANCEMENT, ADVANCEMENT_BLANK, PATROLS } from '@shared/constants';

export default function AdvancementReportPage(props) {
  const { query } = useRouter();
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
    <div>
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
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      }
    };
  }

  // Onboard if we don't have all the info we need
  if (!session.user?.firstName || !session.user?.lastName) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      }
    };
  }

  return { props: { session } };
}
