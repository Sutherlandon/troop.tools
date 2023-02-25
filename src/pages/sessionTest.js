import { useSession } from 'next-auth/react';

export default function SchedulePage() {
  const { data: user = { firstName: 'Murphy' } } = useSession();

  return <h1>Hello {user.firstName}</h1>;
}

// export async function getServerSideProps({ req, res }) {
//   // const props = await serverCheckSession(req, res);
//   const props = {
//     props: {
//       session: {
//         email: 'sutherlandon@gmail.com',
//         firstName: 'Landon',
//         lastName: 'Sutherland',
//         roles: {
//           admin: true,
//         },
//         troop: 'NM1412',
//         isAdmin: true,
//         isParent: true,
//         isTrailGuide: true
//       }
//     }
//   };

//   return props;
// }
