'use client';

import { useLayoutEffect, useRef } from 'react';
import { useLang } from './LangProvider';
import { WIP_EVENT } from './WipToast';
import toggle from './LangToggle.module.css';
import styles from './AboutSwitch.module.css';

interface AboutSwitchProps<T extends string> {
  /** `wip`: not finished, so it shows "WIP" on the cursor and can't be picked */
  options: readonly { id: T; label: string; wip?: boolean }[];
  value: T;
  onChange: (id: T) => void;
  /** aria-label of the group */
  label: string;
  className?: string;
}

// LangToggle's glass pill, made taller and with options as wide as their words,
// so any label fits: used for WHO / WHY and for the About / Experience / More pages.
export function AboutSwitch<T extends string>({ options, value, onChange, label, className }: AboutSwitchProps<T>) {
  const { t } = useLang();
  const groupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // the options differ in width, so the pill is sized and placed under the
  // active one; again whenever the words change size (language, fonts)
  useLayoutEffect(() => {
    const group = groupRef.current;
    const pill = pillRef.current;
    if (!group || !pill) return;
    const place = () => {
      const btn = group.querySelector<HTMLElement>(`[data-tab="${value}"]`);
      if (!btn) return;
      pill.style.width = `${btn.offsetWidth}px`;
      pill.style.transform = `translateX(${btn.offsetLeft - pill.offsetLeft}px)`;
    };
    place();
    const ro = new ResizeObserver(place);
    group.querySelectorAll('button').forEach((b) => ro.observe(b));
    return () => ro.disconnect();
  }, [value, options]);

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <div ref={groupRef} className={`${toggle.toggle} ${styles.switch}`} role="group" aria-label={label}>
        <span ref={pillRef} className={`${toggle.pill} ${styles.pill}`} aria-hidden="true" data-no-fade />
        {options.map((o) => (
          <button
            key={o.id}
            data-tab={o.id}
            type="button"
            className={`${toggle.opt} ${value === o.id ? toggle.on : ''} ${styles.opt}`}
            aria-pressed={value === o.id}
            onClick={() => {
              if (!o.wip) return onChange(o.id);
              // no cursor label on touch screens: show the toast instead
              if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                window.dispatchEvent(new Event(WIP_EVENT));
              }
            }}
            {...(o.wip && { 'aria-disabled': true, 'data-cursor': 'view', 'data-label': t.wip })}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
