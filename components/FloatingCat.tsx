'use client';

import { useEffect } from 'react';
import { NekoCat, type NekoEmotion } from './NekoCat';
import styles from './FloatingCat.module.css';

interface FloatingCatProps {
  /**
   * Change the cat's mood by editing this prop, e.g. emotion="happy".
   * Options: 'idle' | 'happy' | 'sad' | 'error'.
   */
  emotion?: NekoEmotion;
}

export function FloatingCat({ emotion = 'idle' }: FloatingCatProps) {
  useEffect(() => {
    const onFirstScroll = () => {
      window.dispatchEvent(new CustomEvent('neko', { detail: { message: "hey — I'm Yogur" } }));
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);

  return (
    <div className={styles.wrap}>
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
