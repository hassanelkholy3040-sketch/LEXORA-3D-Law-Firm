import SectionHeading from '../ui/SectionHeading.jsx';
import { processSteps } from '../../data/content.js';

export default function Process() {
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading eyebrow="How we work" title={<>A Clear Path <em>Forward</em></>} description="A considered process, with clear guidance at each step." id="process-title" />
        <ol className="process-list" data-stagger>
          {processSteps.map(({ number, title, description, icon: Icon }) => (
            <li className="process-step" key={number}>
              <div className="process-step__marker"><Icon size={19} strokeWidth={1.4} aria-hidden="true" /></div>
              <span className="process-step__number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
