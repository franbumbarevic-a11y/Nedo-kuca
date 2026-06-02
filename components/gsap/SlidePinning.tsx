'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageEntry } from '@/lib/images';

interface Panel {
  title: string;
  text: string;
  image: ImageEntry;
}

interface Props {
  panels: Panel[];
}

export default function SlidePinning({ panels }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dead = false;
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia> | null = null;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (dead) return;

      mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const allPanels = gsap.utils.toArray<HTMLElement>('.kk-slide', wrapper);
        const animPanels = allPanels.slice(0, -1);

        allPanels.forEach((p, i) => { p.style.zIndex = String(i + 1); });

        const ctx = gsap.context(() => {
          animPanels.forEach((panel) => {
            gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                start: 'bottom bottom',
                end: '+=100%',
                pin: true,
                pinSpacing: false,
                scrub: true,
              },
            }).to(panel, { scale: 0.85, opacity: 0, ease: 'none' });
          });
        }, wrapper);

        return () => {
          ctx.revert();
          allPanels.forEach((p) => {
            p.style.zIndex = '';
            p.style.scale = '';
            p.style.opacity = '';
          });
        };
      });

      mm.add('(max-width: 768px)', () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const allPanels = gsap.utils.toArray<HTMLElement>('.kk-slide', wrapper);
        const ctx = gsap.context(() => {
          allPanels.forEach((panel) => {
            gsap.from(panel, {
              opacity: 0,
              y: 40,
              duration: 0.8,
              scrollTrigger: { trigger: panel, start: 'top 85%' },
            });
          });
        }, wrapper);
        return () => { ctx.revert(); };
      });
    };

    init();

    return () => {
      dead = true;
      mm?.revert();
    };
  }, []);

  const panelContent = (panel: Panel, i: number) => {
    const textBlock = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem, 6vw, 6rem)',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--blue-dark)',
            marginBottom: '1.5rem',
          }}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            marginBottom: '1.25rem',
            color: 'var(--ink)',
            lineHeight: 1.2,
          }}
        >
          {panel.title}
        </h3>
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
            maxWidth: '38ch',
            opacity: 0.75,
          }}
        >
          {panel.text}
        </p>
      </div>
    );

    const imgBlock = (
      <div style={{ position: 'relative', height: '100%' }}>
        <Image
          src={panel.image.src}
          alt={panel.image.alt}
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
    );

    return i % 2 === 0 ? (
      <>
        {textBlock}
        {imgBlock}
      </>
    ) : (
      <>
        {imgBlock}
        {textBlock}
      </>
    );
  };

  return (
    <div ref={wrapperRef}>
      {panels.map((panel, i) => (
        <section
          key={i}
          className="kk-slide"
          style={{
            /* Must be exact, not min-height — the fakeScrollRatio math
               depends on panelHeight === windowHeight when content fits */
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            borderRadius: '8px',
            position: 'relative',
            background: i % 2 === 0 ? 'var(--stone)' : 'var(--mist)',
          }}
        >
          <div
            className="kk-slide-inner"
            style={{
              height: '100%',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {panelContent(panel, i)}
          </div>
        </section>
      ))}

      {/* Terminal slide — popped from array, never pinned, gives scroll room */}
      <section
        className="kk-slide"
        aria-hidden="true"
        style={{ height: '1px', overflow: 'hidden', visibility: 'hidden' }}
      />
    </div>
  );
}
