import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorHalo() {
  const haloRef = useRef(null);

  useEffect(() => {
    const halo = haloRef.current;
    if (!halo) return undefined;

    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const xTo = gsap.quickTo(halo, 'x', { duration: 0.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(halo, 'y', { duration: 0.2, ease: 'power3.out' });
    const opacityTo = gsap.quickTo(halo, 'autoAlpha', { duration: 0.16, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(halo, 'scale', { duration: 0.22, ease: 'power2.out' });
    let listening = false;
    const subscribe = (mediaQuery, callback) => {
      if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', callback);
      else mediaQuery.addListener(callback);
    };
    const unsubscribe = (mediaQuery, callback) => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', callback);
      else mediaQuery.removeListener(callback);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('.scene3d')) {
        opacityTo(0);
        return;
      }

      xTo(event.clientX);
      yTo(event.clientY);
      opacityTo(1);
      scaleTo(target?.closest('a, button, input, textarea, select, [role="button"]') ? 1.35 : 1);
    };

    const onPointerOut = (event) => {
      if (!event.relatedTarget) opacityTo(0);
    };

    const stop = () => {
      if (!listening) return;
      listening = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', onPointerOut);
      gsap.set(halo, { autoAlpha: 0, scale: 0.82 });
    };

    const sync = () => {
      if (hoverPointer.matches && !reducedMotion.matches) {
        if (listening) return;
        listening = true;
        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerout', onPointerOut, { passive: true });
      } else {
        stop();
      }
    };

    subscribe(hoverPointer, sync);
    subscribe(reducedMotion, sync);
    sync();

    return () => {
      stop();
      unsubscribe(hoverPointer, sync);
      unsubscribe(reducedMotion, sync);
      gsap.killTweensOf(halo);
    };
  }, []);

  return <span className="cursor-halo" ref={haloRef} aria-hidden="true" />;
}
