'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TutorialPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      {/* Navigation */}
      <nav className="mb-6">
        <Link
          href="/Welcome"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
        >
          ← Zurück zum Dashboard
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Import-Tutorial</h1>
        <p className="text-gray-600">
          Folge diesen Schritten, um deinen Stundenplan einzubinden.
        </p>
      </header>

      {/* Schritt-für-Schritt-Anleitung */}
      <section className="space-y-12">
        {/* Schritt 1 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Schritt 1: Veranstaltungsseite öffnen</h2>
          <p className="text-gray-700">
            Rufe folgende Seite auf:{' '}
            <a
              href="https://myplan.fh-salzburg.ac.at/en/events.php"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-indigo-600 hover:text-indigo-500"
            >
              https://myplan.fh-salzburg.ac.at/events.php
            </a>
          </p>
        </div>

        {/* Schritt 2 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Schritt 2: Button anklicken</h2>
          <p className="text-gray-700 mb-4">
            Scrolle ans Seitenende und klicke auf den Button, wie im Bild gezeigt.
          </p>
          <div className="flex justify-center">
            <Image
              src="/images/tutorial/tut-image1.png"
              width={300}
              height={80}
              alt="Button am Seitenende"
              className="rounded-lg border"
            />
          </div>
        </div>

        {/* Schritte 3–7 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Schritt 3 bis 7: Link importieren</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Kopiere den angezeigten ICS-Link.</li>
            <li>
              Wechsle zum Lazy Student Dashboard →{' '}
              <Link
                href="/configurator"
                className="text-indigo-600 hover:text-indigo-500 underline"
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