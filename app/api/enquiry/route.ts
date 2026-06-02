import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, email, phone, checkin, checkout, guests, message } = data;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  function fmtDate(iso: string): string {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${d}. ${months[m - 1]} ${y}`;
  }

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
<title>Booking Enquiry – Krcka kuća</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#4A7A91;padding:36px 40px;">
              <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Krcka kuća · Skrbčići, otok Krk</p>
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
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${name ?? '—'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0ede8;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Email</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${email ?? '—'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f0ede8;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Phone</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${phone || '—'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a88;font-family:'Georgia',serif;display:inline-block;width:110px;">Guests</span>
                    <span style="font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;">${guests ?? '—'}</span>
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
                <p style="margin:0;font-size:15px;color:#1c1c1a;font-family:'Georgia',serif;line-height:1.7;white-space:pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 36px;">
              <hr style="border:none;border-top:1px solid #e8e4dd;margin:0 0 24px;" />
              <p style="margin:0;font-size:11px;color:#8a8a88;font-family:'Georgia',serif;line-height:1.6;">
                Krcka kuća · Skrbčići 20, Otok Krk, Hrvatska
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Krcka kuća" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
      replyTo: email,
      subject: `Booking enquiry – ${fmtDate(checkin)} → ${fmtDate(checkout)} · ${name}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
  }
}
