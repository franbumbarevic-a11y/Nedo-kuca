'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageEntry } from '@/lib/images';

interface Props {
  images: ImageEntry[];
  id: string;
}

export default function HorizontalGallery({ images, id }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null;
    let mm: ReturnType<typeof import('gsap').gsap.matchMedia>;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const sec = wrapperRef.current;
        const pinWrap = stripRef.current;
        if (!sec || !pinWrap) return;

        let pinWrapWidth = pinWrap.scrollWidth;
        let horizontalScrollLength = pinWrapWidth - window.innerWidth;

        const refresh = () => {
          pinWrapWidth = pinWrap.scrollWidth;
          horizontalScrollLength = pinWrapWidth - window.innerWidth;
        };
        refresh();

        ctx = gsap.context(() => {
          gsap.to(pinWrap, {
            scrollTrigger: {
              scrub: true,
              trigger: sec,
              pin: sec,
              start: 'center center',
              end: () => `+=${pinWrapWidth}`,
              invalidateOnRefresh: true,
            },
            x: () => -horizontalScrollLength,
            ease: 'none',
          });

          ScrollTrigger.addEventListener('refreshInit', refresh);
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', refresh);
        };
      });

      mm.add('(max-width: 768px)', () => {
        // On mobile: show as vertical scroll, no pinning
      });
    };

    init();

    return () => {
      ctx?.revert();
      mm?.revert();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="horiz-gallery-wrapper"
      id={id}
      style={{ height: '100vh' }}
    >
      <div
        ref={stripRef}
        className="horiz-gallery-strip"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '0 5vw',
          gap: '2vw',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 'clamp(280px, 30vw, 520px)',
              height: '65vh',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="30vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
