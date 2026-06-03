'use client';

import { useEffect, useRef } from 'react';

interface Props {
  lines: string[];
}

export default function RollingText({ lines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { SplitText } = await import('gsap/SplitText');
      gsap.registerPlugin(SplitText);

      const container = containerRef.current;
      if (!container) return;

      gsap.set(container, { visibility: 'visible' });

      const lineEls = container.querySelectorAll('.rolling-line');

      const width = window.innerWidth;
      const depth = -width / 8;
      const transformOrigin = `50% 50% ${depth}px`;

      ctx = gsap.context(() => {
        const splitLines = Array.from(lineEls).map(
          (line) => new SplitText(line, { type: 'chars', charsClass: 'char' })
        );

        gsap.set(lineEls, { perspective: 700, transformStyle: 'preserve-3d' });

        // Each line: roll in (0.5s), hold (2s), roll out (0.5s)
        const enterDur = 0.5;
        const holdDur = 2.2;
        const exitDur = 0.5;
        const staggerAmt = 0.04;
        const extraStagger = staggerAmt * 10; // approx extra time for stagger spread
        const cycleLen = enterDur + extraStagger + holdDur + exitDur + extraStagger;

        const tl = gsap.timeline({ repeat: -1 });

        splitLines.forEach((split, index) => {
          const startAt = index * cycleLen;

          // Roll in: rotationX -90 → 0
          tl.fromTo(
            split.chars,
            { rotationX: -90 },
            { rotationX: 0, stagger: staggerAmt, duration: enterDur, ease: 'power2.out', transformOrigin },
            startAt
          );
          // Hold: nothing — the chars sit at rotationX 0

          // Roll out: rotationX 0 → 90
          tl.to(
            split.chars,
            { rotationX: 90, stagger: staggerAmt, duration: exitDur, ease: 'power2.in', transformOrigin },
            startAt + enterDur + extraStagger + holdDur
          );
        });
      }, container);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="rolling-container"
      style={{ visibility: 'hidden' }}
    >
      <div className="rolling-tube">
        {lines.map((line, i) => (
          <p key={i} className="rolling-line" style={{ color: 'var(--blue-dark)' }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
