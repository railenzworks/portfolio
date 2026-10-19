'use client';

import { useState, useRef } from 'react';
import { useLang } from '../LangProvider';
import styles from './ContactForm.module.css';

type Disc = 'illustration' | 'graphic' | 'both' | null;

interface Errors {
  name?: string;
  email?: string;
  disc?: string;
  msg?: string;
}

export function ContactForm() {
  const { t } = useLang();
  const f = t.contact.form;
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
    const ac = v === 'illustration' ? 'var(--teal-deep)' : v === 'graphic' ? 'var(--blue)' : null;
    // coloured accents carry white text; the default falls back to the theme's ink
    if (ac) {
      document.body.style.setProperty('--accent', ac);
      // the season's colours may be light, so each brings its own text colour
      document.body.style.setProperty('--on-accent', ac === 'var(--blue)' ? 'var(--on-blue)' : 'var(--on-teal)');
    } else {
      document.body.style.removeProperty('--accent');
      document.body.style.removeProperty('--on-accent');
    }
  };

  const validate = () => {
    const errs: Errors = {};
    if (!name.trim()) errs.name = f.errName;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = f.errEmail;
    if (!disc) errs.disc = f.errDisc;
    if (!msg.trim()) errs.msg = f.errMsg;
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
        <h2>{f.thanksA}<em>{f.thanksB}</em></h2>
        <p>{f.thanksP}</p>
      </div>
    );
  }

  return (
    <form className={`${styles.form} reveal`} ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={styles.step}>{f.step}</div>

      <div className={`${styles.field}${errors.name ? ` ${styles.err}` : ''}`}>
        <label htmlFor="name">{f.name}</label>
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
        <label htmlFor="email">{f.email}</label>
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
        <label>{f.need}</label>
        <div className={styles.pills}>
          {([
            { v: 'illustration', label: t.disc.illustration },
            { v: 'graphic', label: t.disc.graphic },
            { v: 'both', label: f.both },
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
        <label htmlFor="msg">{f.project}</label>
        <textarea
          id="msg"
          name="msg"
          rows={3}
          placeholder={f.placeholder}
          value={msg}
          onChange={(e) => { setMsg(e.target.value); setErrors((er) => ({ ...er, msg: undefined })); }}
        />
        {errors.msg && <div className={styles.msg}>{errors.msg}</div>}
      </div>

      <button className={`btn ${styles.submit}`} type="submit">
        <span>{submitting ? f.sending : f.send}</span>
      </button>
    </form>
  );
}
