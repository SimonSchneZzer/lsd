'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TutorialPage() {
  return (
    <div className="glassCard backdrop-blur-sm px-6 py-12 mb-6">
      <header className="mb-8">
        <p className="text-gray-600 dark:text-white">
          Folge diesen Schritten, um deinen Stundenplan einzubinden.
        </p>
      </header>

      <section className="space-y-12">
        {/* Schritt 1 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-white">Schritt 1: Veranstaltungsseite öffnen</h2>
          <p className="text-gray-700 dark:text-white">
            Rufe folgende Seite auf:{' '}
            <a
              href="https://myplan.fh-salzburg.ac.at/en/events.php"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-indigo-600 hover:text-indigo-500 dark:text-white"
            >
              https://myplan.fh-salzburg.ac.at/events.php
            </a>
          </p>
        </div>

        {/* Schritt 2 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-white">Schritt 2: Button anklicken</h2>
          <p className="text-gray-700 mb-4 dark:text-white">
            Scrolle ans Seitenende und klicke auf den Button, wie im Bild gezeigt.
          </p>
          <div className="flex mt-4 justify-center">
            <Image
              src="/images/tutorial/tut-image1.png"
              width={300}
              height={80}
              alt="Button am Seitenende"
              className="rounded-lg border border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Schritt 3–7 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-white">Schritt 3 bis 7: Link importieren</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-white">
            <li>Kopiere den angezeigten ICS-Link.</li>
            <li>
              Wechsle zum Lazy Student Dashboard →{' '}
              <Link
                href="/configurator"
                className="text-indigo-600 hover:text-indigo-500 underline dark:text-white"
              >
                Course Settings
              </Link>
              .
            </li>
            <li>Füge den Link in das Feld <span className="font-medium">“ICS URL”</span> ein.</li>
            <li>Klicke auf <span className="font-medium">Fetch Courses</span>.</li>
            <li>Überprüfe die importierten Daten und klicke dann auf <span className="font-medium">Save</span>.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}