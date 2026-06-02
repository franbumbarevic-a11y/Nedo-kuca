const ICAL_URL =
  'https://hr.airbnb.com/calendar/ical/1218273079060429694.ics?t=5f8e685f8355489a8ea43742cc0331dc';

export interface BookedRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD (exclusive, as per iCal DTEND convention)
}

function parseICalDate(raw: string): string {
  // DATE format: 20240701
  // DATETIME format: 20240701T000000Z or 20240701T000000
  const digits = raw.replace(/[TZ]/g, '').slice(0, 8);
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export async function fetchBookedRanges(): Promise<BookedRange[]> {
  try {
    const res = await fetch(ICAL_URL, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!res.ok) return [];
    const text = await res.text();

    const ranges: BookedRange[] = [];
    const events = text.split('BEGIN:VEVENT');
    for (const event of events.slice(1)) {
      const startMatch = event.match(/DTSTART(?:;[^:]*)?:(\S+)/);
      const endMatch = event.match(/DTEND(?:;[^:]*)?:(\S+)/);
      if (startMatch && endMatch) {
        ranges.push({
          start: parseICalDate(startMatch[1]),
          end: parseICalDate(endMatch[1]),
        });
      }
    }
    return ranges;
  } catch {
    return [];
  }
}
