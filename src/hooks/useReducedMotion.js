import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    if (preference.addEventListener) {
      preference.addEventListener('change', update);
      return () => preference.removeEventListener('change', update);
    }
    preference.addListener(update);
    return () => preference.removeListener(update);
  }, []);

  return reducedMotion;
}
