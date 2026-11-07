import { ArrowUpRight } from 'lucide-react';
import { practiceAreas } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import { usePointerTilt } from '../../hooks/usePointerTilt.js';

function PracticeCard({ number, title, description, icon: Icon }) {
  const tiltHandlers = usePointerTilt({ targetSelector: '.practice-card__surface', maxTilt: 3, lift: -4 });

  return (
    <article className="practice-card" {...tiltHandlers}>
      <div className="practice-card__surface">
        <div className="practice-card__top"><span>{number}</span><Icon size={23} strokeWidth={1.4} aria-hidden="true" /></div>
        <div className="practice-card__body">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <a href="#contact" className="practice-card__link" aria-label={`Discuss ${title}`}><ArrowUpRight size={17} /></a>
        <span className="practice-card__rule" aria-hidden="true" />
      </div>
    </article>
  );
}

export default function PracticeAreas() {
  return (
    <section className="section practice" id="practice-areas" aria-labelledby="practice-title">
      <div className="container">
        <div className="practice__intro">
          <SectionHeading
            eyebrow="Our expertise"
            title={<>Comprehensive Legal<br /><em>Expertise</em></>}
            description="Focused counsel across the matters that shape businesses, families, and futures."
            id="practice-title"
          />
          <p className="practice__side-note" data-reveal>Each matter is different.<br />Our commitment is constant.</p>
        </div>
        <div className="practice-grid" data-stagger>
          {practiceAreas.map((area) => <PracticeCard key={area.number} {...area} />)}
        </div>
      </div>
    </section>
  );
}
