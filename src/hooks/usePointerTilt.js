import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';

export function usePointerTilt({ targetSelector, maxTilt = 3.2, lift = -4, perspective = 900 } = {}) {
  const activeTarget = useRef(null);

  const getTarget = useCallback((host) => (
    targetSelector ? host.querySelector(targetSelector) : host
  ), [targetSelector]);

  const onPointerMove = useCallback((event) => {
    if (event.pointerType !== 'mouse'
      || !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = getTarget(event.currentTarget);
    if (!target) return;
    activeTarget.current = target;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(target, {
      rotationX: -y * maxTilt * 2,
      rotationY: x * maxTilt * 2,
      y: lift,
      transformPerspective: perspective,
      transformOrigin: '50% 50%',
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, [getTarget, lift, maxTilt, perspective]);

  const onPointerLeave = useCallback((event) => {
    const target = getTarget(event.currentTarget);
    if (!target) return;
    activeTarget.current = target;
    gsap.to(target, {
      rotationX: 0,
      rotationY: 0,
      y: 0,
      duration: 0.48,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, [getTarget]);

  useEffect(() => () => {
    if (activeTarget.current) gsap.killTweensOf(activeTarget.current);
  }, []);

  return { onPointerMove, onPointerLeave };
}
