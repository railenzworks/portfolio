import Image from 'next/image';
import type { Project } from '@/lib/projects';
import styles from './ProjectCover.module.css';

interface ProjectCoverProps {
  project: Project;
  alt: string;
  /** `sizes` for the whole cover; split covers divide it between their images. */
  sizes: string;
  quality?: number;
  unoptimized?: boolean;
  priority?: boolean;
}

// A project's cover: its `img`, or — when it has `imgs` too — all of them
// side by side in equal columns, each filling its column. Fills its parent,
// which must be positioned.
export function ProjectCover({ project, alt, sizes, quality, unoptimized, priority }: ProjectCoverProps) {
  const srcs = [project.img, ...(project.imgs ?? [])];
  const cellSizes = srcs.length > 1 ? sizes.replace(/(\d+)vw/g, (_, n) => `${Math.ceil(Number(n) / srcs.length)}vw`) : sizes;

  return (
    <div className={styles.cover} {...(srcs.length > 1 && { 'data-split': '' })}>
      {srcs.map((src, i) => (
        <div key={src} className={styles.cell}>
          <Image
            src={src}
            alt={i === 0 ? alt : ''}
            fill
            sizes={cellSizes}
            quality={quality}
            unoptimized={unoptimized}
            priority={priority}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
