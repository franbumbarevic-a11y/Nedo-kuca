'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ImageEntry } from '@/lib/images';

interface Props {
  images: ImageEntry[];
}

export default function FlipModal({ images }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number | undefined>(undefined);
  const boxContentRefs = useRef<HTMLDivElement[]>([]);

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
    boxContentRefs.current = boxContentRefs.current.slice(0, images.length);

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
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cell,
              start: 'top 90%',
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
            gsap.to(overlayRef.current, { autoAlpha: 0.65, duration: 0.35 });
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
  }, [images, handleClose]);

  return (
    <>
      {/* Gallery grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          padding: '5vw',
        }}
      >
        {images.map((img, i) => {
          // Alternate aspect ratios for editorial feel; no span-2 to avoid grid holes
          const aspects = ['3/2', '2/3', '3/2', '2/3', '3/2', '1/1'];
          const aspect = aspects[i % aspects.length];
          return (
            <div
              key={i}
              className="gallery-cell"
              style={{
                position: 'relative',
                aspectRatio: aspect,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* position:absolute so height is always defined for Next Image fill */}
              <div
                ref={(el) => { if (el) boxContentRefs.current[i] = el; }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
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
            width: '85vw',
            height: '80vh',
          }}
        />
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            color: 'var(--stone)',
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            zIndex: 2001,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </>
  );
}
