'use client';

import { BookedRange } from '@/lib/ical';

interface Props {
  bookedRanges: BookedRange[];
  locale: string;
}

const MONTH_NAMES = {
  hr: ['Siječanj','Veljača','Ožujak','Travanj','Svibanj','Lipanj','Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'],
  de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
} as const;

const DAY_NAMES = {
  hr: ['Po','Ut','Sr','Če','Pe','Su','Ne'],
  de: ['Mo','Di','Mi','Do','Fr','Sa','So'],
  en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
} as const;

function toYMD(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isBooked(date: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => date >= r.start && date < r.end);
}

function isPast(year: number, month: number, day: number): boolean {
  const today = new Date();
  const d = new Date(year, month, day);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d < t;
}

function CalendarMonth({
  year,
  month,
  bookedRanges,
  locale,
}: {
  year: number;
  month: number;
  bookedRanges: BookedRange[];
  locale: string;
}) {
  const lang = (['hr', 'de', 'en'] as const).includes(locale as 'hr') ? locale as 'hr' | 'de' | 'en' : 'en';
  const monthNames = MONTH_NAMES[lang];
  const dayNames = DAY_NAMES[lang];

  const firstDay = new Date(year, month, 1);
  // Monday-based week: convert Sunday=0 to Monday-based index
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ flex: '1 1 280px', minWidth: 0 }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          opacity: 0.6,
          marginBottom: '1rem',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {monthNames[month]} {year}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              opacity: 0.35,
              paddingBottom: '0.5rem',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} />;
          }
          const dateStr = toYMD(year, month, day);
          const booked = isBooked(dateStr, bookedRanges);
          const past = isPast(year, month, day);

          return (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '0.35rem 0',
                fontSize: '0.8rem',
                fontFamily: "'Inter', sans-serif",
                color: booked || past ? 'rgba(28,28,26,0.25)' : 'var(--ink)',
                background: booked ? 'rgba(28,28,26,0.06)' : past ? 'transparent' : 'rgba(123,167,188,0.18)',
                textDecoration: booked ? 'line-through' : 'none',
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({ bookedRanges, locale }: Props) {
  const lang = (['hr', 'de', 'en'] as const).includes(locale as 'hr') ? locale as 'hr' | 'de' | 'en' : 'en';

  const labels = {
    hr: { title: 'Dostupnost', booked: 'Zauzeto', available: 'Slobodno' },
    de: { title: 'Verfügbarkeit', booked: 'Belegt', available: 'Frei' },
    en: { title: 'Availability', booked: 'Booked', available: 'Available' },
  }[lang];

  const now = new Date();
  const months: { year: number; month: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  return (
    <div
      style={{
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(2rem, 6vw, 6rem)',
        borderTop: '1px solid rgba(28,28,26,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <h3
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            opacity: 0.5,
            fontFamily: "'Inter', sans-serif",
            margin: 0,
          }}
        >
          {labels.title}
        </h3>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif", color: 'var(--ink)', opacity: 0.5 }}>
            <span style={{ width: 12, height: 12, background: 'rgba(28,28,26,0.08)', display: 'inline-block', borderRadius: 2 }} />
            {labels.booked}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif", color: 'var(--ink)', opacity: 0.5 }}>
            <span style={{ width: 12, height: 12, background: 'rgba(123,167,188,0.18)', border: '1px solid rgba(123,167,188,0.4)', display: 'inline-block', borderRadius: 2 }} />
            {labels.available}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        {months.map(({ year, month }) => (
          <CalendarMonth
            key={`${year}-${month}`}
            year={year}
            month={month}
            bookedRanges={bookedRanges}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
