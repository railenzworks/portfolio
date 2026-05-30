'use client';

import { useState, useRef } from 'react';
import styles from './ContactForm.module.css';

type Disc = 'illustration' | 'graphic' | 'both' | null;

interface Errors {
  name?: string;
  email?: string;
  disc?: string;
  msg?: string;
}

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [disc, setDisc] = useState<Disc>(null);
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDisc = (v: Disc) => {
    setDisc(v);
    setErrors((e) => ({ ...e, disc: undefined }));
    const ac = v === 'illustration' ? '#3f8d90' : v === 'graphic' ? '#3a67f0' : '#17150f';
    document.body.style.setProperty('--accent', ac);
  };

  const validate = () => {
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Please tell me your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'A valid email, please.';
    if (!disc) errs.disc = 'Pick at least one.';
    if (!msg.trim()) errs.msg = 'A line or two would help.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  if (sent) {
    return (
      <div className={styles.sentMsg}>
        <h2>Thanks — <em>got it.</em></h2>
        <p>Your message is on its way (well, it would be once this is wired to a real inbox). I&apos;ll get back to you within 48 hours.</p>
      </div>
    );
  }

  return (
    <form className={`${styles.form} reveal`} ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={styles.step}>(01 — Tell me about it)</div>

      <div className={`${styles.field}${errors.name ? ` ${styles.err}` : ''}`}>
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="María García"
          autoComplete="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: undefined })); }}
        />
        {errors.name && <div className={styles.msg}>{errors.name}</div>}
      </div>

      <div className={`${styles.field}${errors.email ? ` ${styles.err}` : ''}`}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined })); }}
        />
        {errors.email && <div className={styles.msg}>{errors.email}</div>}
      </div>

      <div className={`${styles.field}${errors.disc ? ` ${styles.err}` : ''}`}>
        <label>What do you need?</label>
        <div className={styles.pills}>
          {([
            { v: 'illustration', label: 'Illustration' },
            { v: 'graphic', label: 'Graphic Design' },
            { v: 'both', label: 'A bit of both' },
          ] as { v: Disc; label: string }[]).map(({ v, label }) => (
            <button
              key={v!}
              type="button"
              className={`${styles.pill}${disc === v ? ` ${styles.on}` : ''}`}
              data-v={v}
              onClick={() => handleDisc(v)}
            >
              <span className={styles.pip} />
              {label}
            </button>
          ))}
        </div>
        {errors.disc && <div className={styles.msg}>{errors.disc}</div>}
      </div>

      <div className={`${styles.field}${errors.msg ? ` ${styles.err}` : ''}`}>
        <label htmlFor="msg">The project</label>
        <textarea
          id="msg"
          name="msg"
          rows={3}
          placeholder="Tell me what you're making, the timeline, and anything that excites you about it…"
          value={msg}
          onChange={(e) => { setMsg(e.target.value); setErrors((er) => ({ ...er, msg: undefined })); }}
        />
        {errors.msg && <div className={styles.msg}>{errors.msg}</div>}
      </div>

      <button className={`btn ${styles.submit}`} type="submit">
        <span>{submitting ? 'Sending…' : 'Send message →'}</span>
      </button>
    </form>
  );
}
