import { NextResponse } from 'next/server';
import { getDurationMinutes } from '@/lib/icsUtils';

const ICS_URL = 'https://myplan.fh-salzburg.ac.at/de/events/ical.php?action=ical&token=0585d8a091bb7998cf06eab5f28cd33b00c01d20';

export async function GET() {
  try {
    const res = await fetch(ICS_URL);
    let icsData = await res.text();

    icsData = icsData
      .replace(/\r\n/g, '\n')
      .replace(/\n[ \t]/g, '');

    const eventBlocks = icsData.match(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g);

    if (!eventBlocks) {
      return NextResponse.json({ events: [] });
    }

    const events = eventBlocks.map((block) => {
      const summary = block.match(/SUMMARY:(.*)/)?.[1]?.replace(/\\n/g, ' ').trim() || '';
      const description = block.match(/DESCRIPTION:(.*)/)?.[1]?.replace(/\\n/g, ' ').trim() || '';
      const dtstartRaw = block.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || '';
      const dtendRaw = block.match(/DTEND(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || '';

      const durationMinutes = getDurationMinutes(dtstartRaw, dtendRaw);

      const isGuestLecture = /gastvortrag|guest lecture/i.test(description);
      if (isGuestLecture || durationMinutes >= 1439) return null;

      return { summary, description, dtstart: dtstartRaw, dtend: dtendRaw };
    }).filter(Boolean);

    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch .ics data' }, { status: 500 });
  }
}