import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';

import PageLayout from '@client/components/Layouts/PageLayout';
import AdvancementReport from '@client/components/AdvancementReport';
import MemberSubmenu from '@client/components/MemberSubmenu';

import * as MembersAPI from '@client/api/MembersAPI';
import MemberContext from '@client/components/MemberContext';
import { PATROLS } from '@shared/constants';

export default function MemberProfile() {
  const [member, setMember] = useState('loading');
  const { data: user } = useSession({ required: true });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function getMember() {
      if (id) {
        const { data, error } = await MembersAPI.get(id);

        if (error) {
          return console.error(error);
        }

        setMember(data);
      }
    }

    getMember();
  }, [id]);

  if (member === 'loading') {
    return (
      <PageLayout>
        <LinearProgress />
      </PageLayout>
    );
  }

  return (
    <MemberContext.Provider value={{ member, setMember }}>
      <PageLayout Submenu={MemberSubmenu}>
        <Grid container alignItems={'center'} justifyContent={'space-between'} sx={{ pb: 2 }}>
          <Grid item sx={{ pr: 2 }}>
            <Typography variant='h4'>
              {`${member.firstName} ${member.lastName}`}
            </Typography>
          </Grid>
          <Grid item>
            <Image src={PATROLS[member.patrol].icon} alt='Patrol Logo' height={30} />
          </Grid>
          <Grid item sx={{ flexGrow: 1 }} />
          <Grid item>
            {member.active
              ? <Typography variant='h5' sx={{ color: 'green' }}>Active</Typography>
              : <Typography variant='h5' sx={{ color: 'red' }}>Inactive</Typography>
            }
          </Grid>
        </Grid>
        <AdvancementReport
          member={member}
          user={user}
        />
      </PageLayout>
    </MemberContext.Provider>
  );
}

MemberProfile.auth = true;
