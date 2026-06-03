'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/images';

interface Props {
  items: GalleryItem[];
}

export default function FlipModal({ items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number | undefined>(undefined);
  const boxContentRefs = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Responsive columns ── */
  useEffect(() => {
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia>;
    const init = async () => {
      const { default: gsap } = await import('gsap');
      mm = gsap.matchMedia();
      mm.add('(max-width: 768px)', () => setIsMobile(true));
      mm.add('(min-width: 769px)', () => setIsMobile(false));
    };
    init();
    return () => mm?.revert();
  }, []);

  const handleClose = useCallback(async () => {
    const idx = activeIndexRef.current;
    if (idx === undefined || !gridRef.current) return;

    const { default: gsap } = await import('gsap');
    const { Flip } = await import('gsap/Flip');
    gsap.registerPlugin(Flip);

    const box = boxContentRefs.current[idx];
    if (!box) return;

    const state = Flip.getState(box);
    const originalCell = gridRef.current.querySelectorAll('.gallery-cell')[idx];
    originalCell.appendChild(box);
    activeIndexRef.current = undefined;

    gsap.to([modalRef.current, overlayRef.current], {
      autoAlpha: 0,
      ease: 'power1.inOut',
      duration: 0.35,
    });

    Flip.from(state, {
      duration: 0.7,
      ease: 'power1.inOut',
      absolute: true,
      onComplete: () => gsap.set(box, { zIndex: 'auto' }),
    });
    gsap.set(box, { zIndex: 1002 });
  }, []);

  useEffect(() => {
    boxContentRefs.current = boxContentRefs.current.slice(0, items.length);

    const setupListeners = async () => {
      const { default: gsap } = await import('gsap');
      const { Flip } = await import('gsap/Flip');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(Flip, ScrollTrigger);

      const ctx = gsap.context(() => {
        // Stagger fade in on scroll
        const cells = gsap.utils.toArray<HTMLElement>('.gallery-cell', gridRef.current);
        cells.forEach((cell) => {
          gsap.from(cell, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cell,
              start: 'top 92%',
            },
          });
        });

        // Click to expand
        boxContentRefs.current.forEach((box, i) => {
          if (!box) return;
          box.addEventListener('click', async () => {
            if (activeIndexRef.current !== undefined) {
              await handleClose();
              return;
            }
            const state = Flip.getState(box);
            if (modalContentRef.current) {
              modalContentRef.current.appendChild(box);
            }
            activeIndexRef.current = i;
            gsap.set(modalRef.current, { autoAlpha: 1 });
            Flip.from(state, { duration: 0.7, ease: 'power1.inOut' });
            gsap.to(overlayRef.current, { autoAlpha: 0.72, duration: 0.35 });
          });
        });
      }, gridRef.current ?? undefined);

      return ctx;
    };

    let ctx: Awaited<ReturnType<typeof setupListeners>> | null = null;
    setupListeners().then((c) => { ctx = c; });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeIndexRef.current !== undefined) handleClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      ctx?.revert();
      document.removeEventListener('keydown', handleEsc);
    };
  }, [items, handleClose]);

  const cols = isMobile ? 2 : 4;
  const rowHeight = isMobile ? 'clamp(120px, 44vw, 240px)' : 'clamp(160px, 16vw, 260px)';

  return (
    <>
      {/* ── Bento grid ── */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridAutoRows: rowHeight,
          gap: '3px',
          padding: '3px',
          background: 'var(--mist)',
        }}
      >
        {items.map((item, i) => {
          // On mobile collapse all span-2 to full width (span 2 of 2 cols = full row)
          const span = item.cols;
          return (
            <div
              key={i}
              className="gallery-cell"
              style={{
                gridColumn: `span ${span}`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--mist)',
              }}
            >
              <div
                ref={(el) => { if (el) boxContentRefs.current[i] = el; }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={item.img.src}
                  alt={item.img.alt}
                  fill
                  sizes={
                    item.cols === 2
                      ? '(max-width: 768px) 100vw, 50vw'
                      : '(max-width: 768px) 50vw, 25vw'
                  }
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lightbox modal ── */}
      <div
        ref={modalRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          visibility: 'hidden',
          opacity: 0,
        }}
      >
        <div
          ref={overlayRef}
          onClick={handleClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28,28,26,0.92)',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        <div
          ref={modalContentRef}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '88vw',
            height: '82vh',
          }}
        />
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.75rem',
            color: 'var(--stone)',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            zIndex: 2001,
            lineHeight: 1,
            opacity: 0.8,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </>
  );
}
