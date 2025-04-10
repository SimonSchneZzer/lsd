"use client";

import { useSession, signOut } from "next-auth/react";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <>
        <div className={styles.notloggedin}>
          <h2>You are not logged in</h2>
          <p>
            {" "}
            <u>
              <a href="/auth/login">Sign in</a>
            </u>{" "}
            or{" "}
            <u>
              <a href="/auth/register">register</a>
            </u>{" "}
            to access your profile.{" "}
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <p>
        <strong>Email:</strong> {session.user?.email || "No email available"}
      </p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
