'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoggedIn = status === 'authenticated';

  const isActive = (href: string) => pathname === href;

  return (
    <nav>
      <h1>Lazy Student Dashboard</h1>
      <ul>
        <li className={isActive('/dashboard/attendance') ? 'active' : ''}>
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
        <li className={isActive('/dashboard/ects') ? 'active' : ''}>
          <Link href="/dashboard/ects">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 30 30"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <h2>ECTS</h2>
            </div>
          </Link>
        </li>
        <li className={isActive('/configurator') ? 'active' : ''}>
          <Link href="/configurator">
            <h2>🛠️ Configurator</h2>
          </Link>
        </li>
        <li className={isActive('/profile') ? 'active' : ''}>
          <Link href="/profile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isLoggedIn ? (
                // Logged-in user icon
                <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-420, -2119)" fill="#ffffff">
                      <g id="icons" transform="translate(56, 160)">
                        <path d="M378.083123,1964.99998 C378.083123,1962.79398 376.251842,1960.99998 374,1960.99998 C371.748158,1960.99998 369.916877,1962.79398 369.916877,1964.99998 C369.916877,1967.20598 371.748158,1968.99998 374,1968.99998 C376.251842,1968.99998 378.083123,1967.20598 378.083123,1964.99998 M381.945758,1978.99998 L380.124685,1978.99998 C379.561214,1978.99998 379.103904,1978.55198 379.103904,1977.99998 
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
              ) : (
                // Not logged-in user icon (simple user outline)
                <svg width="25" height="25" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -2119.000000)" fill="#ffffff">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M338.083123,1964.99998 C338.083123,1962.79398 336.251842,1960.99998 334,1960.99998 C331.748158,1960.99998 329.916877,1962.79398 329.916877,1964.99998 C329.916877,1967.20599 331.748158,1968.99999 334,1968.99999 C336.251842,1968.99999 338.083123,1967.20599 338.083123,1964.99998 M341.945758,1979 L340.124685,1979 C339.561214,1979 339.103904,1978.552 339.103904,1978 C339.103904,1977.448 339.561214,1977 340.124685,1977 L340.5626,1977 C341.26898,1977 341.790599,1976.303 341.523154,1975.662 C340.286989,1972.69799 337.383888,1970.99999 334,1970.99999 C330.616112,1970.99999 327.713011,1972.69799 326.476846,1975.662 C326.209401,1976.303 326.73102,1977 327.4374,1977 L327.875315,1977 C328.438786,1977 328.896096,1977.448 328.896096,1978 C328.896096,1978.552 328.438786,1979 327.875315,1979 L326.054242,1979 C324.778266,1979 323.773818,1977.857 324.044325,1976.636 C324.787453,1973.27699 327.107688,1970.79799 330.163906,1969.67299 C328.769519,1968.57399 327.875315,1966.88999 327.875315,1964.99998 C327.875315,1961.44898 331.023403,1958.61898 334.733941,1959.04198 C337.422678,1959.34798 339.650022,1961.44698 340.05323,1964.06998 C340.400296,1966.33099 339.456073,1968.39599 337.836094,1969.67299 C340.892312,1970.79799 343.212547,1973.27699 343.955675,1976.636 C344.226182,1977.857 343.221734,1979 341.945758,1979 M337.062342,1978 C337.062342,1978.552 336.605033,1979 336.041562,1979 L331.958438,1979 C331.394967,1979 330.937658,1978.552 330.937658,1978 C330.937658,1977.448 331.394967,1977 331.958438,1977 L336.041562,1977 C336.605033,1977 337.062342,1977.448 337.062342,1978" id="profile_round-[#1346]">

                        </path>
                      </g>
                    </g>
                  </g>
                </svg>
              )}
             <h2>Profile</h2>
            </div>
          </Link>
        </li>
      </ul>
      <style jsx>{`
        li.active h2 {
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}