'use client';

import { useState, useCallback, FormEvent } from 'react';
import { BookedRange } from '@/lib/ical';

// ── constants ────────────────────────────────────────────────────────────────

const MAX_DATE = '2027-12-31';
// Off-season months (0-indexed): Oct=9, Nov=10, Dec=11, Jan=0, Feb=1, Mar=2, Apr=3, May=4
const OFF_SEASON_MONTHS = new Set([9, 10, 11, 0, 1, 2, 3, 4]);

// ── i18n ─────────────────────────────────────────────────────────────────────

type Lang = 'hr' | 'de' | 'en';

const LABELS = {
  hr: {
    name: 'Ime i prezime', email: 'E-mail', phone: 'Telefon (neobavezno)',
    guests: 'Broj gostiju', message: 'Poruka', submit: 'Pošalji upit',
    response: 'Odgovaramo unutar 24 sata.',
    checkin: 'Datum dolaska', checkout: 'Datum odlaska',
    selectCheckin: 'Odaberi datum dolaska', thenCheckout: 'Odaberi datum odlaska',
    nights: (n: number) => `${n} ${n === 1 ? 'noć' : 'noći'}`,
    clear: 'Poništi', booked: 'Zauzeto', available: 'Slobodno',
    offseason: 'Zatvoreno (izvan sezone)',
    sending: 'Šalje se…',
    sent: 'Hvala! Vaš upit je primljen. Odgovaramo unutar 24 sata.',
    error: 'Nešto je pošlo po krivu. Pokušajte ponovno ili nas kontaktirajte na info@krcka-kuca.hr',
    guestsHelper: 'Maksimalni kapacitet: 4 gosta',
    months: ['Siječanj','Veljača','Ožujak','Travanj','Svibanj','Lipanj','Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'],
    days: ['Po','Ut','Sr','Če','Pe','Su','Ne'],
  },
  de: {
    name: 'Name', email: 'E-Mail', phone: 'Telefon (optional)',
    guests: 'Anzahl der Gäste', message: 'Nachricht', submit: 'Anfrage senden',
    response: 'Wir antworten innerhalb von 24 Stunden.',
    checkin: 'Anreisedatum', checkout: 'Abreisedatum',
    selectCheckin: 'Anreisedatum wählen', thenCheckout: 'Abreisedatum wählen',
    nights: (n: number) => `${n} ${n === 1 ? 'Nacht' : 'Nächte'}`,
    clear: 'Zurücksetzen', booked: 'Belegt', available: 'Frei',
    offseason: 'Geschlossen (Nebensaison)',
    sending: 'Wird gesendet…',
    sent: 'Danke! Ihre Anfrage ist eingegangen. Wir antworten innerhalb von 24 Stunden.',
    error: 'Etwas ist schiefgelaufen. Bitte erneut versuchen oder uns unter info@krcka-kuca.hr kontaktieren.',
    guestsHelper: 'Maximale Kapazität: 4 Gäste',
    months: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    days: ['Mo','Di','Mi','Do','Fr','Sa','So'],
  },
  en: {
    name: 'Full name', email: 'Email', phone: 'Phone (optional)',
    guests: 'Number of guests', message: 'Message', submit: 'Send enquiry',
    response: 'We reply within 24 hours.',
    checkin: 'Check-in date', checkout: 'Check-out date',
    selectCheckin: 'Select check-in date', thenCheckout: 'Select check-out date',
    nights: (n: number) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    clear: 'Clear', booked: 'Booked', available: 'Available',
    offseason: 'Closed (off-season)',
    sending: 'Sending…',
    sent: 'Thank you! Your enquiry has been received. We reply within 24 hours.',
    error: 'Something went wrong. Please try again or contact us at info@krcka-kuca.hr',
    guestsHelper: 'Maximum capacity: 4 guests',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days: ['Mo','Tu','We','Th','Fr','Sa','Su'],
  },
} as const;

// ── helpers ───────────────────────────────────────────────────────────────────

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayYMD(): string {
  const d = new Date();
  return ymd(d.getFullYear(), d.getMonth(), d.getDate());
}

function nightsBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function formatDisplay(iso: string, months: readonly string[]): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${months[m - 1]} ${y}`;
}

function isBookedDay(date: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => date >= r.start && date < r.end);
}

function isOffSeasonDay(month: number): boolean {
  return OFF_SEASON_MONTHS.has(month);
}

function rangeSpansBlocked(start: string, end: string, ranges: BookedRange[]): boolean {
  const s = new Date(start);
  const e = new Date(end);
  for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (isBookedDay(iso, ranges)) return true;
    if (isOffSeasonDay(d.getMonth())) return true;
  }
  return false;
}

// Skip to the next in-season month when navigating forward into a blocked block
function nextInSeasonMonth(year: number, month: number, forward: boolean): { year: number; month: number } {
  let m = month;
  let y = year;
  for (let i = 0; i < 12; i++) {
    if (!isOffSeasonDay(m)) return { year: y, month: m };
    if (forward) {
      m++; if (m > 11) { m = 0; y++; }
    } else {
      m--; if (m < 0) { m = 11; y--; }
    }
  }
  return { year: y, month: m };
}

// ── month grid ────────────────────────────────────────────────────────────────

interface MonthProps {
  year: number; month: number;
  checkin: string | null; checkout: string | null; hover: string | null;
  bookedRanges: BookedRange[];
  onDayClick: (iso: string) => void;
  onDayHover: (iso: string | null) => void;
  lang: Lang;
}

function CalMonth({ year, month, checkin, checkout, hover, bookedRanges, onDayClick, onDayHover, lang }: MonthProps) {
  const lbl = LABELS[lang];
  const today = todayYMD();
  const isOffSzn = isOffSeasonDay(month);

  const firstDow = new Date(year, month, 1).getDay();
  let offset = firstDow - 1;
  if (offset < 0) offset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeEnd = checkout ?? hover;

  return (
    <div style={{ flex: '1 1 0', minWidth: 0, opacity: isOffSzn ? 0.4 : 1 }}>
      <div style={{
        textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.55,
        marginBottom: '0.75rem', fontFamily: "'Inter', sans-serif", fontWeight: 500,
      }}>
        {lbl.months[month]} {year}
      </div>

      {isOffSzn ? (
        <div style={{
          textAlign: 'center', fontSize: '0.7rem', color: 'var(--ink)',
          opacity: 0.4, fontFamily: "'Inter', sans-serif", padding: '1.5rem 0',
          letterSpacing: '0.06em',
        }}>
          {lbl.offseason}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
            {lbl.days.map((d) => (
              <div key={d} style={{
                textAlign: 'center', fontSize: '0.6rem', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.3,
                padding: '0.25rem 0', fontFamily: "'Inter', sans-serif",
              }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`e${idx}`} />;

              const iso = ymd(year, month, day);
              const isPast = iso < today;
              const isBooked = isBookedDay(iso, bookedRanges);
              const isBeyondMax = iso > MAX_DATE;
              const disabled = isPast || isBooked || isBeyondMax;

              const isCheckin = iso === checkin;
              const isCheckout = iso === checkout;

              let inRange = false;
              if (checkin && rangeEnd && rangeEnd > checkin) {
                inRange = iso > checkin && iso < rangeEnd;
              }

              let hoverInvalid = false;
              if (checkin && !checkout && hover && hover > checkin) {
                hoverInvalid = rangeSpansBlocked(checkin, hover, bookedRanges);
              }

              let bg = 'rgba(123,167,188,0.13)';
              let color = 'var(--ink)';
              let opacity = 1;
              let cursor: React.CSSProperties['cursor'] = 'pointer';
              let strikethrough = false;
              let borderRadius = '3px';
              let fontWeight: React.CSSProperties['fontWeight'] = 400;

              if (isPast || isBeyondMax) {
                bg = 'transparent'; opacity = 0.2; cursor = 'default';
              } else if (isBooked) {
                bg = 'rgba(28,28,26,0.06)'; opacity = 0.25; cursor = 'not-allowed'; strikethrough = true;
              } else if (isCheckin || isCheckout) {
                bg = 'var(--blue-dark)'; color = 'var(--stone)'; fontWeight = 500;
              } else if (inRange) {
                bg = hoverInvalid ? 'rgba(200,80,80,0.1)' : 'rgba(123,167,188,0.28)';
              }

              if (isCheckin) borderRadius = '3px 0 0 3px';
              if (isCheckout) borderRadius = '0 3px 3px 0';
              if (inRange) borderRadius = '0';

              return (
                <div
                  key={day}
                  onClick={() => !disabled && onDayClick(iso)}
                  onMouseEnter={() => !disabled && onDayHover(iso)}
                  onMouseLeave={() => onDayHover(null)}
                  style={{
                    textAlign: 'center', padding: '0.4rem 0', fontSize: '0.78rem',
                    fontFamily: "'Inter', sans-serif", fontWeight,
                    background: bg, color, opacity, cursor, borderRadius,
                    textDecoration: strikethrough ? 'line-through' : 'none',
                    userSelect: 'none', transition: 'background 0.1s',
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

interface Props { bookedRanges: BookedRange[]; locale: string; }

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

export default function BookingForm({ bookedRanges, locale }: Props) {
  const lang: Lang = (['hr', 'de', 'en'] as const).includes(locale as Lang) ? locale as Lang : 'en';
  const lbl = LABELS[lang];

  // Calendar navigation — start at first in-season month >= today
  const now = new Date();
  const initialNav = nextInSeasonMonth(now.getFullYear(), now.getMonth(), true);
  const [calYear, setCalYear] = useState(initialNav.year);
  const [calMonth, setCalMonth] = useState(initialNav.month);

  const [checkin, setCheckin] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  // Second month (also skip off-season)
  const rawMonth2 = calMonth === 11 ? 0 : calMonth + 1;
  const rawYear2 = calMonth === 11 ? calYear + 1 : calYear;
  const nav2 = nextInSeasonMonth(rawYear2, rawMonth2, true);

  function prevMonth() {
    let m = calMonth - 1, y = calYear;
    if (m < 0) { m = 11; y--; }
    const nav = nextInSeasonMonth(y, m, false);
    // don't go before current in-season month
    const limit = nextInSeasonMonth(now.getFullYear(), now.getMonth(), true);
    if (nav.year < limit.year || (nav.year === limit.year && nav.month < limit.month)) return;
    setCalYear(nav.year); setCalMonth(nav.month);
  }

  function nextMonth() {
    let m = calMonth + 1, y = calYear;
    if (m > 11) { m = 0; y++; }
    const nav = nextInSeasonMonth(y, m, true);
    if (nav.year > 2027) return;
    setCalYear(nav.year); setCalMonth(nav.month);
  }

  const canGoPrev = (() => {
    let m = calMonth - 1, y = calYear;
    if (m < 0) { m = 11; y--; }
    const nav = nextInSeasonMonth(y, m, false);
    const limit = nextInSeasonMonth(now.getFullYear(), now.getMonth(), true);
    return nav.year > limit.year || (nav.year === limit.year && nav.month >= limit.month);
  })();

  const canGoNext = (() => {
    let m = calMonth + 1, y = calYear;
    if (m > 11) { m = 0; y++; }
    const nav = nextInSeasonMonth(y, m, true);
    return nav.year <= 2027;
  })();

  const handleDayClick = useCallback((iso: string) => {
    if (!checkin || (checkin && checkout)) {
      setCheckin(iso); setCheckout(null); setHover(null);
      return;
    }
    if (iso <= checkin) { setCheckin(iso); setCheckout(null); return; }
    if (rangeSpansBlocked(checkin, iso, bookedRanges)) {
      setCheckin(iso); setCheckout(null); return;
    }
    setCheckout(iso); setHover(null);
  }, [checkin, checkout, bookedRanges]);

  function clearDates() { setCheckin(null); setCheckout(null); setHover(null); }

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState('sending');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      checkin,
      checkout,
      guests: fd.get('guests'),
      message: fd.get('message'),
    };
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitState(res.ok ? 'sent' : 'error');
    } catch {
      setSubmitState('error');
    }
  }

  // ── styles ──────────────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.375rem' };
  const labelSpanStyle: React.CSSProperties = {
    fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--ink)', opacity: 0.5, fontFamily: "'Inter', sans-serif",
  };
  const inputStyle: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(28,28,26,0.2)',
    padding: '0.625rem 0', fontSize: '1rem', color: 'var(--ink)',
    outline: 'none', fontFamily: "'Inter', sans-serif", width: '100%',
  };

  if (submitState === 'sent') {
    return (
      <div style={{ padding: '2rem 0' }}>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.25rem', color: 'var(--ink)',
        }}>
          {lbl.sent}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <label style={labelStyle}>
        <span style={labelSpanStyle}>{lbl.name}</span>
        <input type="text" name="name" required style={inputStyle} />
      </label>

      <label style={labelStyle}>
        <span style={labelSpanStyle}>{lbl.email}</span>
        <input type="email" name="email" required style={inputStyle} />
      </label>

      <label style={labelStyle}>
        <span style={labelSpanStyle}>{lbl.phone}</span>
        <input type="tel" name="phone" style={inputStyle} />
      </label>

      {/* ── Calendar picker ─────────────────────────────────────────── */}
      <div style={{ marginTop: '0.5rem' }}>

        {/* Selected date display */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={labelStyle}>
              <span style={labelSpanStyle}>{lbl.checkin}</span>
              <span style={{
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
                color: checkin ? 'var(--ink)' : 'rgba(28,28,26,0.25)',
                borderBottom: '1px solid rgba(28,28,26,0.2)',
                padding: '0.3rem 0', minWidth: '8rem',
              }}>
                {checkin ? formatDisplay(checkin, lbl.months) : '—'}
              </span>
            </div>
            <div style={labelStyle}>
              <span style={labelSpanStyle}>{lbl.checkout}</span>
              <span style={{
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
                color: checkout ? 'var(--ink)' : 'rgba(28,28,26,0.25)',
                borderBottom: '1px solid rgba(28,28,26,0.2)',
                padding: '0.3rem 0', minWidth: '8rem',
              }}>
                {checkout ? formatDisplay(checkout, lbl.months) : '—'}
              </span>
            </div>
            {nights > 0 && (
              <div style={labelStyle}>
                <span style={{ ...labelSpanStyle, opacity: 0 }}>·</span>
                <span style={{
                  fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
                  color: 'var(--blue-dark)', padding: '0.3rem 0', opacity: 0.85,
                }}>{lbl.nights(nights)}</span>
              </div>
            )}
          </div>
          {(checkin || checkout) && (
            <button type="button" onClick={clearDates} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink)', opacity: 0.3, fontFamily: "'Inter', sans-serif", padding: 0,
            }}>{lbl.clear}</button>
          )}
        </div>

        {/* Hint */}
        {(!checkin || !checkout) && (
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--ink)',
            opacity: 0.35, marginBottom: '0.75rem', fontFamily: "'Inter', sans-serif",
          }}>
            {!checkin ? lbl.selectCheckin : lbl.thenCheckout}
          </div>
        )}

        {/* Month navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button type="button" onClick={prevMonth} disabled={!canGoPrev} style={{
            background: 'none', border: 'none',
            cursor: canGoPrev ? 'pointer' : 'default',
            opacity: canGoPrev ? 0.6 : 0.15,
            fontSize: '1rem', color: 'var(--ink)', padding: '0.25rem 0.5rem',
          }}>←</button>
          <button type="button" onClick={nextMonth} disabled={!canGoNext} style={{
            background: 'none', border: 'none',
            cursor: canGoNext ? 'pointer' : 'default',
            opacity: canGoNext ? 0.6 : 0.15,
            fontSize: '1rem', color: 'var(--ink)', padding: '0.25rem 0.5rem',
          }}>→</button>
        </div>

        {/* Two months */}
        <div className="book-cal-months" style={{ display: 'flex', gap: '1.5rem' }}>
          <CalMonth
            year={calYear} month={calMonth}
            checkin={checkin} checkout={checkout} hover={hover}
            bookedRanges={bookedRanges}
            onDayClick={handleDayClick} onDayHover={setHover}
            lang={lang}
          />
          <CalMonth
            year={nav2.year} month={nav2.month}
            checkin={checkin} checkout={checkout} hover={hover}
            bookedRanges={bookedRanges}
            onDayClick={handleDayClick} onDayHover={setHover}
            lang={lang}
          />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontFamily: "'Inter', sans-serif", color: 'var(--ink)', opacity: 0.4 }}>
            <span style={{ width: 10, height: 10, background: 'rgba(123,167,188,0.25)', border: '1px solid rgba(123,167,188,0.4)', display: 'inline-block', borderRadius: 2 }} />
            {lbl.available}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontFamily: "'Inter', sans-serif", color: 'var(--ink)', opacity: 0.4 }}>
            <span style={{ width: 10, height: 10, background: 'rgba(28,28,26,0.08)', display: 'inline-block', borderRadius: 2 }} />
            {lbl.booked}
          </span>
        </div>
      </div>

      <label style={labelStyle}>
        <span style={labelSpanStyle}>{lbl.guests}</span>
        <select name="guests" required defaultValue="2" style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <span style={{ fontSize: '0.7rem', color: 'var(--ink)', opacity: 0.4, fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}>
          {lbl.guestsHelper}
        </span>
      </label>

      <label style={labelStyle}>
        <span style={labelSpanStyle}>{lbl.message}</span>
        <textarea name="message" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </label>

      {submitState === 'error' && (
        <p style={{ fontSize: '0.8rem', color: '#b94a48', fontFamily: "'Inter', sans-serif" }}>{lbl.error}</p>
      )}

      <button
        type="submit"
        disabled={submitState === 'sending'}
        style={{
          marginTop: '0.5rem', background: 'var(--blue-dark)', color: 'var(--stone)',
          border: 'none', padding: '1rem 2rem', fontSize: '0.875rem',
          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontWeight: 500,
          opacity: submitState === 'sending' ? 0.6 : 1,
        }}
      >
        {submitState === 'sending' ? lbl.sending : lbl.submit}
      </button>

      <p style={{ fontSize: '0.875rem', color: 'var(--ink)', opacity: 0.5, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
        {lbl.response}
      </p>
    </form>
  );
}
