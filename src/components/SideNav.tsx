import Link from "next/link";

export default function SideNav() {
  return (
    <nav>
      <h1>Lazy Student Dashboard</h1>
      <ul>
        <li>
          <Link href="/dashboard/attendance">
            <h2>📅 Attendance</h2>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/ects">
            <h2>🎓 ECTS</h2>
          </Link>
        </li>
        <li>
          <Link href="/configurator">
            <h2>🛠️ Configurator</h2>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <h2>👤 Profile</h2>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
