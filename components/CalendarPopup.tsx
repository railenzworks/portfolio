'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangProvider';
import styles from './CalendarPopup.module.css';

// Fired by the "Reserve calendar 2027" button in the nav (and anything else that
// wants to reopen the popup): it opens straight on the pre-order sheet.
export const CALENDAR_EVENT = 'open-calendar';
// The shareable link: this page is the home page with the popup already open
// (app/calendario/page.tsx), and it has its own share preview.
export const CALENDAR_PATH = '/calendario';

// Set in sessionStorage once the popup has appeared, so it shows once per visit
// (a new tab / browser session shows it again).
const SEEN_KEY = 'calendar-2027-seen';
const SHOW_DELAY_MS = 700;

type Step = 'ask' | 'form' | 'sent';
// On phones the sheet is split in two screens (the story, then the form) so
// neither needs scrolling; on wider screens both show at once.
type View = 'info' | 'form';
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  kollektiv?: string;
}
type YesNo = '' | 'yes' | 'no';

// A card that pops up as soon as someone lands on the site and asks whether they
// want to pre-order the 2027 calendar. "Yes" opens the calendar's picture, text
// and price followed by the pre-order form (sent by e-mail through
// /api/calendar-reservation); "Visit the website" just closes it.
export function CalendarPopup() {
  const { t } = useLang();
  const c = t.calendar;
  const [shown, setShown] = useState(false);
  const [step, setStep] = useState<Step>('ask');
  const [view, setView] = useState<View>('info');
  const [expanded, setExpanded] = useState(false); // phones: full text open
  const pathname = usePathname();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [kollektiv, setKollektiv] = useState<YesNo>('');
  const [website, setWebsite] = useState(''); // honeypot, left empty by people
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const markSeen = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
  };

  // opens straight on the pre-order sheet (nav button, shared link)
  const openSheet = () => {
    returnTo.current = document.activeElement as HTMLElement | null;
    markSeen();
    setStep('form');
    setView('info');
    setSendError(false);
    setErrors({});
    setShown(true);
  };

  // on arrival: the shared link opens the sheet; any other page asks the question,
  // once per session
  useEffect(() => {
    if (pathname === CALENDAR_PATH) {
      const id = window.setTimeout(openSheet, 300);
      return () => window.clearTimeout(id);
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {}
    if (seen) return;
    const id = window.setTimeout(() => {
      returnTo.current = document.activeElement as HTMLElement | null;
      markSeen();
      setShown(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
    // only on arrival: later navigation must not reopen it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener(CALENDAR_EVENT, openSheet);
    return () => window.removeEventListener(CALENDAR_EVENT, openSheet);
  }, []);

  const close = () => {
    setShown(false);
    returnTo.current?.focus();
  };

  // while shown: Escape closes, the page behind doesn't scroll
  useEffect(() => {
    if (!shown) return;
    (yesRef.current ?? cardRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [shown]);

  const goTo = (next: Step, nextView: View = 'info') => {
    setStep(next);
    setView(nextView);
    setExpanded(false);
    cardRef.current?.scrollTo({ top: 0 });
  };

  const validate = () => {
    const errs: Errors = {};
    if (!firstName.trim()) errs.firstName = c.errFirstName;
    if (!lastName.trim()) errs.lastName = c.errLastName;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errs.email = c.errEmail;
    if (!kollektiv) errs.kollektiv = c.errKollektiv;
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    setSendError(false);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/calendar-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, kollektiv, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setFirstName('');
      setLastName('');
      setEmail('');
      setKollektiv('');
      goTo('sent');
    } catch {
      setSendError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    id: keyof Errors,
    label: string,
    value: string,
    set: (v: string) => void,
    props: { type?: string; autoComplete: string; wide?: boolean },
  ) => (
    <div
      className={`${styles.field}${props.wide ? ` ${styles.fieldWide}` : ''}${errors[id] ? ` ${styles.err}` : ''}`}
    >
      <label htmlFor={`cal-${id}`}>{label}</label>
      <input
        id={`cal-${id}`}
        name={id}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        value={value}
        maxLength={120}
        aria-invalid={!!errors[id]}
        onChange={(e) => {
          set(e.target.value);
          setErrors((er) => ({ ...er, [id]: undefined }));
        }}
      />
      {errors[id] && <div className={styles.msg}>{errors[id]}</div>}
    </div>
  );

  return (
    <div
      className={`${styles.overlay} ${shown ? styles.shown : ''}`}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        className={`${styles.card} ${step === 'ask' ? styles.ask : styles.wide}`}
        data-cal
        role="dialog"
        aria-modal="true"
        aria-label={c.askTitle}
      >
        {/* zero-height sticky bar: the close button stays in the corner while
            the card scrolls (on phones the card fills the screen) */}
        <div className={styles.closeBar}>
          <button type="button" className={styles.close} onClick={close} aria-label={c.close}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === 'ask' && (
          <div className={styles.askBody}>
            {/* the calendar's poster, laid on the card like the contact folder's sheet */}
            <div className={styles.askSheet}>
              <Image
                src="/images/calendario/calendario-2027.png"
                alt={c.imageAlt}
                width={1080}
                height={1350}
                sizes="(max-width: 640px) 170px, 230px"
                className={styles.image}
                priority
              />
            </div>
            <div className={styles.askText}>
              <span className={styles.eyebrow}>{c.eyebrow}</span>
              <h2 className={styles.askTitle}>{c.askTitle}</h2>
              <div className={styles.actions}>
                <button ref={yesRef} type="button" className="btn btn--solid" onClick={() => goTo('form')}>
                  <span>{c.askYes}</span>
                </button>
                <button type="button" className={`btn ${styles.secondary}`} onClick={close}>
                  <span>{c.askNo}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step !== 'ask' && (
          <div className={styles.layout} data-view={view}>
            {/* poster + price, together like a product card */}
            <div className={styles.side}>
              <div className={styles.sheet}>
                <Image
                  src="/images/calendario/calendario-2027.png"
                  alt={c.imageAlt}
                  width={1080}
                  height={1350}
                  sizes="(max-width: 820px) 260px, 340px"
                  className={styles.image}
                  priority
                />
              </div>
              <div className={styles.price}>
                <div className={styles.priceTag}>
                  <span className={styles.priceLabel}>{c.priceLabel}</span>
                  <span className={styles.priceValue}>{c.price}</span>
                </div>
                <span className={styles.priceNote}>{c.priceNote}</span>
              </div>
            </div>

            <div className={styles.content}>
              {step === 'form' ? (
                <>
                  <span className={styles.eyebrow}>{c.eyebrow}</span>
                  <h2 className={styles.title}>{c.title}</h2>
                  {/* phones only: a summary, with the full text behind "Read more" */}
                  {!expanded && <p className={`${styles.lead} ${styles.summary}`}>{c.summary}</p>}
                  <div id="calendar-full-text" className={styles.full} data-open={expanded || undefined}>
                    {c.intro.map((p, i) => (
                      <p key={p} className={i === 0 ? styles.lead : undefined}>
                        {p}
                      </p>
                    ))}
                    <ul className={styles.list}>
                      {c.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                    {c.outro.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.more}
                    aria-expanded={expanded}
                    aria-controls="calendar-full-text"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? c.less : c.more}
                  </button>
                  {/* phones only: on to the form screen */}
                  <button
                    type="button"
                    className={`btn btn--solid ${styles.next}`}
                    onClick={() => goTo('form', 'form')}
                  >
                    <span>{c.send}</span>
                  </button>
                </>
              ) : (
                <div className={styles.sentMsg} role="status">
                  <span className={styles.eyebrow}>{c.eyebrow}</span>
                  <h2 className={styles.title}>{c.thanksTitle}</h2>
                  <p>{c.thanksBody}</p>
                  <button type="button" className="btn btn--solid" onClick={close}>
                    <span>{c.thanksCta}</span>
                  </button>
                </div>
              )}
            </div>

            {/* under the poster on desktop, after the text on phones */}
            {step === 'form' && (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <h3 className={styles.formTitle}>
                  {/* phones only: back to the story screen */}
                  <button type="button" className={styles.back} onClick={() => goTo('form', 'info')} aria-label={c.back}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                  {c.formTitle}
                </h3>
                {field('firstName', c.firstName, firstName, setFirstName, { autoComplete: 'given-name' })}
                {field('lastName', c.lastName, lastName, setLastName, { autoComplete: 'family-name' })}
                {field('email', c.email, email, setEmail, { type: 'email', autoComplete: 'email', wide: true })}

                <fieldset
                  className={`${styles.field} ${styles.fieldWide} ${styles.choice}${errors.kollektiv ? ` ${styles.err}` : ''}`}
                  aria-invalid={!!errors.kollektiv}
                >
                  <legend>{c.kollektiv}</legend>
                  <p className={styles.hint} id="kollektiv-hint">{c.kollektivHint.split('**').map((s, i) => (i % 2 ? <strong key={i}>{s}</strong> : s))}</p>
                  <div className={styles.options} role="radiogroup" aria-describedby="kollektiv-hint">
                    {(['yes', 'no'] as const).map((v) => (
                      <label key={v}>
                        <input
                          type="radio"
                          name="kollektiv"
                          value={v}
                          required
                          checked={kollektiv === v}
                          onChange={() => {
                            setKollektiv(v);
                            setErrors((er) => ({ ...er, kollektiv: undefined }));
                          }}
                        />
                        <span>{v === 'yes' ? c.yes : c.no}</span>
                      </label>
                    ))}
                  </div>
                  {errors.kollektiv && <div className={styles.msg}>{errors.kollektiv}</div>}
                </fieldset>

                {/* honeypot: off-screen, so people never see or fill it */}
                <div className={styles.trap} aria-hidden="true">
                  <label htmlFor="cal-website">Website</label>
                  <input
                    id="cal-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <p className={styles.consent}>{c.consent}</p>
                {sendError && (
                  <div className={`${styles.msg} ${styles.sendErr}`} role="alert">
                    {c.errSend}
                  </div>
                )}
                <button className="btn btn--solid" type="submit" disabled={submitting}>
                  <span>{submitting ? c.sending : c.send}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
