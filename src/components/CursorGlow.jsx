import { useEffect, useRef } from 'react';

// Soft gold light that trails the cursor. Desktop + fine-pointer only.
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!fine || reduce) return;

    let cx = innerWidth / 2,
      cy = innerHeight / 2;
    let tx = cx,
      ty = cy;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden='true'
      className='pointer-events-none fixed left-0 top-0 z-[5] -ml-[150px] -mt-[150px] h-[300px] w-[300px] rounded-full'
      style={{
        background:
          'radial-gradient(circle, rgba(228,201,138,0.10), transparent 65%)',
      }}
    />
  );
}
