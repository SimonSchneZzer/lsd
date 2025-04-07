import { NextResponse } from 'next/server';

const ICS_URL = 'https://myplan.fh-salzburg.ac.at/de/events/ical.php?action=ical&token=0585d8a091bb7998cf06eab5f28cd33b00c01d20';

export async function GET() {
  try {
    const res = await fetch(ICS_URL);
    let icsData = await res.text();

    // Normalize line endings and unfold folded lines (lines starting with space/tab)
    icsData = icsData
      .replace(/\r\n/g, '\n')       // CRLF → LF
      .replace(/\n[ \t]/g, '');     // Unfold lines (per RFC 5545)

    const eventBlocks = icsData.match(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g);

    if (!eventBlocks) {
      return NextResponse.json({ events: [] });
    }

    const events = eventBlocks.map((block) => {
      const summaryMatch = block.match(/SUMMARY:(.*)/);
      const rawSummary = summaryMatch ? summaryMatch[1] : '';
      const summary = rawSummary.replace(/\\n/g, ' ').trim();

      const dtstart = block.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || '';
      const dtend = block.match(/DTEND(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || '';

      return { summary, dtstart, dtend };
    });

    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch .ics data' }, { status: 500 });
  }
}