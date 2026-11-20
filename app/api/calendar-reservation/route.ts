import { NextResponse } from 'next/server';

// Receives the 2027 calendar pre-order form (components/CalendarPopup.tsx) and
// emails it to María through Resend (https://resend.com).
//
// Environment variables (set them in Vercel > Settings > Environment Variables,
// and in .env.local for local development — see .env.example):
//   RESEND_API_KEY   required — API key from resend.com
//   RESERVATION_TO   optional — where the pre-orders go (default below)
//   RESERVATION_FROM optional — sender; the default only works while the Resend
//                    account is registered with the RESERVATION_TO address
const DEFAULT_TO = 'railenzworks@gmail.com';
const DEFAULT_FROM = 'Railenz Web <onboarding@resend.dev>';

const MAX_LEN = 120;
const MAX_QUANTITY = 20;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'invalid');
  }

  // hidden "website" field: people never fill it in, bots do — pretend it worked
  if (typeof body.website === 'string' && body.website !== '') {
    return NextResponse.json({ ok: true });
  }

  const clean = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email);

  const kollektiv = body.kollektiv === 'yes' ? 'Sí' : body.kollektiv === 'no' ? 'No' : '';

  if (!firstName || !lastName || !email || !kollektiv) return fail(400, 'invalid');
  if ([firstName, lastName, email].some((v) => v.length > MAX_LEN)) return fail(400, 'invalid');
  if (!EMAIL_RE.test(email)) return fail(400, 'invalid');

  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return fail(400, 'invalid');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('calendar-reservation: RESEND_API_KEY is not set');
    return fail(500, 'not-configured');
  }

  const fullName = `${firstName} ${lastName}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESERVATION_FROM || DEFAULT_FROM,
      to: [process.env.RESERVATION_TO || DEFAULT_TO],
      // hitting "reply" answers the person who pre-ordered
      reply_to: email,
      subject: `Prerreserva calendario 2027 — ${quantity} ${quantity === 1 ? 'calendario' : 'calendarios'} — ${fullName}`.replace(/[\r\n]/g, ' '),
      text: `Nueva prerreserva del calendario 2027\n\nNombre: ${firstName}\nApellidos: ${lastName}\nEmail: ${email}\nCalendarios: ${quantity}\n¿Viene de parte de Kollektiv?: ${kollektiv}\n`,
      html: `<h2>Nueva prerreserva del calendario 2027</h2>
<p><strong>Nombre:</strong> ${escapeHtml(firstName)}<br>
<strong>Apellidos:</strong> ${escapeHtml(lastName)}<br>
<strong>Email:</strong> ${escapeHtml(email)}<br>
<strong>Calendarios:</strong> ${quantity}<br>
<strong>¿Viene de parte de Kollektiv?:</strong> ${kollektiv}</p>`,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error('calendar-reservation: Resend failed', res?.status, await res?.text().catch(() => ''));
    return fail(502, 'send-failed');
  }

  return NextResponse.json({ ok: true });
}
