import { TransitionLink } from '@/components/TransitionLink';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <main style={{ minHeight: '80svh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)' }}>
        <div className="wrap">
          <p className="mono" style={{ color: 'var(--ink-70)', marginBottom: '20px' }}>404 — Not found</p>
          <h1 className="display">Oops.</h1>
          <p style={{ marginTop: '24px', maxWidth: '36ch', color: 'var(--ink-70)', fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            That page doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
          <TransitionLink href="/" className="btn" style={{ marginTop: '40px' }} accent="#17150f">
            <span>Back home</span>
          </TransitionLink>
        </div>
      </main>
      <Footer
        preword="See"
        headline="the work —"
        cta={{ label: 'Browse projects', href: '/works', accent: '#17150f' }}
      />
    </>
  );
}
