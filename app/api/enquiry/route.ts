import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ── Rate limiting (in-memory, best-effort across serverless instances) ─────
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 4;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

// ── HTML escape — never interpolate user input raw into HTML ───────────────
function h(val: unknown): string {
  if (val == null || val === '') return '—';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── Date formatter (only called with already-validated dates) ─────────────
function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d}. ${months[m - 1]} ${y}`;
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  // Parse body
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Sanitise and enforce length limits
  const name    = String(raw.name    ?? '').trim().slice(0, 200);
  const email   = String(raw.email   ?? '').trim().slice(0, 200);
  const phone   = String(raw.phone   ?? '').trim().slice(0, 50);
  const message = String(raw.message ?? '').trim().slice(0, 3000);
  const guests  = String(raw.guests  ?? '').trim();

  // Validate required fields
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!name || !email || !emailRe.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Validate guests (select is 1-4, enforce server-side)
  const guestsNum = Number(guests);
  if (!Number.isInteger(guestsNum) || guestsNum < 1 || guestsNum > 4) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Validate date format (YYYY-MM-DD only)
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const checkin  = typeof raw.checkin  === 'string' && dateRe.test(raw.checkin)  ? raw.checkin  : null;
  const checkout = typeof raw.checkout === 'string' && dateRe.test(raw.checkout) ? raw.checkout : null;

  const nights =
    checkin && checkout
      ? Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86_400_000)
      : 0;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Booking Enquiry – Krčka kuća</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#4A7A91;padding:36px 40px;">
              <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Krčka kuća · Skrbčići, otok Krk</p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#ffffff;line-height:1.3;">New Booking Enquiry</h1>
            </td>
          </tr>

          <!-- Dates block -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e4dd;border-radius:3px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 20px;border-right:1px solid #e8e4dd;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;">Check-in</p>
                    <p style="margin:0;font-size:17px;color:#1c1c1a;font-family:'Georgia',serif;">${fmtDate(checkin)}</p>
                  </td>
                  <td style="padding:18px 20px;border-right:1px solid #e8e4dd;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;">Check-out</p>
                    <p style="margin:0;font-size:17px;color:#1c1c1a;font-family:'Georgia',serif;">${fmtDate(checkout)}</p>
                  </td>
                  <td style="padding:18px 20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;">Duration</p>
                    <p style="margin:0;font-size:17px;color:#4A7A91;font-family:'Georgia',serif;">${nights > 0 ? `${nights} night${nights === 1 ? '' : 's'}` : '—'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Guest details -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;">Guest details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0ede8;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Name</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${h(name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0ede8;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Email</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${h(email)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0ede8;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Phone</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${h(phone)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Guests</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${h(guestsNum)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${message ? `
          <!-- Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;">Message</p>
              <div style="background:#f9f7f4;border-radius:3px;padding:16px 18px;">
                <p style="margin:0;font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;line-height:1.7;white-space:pre-wrap;">${h(message)}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 36px;">
              <hr style="border:none;border-top:1px solid #e8e4dd;margin:0 0 24px;" />
              <p style="margin:0;font-size:11px;color:#8a8a88;font-family:'Georgia',serif;line-height:1.6;">
                Krčka kuća · Skrbčići 20, Otok Krk, Hrvatska
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Krčka kuća" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
      replyTo: email,
      subject: `Booking enquiry – ${fmtDate(checkin)} → ${fmtDate(checkout)} · ${name.replace(/[\r\n]/g, ' ')}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
