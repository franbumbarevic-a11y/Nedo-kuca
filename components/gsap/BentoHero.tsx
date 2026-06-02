'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageEntry } from '@/lib/images';

interface Props {
  images: ImageEntry[];
  title: string;
}

export default function BentoHero({ images, title }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const flipCtxRef = useRef<ReturnType<typeof import('gsap').gsap.context> | null>(null);

  useEffect(() => {
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia>;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { Flip } = await import('gsap/Flip');
      gsap.registerPlugin(ScrollTrigger, Flip);

      mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const createTween = () => {
          const galleryEl = galleryRef.current;
          if (!galleryEl) return;

          const items = galleryEl.querySelectorAll('.gallery__item');

          flipCtxRef.current?.revert();
          galleryEl.classList.remove('gallery--final');

          flipCtxRef.current = gsap.context(() => {
            galleryEl.classList.add('gallery--final');
            const flipState = Flip.getState(items);
            galleryEl.classList.remove('gallery--final');

            const flip = Flip.to(flipState, {
              simple: true,
              ease: 'expoScale(1, 5)',
            });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: galleryEl,
                start: 'center center',
                end: '+=100%',
                scrub: true,
                pin: wrapRef.current!,
                onUpdate: (self) => {
                  if (headingRef.current) {
                    headingRef.current.style.opacity = String(
                      Math.max(0, (self.progress - 0.85) * 6.67)
                    );
                  }
                },
              },
            });
            tl.add(flip);

            return () => gsap.set(items, { clearProps: 'all' });
          });
        };

        createTween();
        window.addEventListener('resize', createTween);
        return () => window.removeEventListener('resize', createTween);
      });

      mm.add('(max-width: 768px)', () => {
        if (headingRef.current) headingRef.current.style.opacity = '1';
      });
    };

    init();

    return () => {
      flipCtxRef.current?.revert();
      mm?.revert();
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.killAll());
    };
  }, []);

  const displayed = images.slice(0, 6);

  return (
    <div ref={wrapRef} className="gallery-wrap" style={{ height: '100vh' }}>
      <div
        ref={galleryRef}
        className="gallery gallery--bento"
        id="gallery-bento"
      >
        {displayed.map((img, i) => (
          <div key={i} className="gallery__item" style={{ position: 'relative' }}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              priority={i < 3}
            />
            {img.num !== undefined && (
              <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 20, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 18, fontWeight: 700, padding: '2px 8px', borderRadius: 4, pointerEvents: 'none' }}>
                {img.num}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Heading overlay */}
      <div
        ref={headingRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            color: 'var(--stone)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            textShadow: '0 2px 40px rgba(0,0,0,0.4)',
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
