import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Preloader from './components/layout/Preloader.jsx';
import Hero from './components/sections/Hero.jsx';
import About from './components/sections/About.jsx';
import PracticeAreas from './components/sections/PracticeAreas.jsx';
import Attorneys from './components/sections/Attorneys.jsx';
import WhyChooseUs from './components/sections/WhyChooseUs.jsx';
import Process from './components/sections/Process.jsx';
import Testimonials from './components/sections/Testimonials.jsx';
import Contact from './components/sections/Contact.jsx';
import CursorHalo from './components/ui/CursorHalo.jsx';
import { useGSAPAnimations } from './hooks/useGSAPAnimations.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
  const appRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sceneError, setSceneError] = useState(false);
  const reducedMotion = useReducedMotion();
  useGSAPAnimations(appRef, reducedMotion);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      let targetId;
      try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) return;
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
      document.documentElement.style.scrollBehavior = previousBehavior;
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleSceneReady = useCallback(() => setLoading(false), []);
  const handleSceneError = useCallback(() => setSceneError(true), []);

  return (
    <div className="app-shell" ref={appRef}>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__fill" /></div>
      <CursorHalo />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Preloader active={loading} />
      <Navbar />
      <main id="main-content">
        <Hero onSceneReady={handleSceneReady} onSceneError={handleSceneError} />
        {sceneError && <p className="sr-only" role="status">Three-dimensional rendering is unavailable; a visual fallback is shown.</p>}
        <About />
        <PracticeAreas />
        <Attorneys />
        <WhyChooseUs />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
