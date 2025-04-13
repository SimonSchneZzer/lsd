import Image from "next/image";

export default function Home() {
  return (
    <div >
      <main>
        <h2>Welcome to the <b>Lazy Stundent Dashboard!</b></h2><br />
        <p>The Lazy Student Dashboard <b>(LSD)</b> helps you monitor your attendance and effort so you only do as much work as absolutely necessary!</p>
        <br />
        <p>Please <u><a href="/auth/login">sign in</a> </u> or <u> <a href="/auth/register">register</a> </u> to start making the most of doing the least.</p>
      </main>
      <footer>
      </footer>
    </div>
  );
}
