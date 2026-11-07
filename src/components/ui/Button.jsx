import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export default function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  arrow = true,
  onClick,
  type,
  disabled = false,
  ...props
}) {
  const buttonRef = useRef(null);
  const moveX = useRef(null);
  const moveY = useRef(null);
  const moveScale = useRef(null);
  const classes = `button button--${variant} ${className}`.trim();
  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return undefined;
    moveX.current = gsap.quickTo(element, 'x', { duration: 0.22, ease: 'power3.out' });
    moveY.current = gsap.quickTo(element, 'y', { duration: 0.22, ease: 'power3.out' });
    moveScale.current = gsap.quickTo(element, 'scale', { duration: 0.22, ease: 'power3.out' });
    return () => gsap.killTweensOf(element);
  }, []);

  const handleEnter = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    moveY.current?.(-2);
    moveScale.current?.(1.015);
  };
  const handleMove = (event) => {
    if (event.pointerType !== 'mouse'
      || !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    moveX.current?.(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
    moveY.current?.(-2 + ((event.clientY - bounds.top) / bounds.height - 0.5) * 3);
  };
  const handleLeave = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (buttonRef.current) gsap.set(buttonRef.current, { x: 0, y: 0, scale: 1 });
      return;
    }
    moveX.current?.(0);
    moveY.current?.(0);
    moveScale.current?.(1);
  };
  const content = <>{children}{arrow && <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />}</>;

  if (href) {
    return (
      <a
        ref={buttonRef}
        className={classes}
        href={href}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={classes}
      type={type ?? 'button'}
      onClick={onClick}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}
