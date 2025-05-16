"use client";

import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToastStore } from "@/store/toastStore";

export default function SideNav() {
  const session = useSession();
  const pathname = usePathname();
  const isLoggedIn = !!session;
  const router = useRouter();
  const { setMessage } = useToastStore();

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage("Abmelden fehlgeschlagen: " + error.message);
    } else {
      setMessage("Erfolgreich abgemeldet.");
      router.push("/");
    }
  };

  const handleSignIn = () => {
    router.push("/Welcome"); // oder dein Login‐Pfad
  };

  return (
    <nav className="flex flex-col h-full">
      <h1>Lazy Student Dashboard</h1>
      <ul className="flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-4">
          <li className={isActive("/dashboard/attendance") ? "active" : ""}>
            <Link href="/dashboard/attendance">
              <div className="flex items-center gap-2">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 10V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 13L8 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2>Attendance</h2>
              </div>
            </Link>
          </li>
          <li className={isActive("/dashboard/ects") ? "active" : ""}>
            <Link href="/dashboard/ects">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
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
          <li className={isActive("/dashboard/configurator") ? "active" : ""}>
            <Link href="/dashboard/configurator">
              <div className="flex items-center gap-2">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.5094 8.25078C19.0094 8.25078 19.4094 7.85078 19.4094 7.35078V2.70078C19.4094 2.20078 19.0094 1.80078 18.5094 1.80078C18.0094 1.80078 17.6094 2.20078 17.6094 2.70078V7.35078C17.6094 7.84078 18.0194 8.25078 18.5094 8.25078Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11.9996 15.75C11.4996 15.75 11.0996 16.15 11.0996 16.65V21.3C11.0996 21.8 11.4996 22.2 11.9996 22.2C12.4996 22.2 12.8996 21.8 12.8996 21.3V16.65C12.8996 16.16 12.4996 15.75 11.9996 15.75Z"
                    fill="currentColor"
                  />
                  <path
                    d="M5.48984 8.25078C5.98984 8.25078 6.38984 7.85078 6.38984 7.35078V2.70078C6.38984 2.20078 5.98984 1.80078 5.48984 1.80078C4.98984 1.80078 4.58984 2.20078 4.58984 2.70078V7.35078C4.58984 7.84078 4.98984 8.25078 5.48984 8.25078Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.35047 10.1719H3.63047C3.13047 10.1719 2.73047 10.5719 2.73047 11.0719C2.73047 11.5719 3.13047 11.9719 3.63047 11.9719H4.59047V21.3019C4.59047 21.8019 4.99047 22.2019 5.49047 22.2019C5.99047 22.2019 6.39047 21.8019 6.39047 21.3019V11.9719H7.35047C7.85047 11.9719 8.25047 11.5719 8.25047 11.0719C8.25047 10.5719 7.84047 10.1719 7.35047 10.1719Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20.37 10.1719H16.65C16.15 10.1719 15.75 10.5719 15.75 11.0719C15.75 11.5719 16.15 11.9719 16.65 11.9719H17.61V21.3019C17.61 21.8019 18.01 22.2019 18.51 22.2019C19.01 22.2019 19.41 21.8019 19.41 21.3019V11.9719H20.37C20.87 11.9719 21.27 11.5719 21.27 11.0719C21.27 10.5719 20.87 10.1719 20.37 10.1719Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13.8602 12.0308H12.9002V2.70078C12.9002 2.20078 12.5002 1.80078 12.0002 1.80078C11.5002 1.80078 11.1002 2.20078 11.1002 2.70078V12.0308H10.1402C9.64023 12.0308 9.24023 12.4308 9.24023 12.9308C9.24023 13.4308 9.64023 13.8308 10.1402 13.8308H13.8602C14.3602 13.8308 14.7602 13.4308 14.7602 12.9308C14.7602 12.4308 14.3602 12.0308 13.8602 12.0308Z"
                    fill="currentColor"
                  />
                </svg>
                <h2>Course Settings</h2>
              </div>
            </Link>
          </li>
        </div>
        <div className="flex items-center justify-between w-full">
          <li className={isActive("/dashboard/tutorial") ? "active" : ""}>
            <Link href="/dashboard/tutorial">
              <div className="flex items-center gap-2">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.1"
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    fill="#none"
                  />
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2> Tutorial</h2>
              </div>
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-transparent border-0 cursor-pointer"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 490.3 490.3"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
    s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
    c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
    C27.9,58.95,0,86.75,0,121.05z"
                  />
                  <path
                    d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
    c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
    C380.6,325.15,380.6,332.95,385.4,337.65z"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 bg-transparent border-0 cursor-pointer"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 490.2 490.2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M490.2,369.2V121c0-34.2-27.9-62.1-62.1-62.1H227.5c-34.2,0-62.1,27.9-62.1,62.1v40.2c0,6.8,5.5,12.3,12.3,12.3
    S190,168,190,161.2V121c0-20.7,16.9-37.6,37.6-37.6h200.5c20.7,0,37.6,16.9,37.6,37.6v248.2c0,20.7-16.9,37.6-37.6,37.6H227.5
    c-20.7,0-37.6-16.9-37.6-37.6V329c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,34.2,27.9,62.1,62.1,62.1h200.7
    C462.3,431.3,490.2,403.5,490.2,369.2z"
                  />
                  <path
                    d="M3.6,253.8l83.9,83.9c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-63-63h229.8
    c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H41.8l63-63c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0L3.6,236.4
    C-1.2,241.2-1.2,249,3.6,253.8z"
                  />
                </svg>
              </button>
              // Not logged-in user icon (simple user outline)
            )}
          </li>
        </div>
      </ul>
      <style jsx>{`
        li.active h2 {
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}
