import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as MembersAPI from '@client/MembersAPI';
import { ADVANCEMENT, LESSONS } from '@shared/constants';
import {
  LinearProgress,
  Typography,
} from '@mui/material';
// import { DateTime } from 'luxon';

const blankAdvancement = Object.keys(ADVANCEMENT).reduce(
  (acc, branch) => ({
    ...acc,
    [branch]: {
      core: 0,
      elective: 0,
      htt: 0,
      makeup: 0,
    }
  }),
  {}
);

function AdvancementReportPage(props) {
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
    return <LinearProgress />;
  }

  console.log(member);

  // process advancement to match the shape of the ADVANCMENT constanst
  const adv = { ...blankAdvancement };
  console.log(adv);
  member.adv.forEach((entry) => {
    // const date = DateTime.fromISO(entry.date);
    const lesson = LESSONS[entry.lessonID];
    console.log(lesson);
    adv[lesson.branch][lesson.type] += 1;
  });

  return (
    <div>
      <Typography variant='h5'>
        Advancement Report for {member.firstName} {member.lastName}
      </Typography>
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
      { }
    </div>
  );
}

export default AdvancementReportPage;
