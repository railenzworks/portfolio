'use client';

import { useEffect, useRef, useState } from 'react';
import { NekoCat, type NekoEmotion } from './NekoCat';
import styles from './FloatingCat.module.css';

interface FloatingCatProps {
  /** Initial mood — can also be changed live by tapping the cat. */
  emotion?: NekoEmotion;
}

const MOODS: { value: NekoEmotion; label: string; face: string }[] = [
  { value: 'idle', label: 'Idle', face: ':|' },
  { value: 'happy', label: 'Happy', face: ':)' },
  { value: 'sad', label: 'Sad', face: ':(' },
  { value: 'error', label: 'Confused', face: 'x_x' },
];

export function FloatingCat({ emotion: initialEmotion = 'idle' }: FloatingCatProps) {
  const [emotion, setEmotion] = useState<NekoEmotion>(initialEmotion);
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFirstScroll = () => {
      window.dispatchEvent(new CustomEvent('neko', { detail: { message: "hey — I'm Yogur" } }));
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);

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
      <div className={`${styles.picker} ${pickerOpen ? styles.open : ''}`} role="group" aria-label="Change Yogur's mood">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`${styles.pickerBtn} ${emotion === m.value ? styles.pickerBtnActive : ''}`}
            aria-label={m.label}
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
        patchColor="#ef6a43"
        emotion={emotion}
        message="hey — scroll around"
        font={{ fontFamily: 'var(--read)', fontSize: 14 }}
        textColor="#17150f"
      />
    </div>
  );
}
