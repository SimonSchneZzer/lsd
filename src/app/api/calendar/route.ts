import { NextResponse } from "next/server";
import ectsMappingData from "../../../data/ectsMapping.json";
import { getDurationMinutes, estimateLessonUnits } from "@/lib/icsUtils";
import { flattenMapping, getEctsMatch } from "@/lib/ectsUtils";
import { CalendarEvent } from "@/types/event";

const ICS_URL =
  "https://myplan.fh-salzburg.ac.at/de/events/ical.php?action=ical&token=13ae6ec6701e4b6a4eea0131ec32541c780fe427"; //MMA
  //https://myplan.fh-salzburg.ac.at/de/events/ical.php?action=ical&token=0585d8a091bb7998cf06eab5f28cd33b00c01d20 MMT
  //https://myplan.fh-salzburg.ac.at/de/events/ical.php?action=ical&token=ff24152e973da0f6f01c4d987e555974928a61f5 MMT mit wieder

type ApiResponse = {
  events: CalendarEvent[];
  totalEcts: number;
};

export async function GET() {
  try {
    const res = await fetch(ICS_URL);
    let icsData = await res.text();

    // Normalize and unfold lines
    icsData = icsData.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
    const eventBlocks = icsData.match(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g);
    if (!eventBlocks) return NextResponse.json<ApiResponse>({ events: [], totalEcts: 0 });

    const flattenedMapping = flattenMapping(ectsMappingData);
    const unmatchedSummaries: string[] = [];

    const events: CalendarEvent[] = eventBlocks
      .map((block) => {
        const summary =
          block.match(/SUMMARY:(.*)/)?.[1]?.replace(/\\n/g, " ").trim() || "";
        const description =
          block.match(/DESCRIPTION:(.*)/)?.[1]?.replace(/\\n/g, " ").trim() || "";
        const dtstart =
          block.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || "";
        const dtend =
          block.match(/DTEND(?:;TZID=[^:]+)?:([0-9T]+)/)?.[1] || "";

        const durationMinutes = getDurationMinutes(dtstart, dtend);

        const isGuestLecture = /gastvortrag|guest lecture/i.test(description);
        const isFullDay = durationMinutes >= 1439;

        if (isGuestLecture || isFullDay) return null;

const { ects, courseId } = getEctsMatch(summary, flattenedMapping);
if (ects === 0) unmatchedSummaries.push(summary);

const lessonUnits = estimateLessonUnits(durationMinutes);

return {
  summary,
  description,
  dtstart,
  dtend,
  durationMinutes,
  lessonUnits,
  ects,
  courseId,
};
      })
      .filter(Boolean) as CalendarEvent[];

    const totalEcts = events.reduce((sum, e) => sum + (e.ects || 0), 0);

    console.log("Unmatched course summaries:", unmatchedSummaries);

    return NextResponse.json<ApiResponse>({ events, totalEcts });
  } catch (err) {
    return NextResponse.json<ApiResponse>(
      { events: [], totalEcts: 0 },
      { status: 500 }
    );
  }
}