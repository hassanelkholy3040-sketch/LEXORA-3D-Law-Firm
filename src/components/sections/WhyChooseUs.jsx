import SectionHeading from '../ui/SectionHeading.jsx';
import { reasons } from '../../data/content.js';

export default function WhyChooseUs() {
  return (
    <section className="section why" id="why-lexora" aria-labelledby="why-title">
      <div className="container why__layout">
        <div className="why__intro">
          <SectionHeading
            eyebrow="Why LEXORA"
            title={<>Counsel that sees<br /><em>the whole picture.</em></>}
            description="Good legal work begins with listening. We bring precision to the details and perspective to the decisions ahead."
            id="why-title"
          />
          <div className="why__signature" data-reveal><span className="why__signature-mark">L</span><span>Thoughtfully<br />by your side</span></div>
        </div>
        <div className="why__features" data-stagger>
          {reasons.map(({ number, title, description, icon: Icon }) => (
            <article className="why-feature" key={number}>
              <div className="why-feature__heading"><span>{number}</span><Icon size={22} strokeWidth={1.4} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
