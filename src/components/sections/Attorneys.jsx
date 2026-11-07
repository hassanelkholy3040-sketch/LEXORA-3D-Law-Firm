import { ArrowUpRight } from 'lucide-react';
import { attorneys } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import { usePointerTilt } from '../../hooks/usePointerTilt.js';

function AttorneyCard({ attorney, index }) {
  const tiltHandlers = usePointerTilt({ maxTilt: 2.4, lift: -4, perspective: 1100 });

  return (
    <article className="attorney-card" {...tiltHandlers}>
      <div className="attorney-card__portrait">
        <img src={attorney.portrait} alt={attorney.alt} loading="lazy" />
        <span className="attorney-card__index">0{index + 1}</span>
        <a href="#contact" aria-label={`Contact ${attorney.name}`} className="attorney-card__arrow"><ArrowUpRight size={18} /></a>
      </div>
      <div className="attorney-card__meta">
        <div><p className="attorney-card__role">{attorney.role}</p><h3>{attorney.name}</h3></div>
        <p className="attorney-card__experience">{attorney.experience}</p>
      </div>
      <p className="attorney-card__focus">{attorney.focus}</p>
    </article>
  );
}

export default function Attorneys() {
  return (
    <section className="section attorneys" id="attorneys" aria-labelledby="attorneys-title">
      <div className="container">
        <div className="attorneys__intro">
          <SectionHeading
            eyebrow="People behind the practice"
            title={<>Meet Our Legal <em>Team</em></>}
            description="Experienced advocates, thoughtful advisors, and committed partners in the work that matters."
            id="attorneys-title"
          />
          <span className="attorneys__fiction-label" data-reveal>Fictional team · Demonstration profiles</span>
        </div>
        <div className="attorney-grid" data-stagger>
          {attorneys.map((attorney, index) => <AttorneyCard attorney={attorney} index={index} key={attorney.name} />)}
        </div>
      </div>
    </section>
  );
}
