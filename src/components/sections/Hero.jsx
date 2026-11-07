import { ArrowDown, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Scene3D from '../three/Scene3D.jsx';

export default function Hero({ onSceneReady, onSceneError }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow"><span aria-hidden="true" />Counsel with conviction</p>
          <h1 id="hero-title" className="hero__title">
            <span>Justice.</span>
            <span>Integrity.</span>
            <span className="hero__title-accent">Excellence.</span>
          </h1>
          <p className="hero__description">Strategic legal counsel built on trust, driven by expertise, and committed to protecting what matters most.</p>
          <div className="hero__actions">
            <Button href="#practice-areas">Explore Our Expertise</Button>
            <a className="text-link" href="#contact">Schedule a Consultation <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="hero__assurance"><ShieldCheck size={15} strokeWidth={1.6} aria-hidden="true" /><span>Independent counsel. Unwavering commitment.</span></div>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-halo" aria-hidden="true" />
          <Scene3D onReady={onSceneReady} onError={onSceneError} />
          <div className="hero__visual-caption"><span>01 / 03</span><span>Balance in every matter</span></div>
          <div className="hero__vertical-note" aria-hidden="true">LEXORA · EST. 2004 · COUNSEL WITH CONVICTION</div>
        </div>

        <a className="scroll-cue" href="#about" aria-label="Scroll to about LEXORA">
          <span className="scroll-cue__icon"><ArrowDown size={14} aria-hidden="true" /></span>
          <span>Scroll to discover</span>
        </a>
        <div className="hero__index" aria-hidden="true">01 — 06</div>
      </div>
      <div className="hero__bottom-line" aria-hidden="true" />
    </section>
  );
}
