import Link from 'next/link';

function HomePage() {
  return (
    <ul>
      <li>
        <Link href='/members'>
          <a>Troop Members List</a>
        </Link>
      </li>
      <li>
        <Link href='/schedule'>
          <a>Troop Scheudule</a>
        </Link>
      </li>
      <li>
        <Link href='/attendance'>
          <a>Record Attendance</a>
        </Link>
      </li>
    </ul>
  );
}

export default HomePage;
