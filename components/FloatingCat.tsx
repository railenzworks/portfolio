'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NekoCat, type NekoEmotion } from './NekoCat';
import { useLang } from './LangProvider';
import styles from './FloatingCat.module.css';

interface FloatingCatProps {
  /** Initial mood — can also be changed live by tapping the cat. */
  emotion?: NekoEmotion;
}

const MOODS: { value: 'idle' | 'happy' | 'sad' | 'error'; face: string }[] = [
  { value: 'idle', face: ':|' },
  { value: 'happy', face: ':)' },
  { value: 'sad', face: ':(' },
  { value: 'error', face: 'x_x' },
];

export function FloatingCat({ emotion: initialEmotion = 'idle' }: FloatingCatProps) {
  const [emotion, setEmotion] = useState<NekoEmotion>(initialEmotion);
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLang();
  const firstScrollMsg = useRef(t.cat_.firstScroll);
  firstScrollMsg.current = t.cat_.firstScroll;

  useEffect(() => {
    const onFirstScroll = () => {
      window.dispatchEvent(new CustomEvent('neko', { detail: { message: firstScrollMsg.current } }));
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);

  // The cat rides fixed to the bottom of the screen until the word marquee
  // (or the footer, on pages without one) scrolls up to meet it; from then
  // on it stays perched on top of it and scrolls away with the page.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const floor = document.querySelector('.marquee') ?? document.querySelector('.foot');
      const lift = floor ? Math.max(0, window.innerHeight - floor.getBoundingClientRect().top) : 0;
      wrap.style.transform = lift ? `translateY(${-lift}px)` : '';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onOutside = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      window.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  return (
    <div className={styles.wrap} ref={wrapRef} onClick={() => setPickerOpen((v) => !v)}>
      <div className={`${styles.picker} ${pickerOpen ? styles.open : ''}`} role="group" aria-label={t.cat_.moodsLabel}>
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`${styles.pickerBtn} ${emotion === m.value ? styles.pickerBtnActive : ''}`}
            aria-label={t.cat_.moods[m.value]}
            aria-pressed={emotion === m.value}
            onClick={(e) => {
              e.stopPropagation();
              setEmotion(m.value);
              setPickerOpen(false);
            }}
          >
            {m.face}
          </button>
        ))}
      </div>

      <NekoCat
        furColor="#ffffff"
        eyeColor="#3a67f0"
        patchColor="#e3ab7c"
        emotion={emotion}
        message={t.cat_.hello}
        font={{ fontFamily: 'var(--read)', fontSize: 14 }}
        textColor="#17150f"
      />
    </div>
  );
}
