import Link from "next/link";

export default function SideNav() {
  return (
    <nav>
      <h1>Lazy Student Dashboard</h1>
      <ul>
        <li>
          <Link href="/dashboard/attendance">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 10V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 13L8 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2>Attendance</h2>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/ects">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 30 30"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h2>ECTS</h2>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/configurator">
            <h2>🛠️ Configurator</h2>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="25" height="25" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-420, -2119)" fill="#ffffff">
                    <g id="icons" transform="translate(56, 160)">
                      <path d="M378.083123,1964.99998 C378.083123,1962.79398 376.251842,1960.99998 374,1960.99998 
                C371.748158,1960.99998 369.916877,1962.79398 369.916877,1964.99998 
                C369.916877,1967.20598 371.748158,1968.99998 374,1968.99998 
                C376.251842,1968.99998 378.083123,1967.20598 378.083123,1964.99998 
                M381.945758,1978.99998 L380.124685,1978.99998 
                C379.561214,1978.99998 379.103904,1978.55198 379.103904,1977.99998 
                C379.103904,1977.44798 379.561214,1976.99998 380.124685,1976.99998 
                L380.5626,1976.99998 C381.26898,1976.99998 381.790599,1976.30298 381.523154,1975.66198 
                C380.286989,1972.69798 377.383888,1970.99998 374,1970.99998 
                C370.616112,1970.99998 367.713011,1972.69798 366.476846,1975.66198 
                C366.209401,1976.30298 366.73102,1976.99998 367.4374,1976.99998 
                L367.875315,1976.99998 C368.438786,1976.99998 368.896096,1977.44798 368.896096,1977.99998 
                C368.896096,1978.55198 368.438786,1978.99998 367.875315,1978.99998 
                L366.054242,1978.99998 C364.778266,1978.99998 363.773818,1977.85698 364.044325,1976.63598 
                C364.787453,1973.27698 367.107688,1970.79798 370.163906,1969.67298 
                C368.769519,1968.57398 367.875315,1966.88998 367.875315,1964.99998 
                C367.875315,1961.44898 371.023403,1958.61898 374.733941,1959.04198 
                C377.422678,1959.34798 379.650022,1961.44698 380.05323,1964.06998 
                C380.400296,1966.33098 379.456073,1968.39598 377.836094,1969.67298 
                C380.892312,1970.79798 383.212547,1973.27698 383.955675,1976.63598 
                C384.226182,1977.85698 383.221734,1978.99998 381.945758,1978.99998 
                M377.185857,1974.46398 C377.584982,1974.85498 377.584982,1975.48798 377.185857,1975.87898 
                L374,1978.99998 L371.834924,1976.87898 
                C371.435799,1976.48798 371.435799,1975.85498 371.834924,1975.46398 
                C372.233028,1975.07398 372.879183,1975.07398 373.278308,1975.46398 
                L374,1976.17198 L375.742473,1974.46398 
                C376.141598,1974.07398 376.787752,1974.07398 377.185857,1974.46398" />
                    </g>
                  </g>
                </g>
              </svg>
              <h2>Profile</h2>
            </div>
          </Link>
        </li>
      </ul>
    </nav >
  );
}
