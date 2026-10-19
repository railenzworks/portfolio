import { TransitionLink } from '@/components/TransitionLink';
import { getDict } from '@/lib/i18n-server';
import { Footer } from '@/components/Footer';

export default async function NotFound() {
  const t = await getDict();
  return (
    <>
      <main style={{ minHeight: '80svh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)' }}>
        <div className="wrap">
          <p className="mono" style={{ color: 'var(--ink-70)', marginBottom: '20px' }}>{t.notFound.code}</p>
          <h1 className="display">Oops.</h1>
          <p style={{ marginTop: '24px', maxWidth: '36ch', color: 'var(--ink-70)', fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            {t.notFound.text}
          </p>
          <TransitionLink href="/" className="btn" style={{ marginTop: '40px' }}>
            <span>{t.notFound.back}</span>
          </TransitionLink>
        </div>
      </main>
      <Footer
        preword={t.contact.footPre}
        headline={t.contact.footHead}
        cta={{ label: t.contact.footCta, href: '/works' }}
      />
    </>
  );
}
