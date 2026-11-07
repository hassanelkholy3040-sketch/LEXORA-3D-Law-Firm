import { ArrowUpRight, Sparkles } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__layout">
        <div className="about__main">
          <SectionHeading
            eyebrow="The LEXORA standard"
            title={<>Built on Principles.<br /><em>Driven by Results.</em></>}
            id="about-title"
          />
          <p className="about__description" data-reveal>At LEXORA, we combine strategic thinking, legal expertise, and an unwavering commitment to our clients. Our approach is built around understanding complex challenges and delivering thoughtful legal solutions.</p>
          <a className="text-link" href="#why-lexora" data-reveal>Discover our approach <ArrowUpRight size={15} aria-hidden="true" /></a>
          <div className="about__stats" aria-label="Fictional demonstration firm statistics">
            <AnimatedCounter value={20} suffix="+" label="Years of experience" />
            <AnimatedCounter value={500} suffix="+" label="Cases handled" />
            <AnimatedCounter value={98} suffix="%" label="Client satisfaction" />
          </div>
          <p className="about__demo-note">Demonstration figures; not verified business claims.</p>
        </div>

        <div className="about-art" data-reveal aria-hidden="true">
          <div className="about-art__frame">
            <div className="about-art__arch" />
            <div className="about-art__pillar about-art__pillar--left" />
            <div className="about-art__pillar about-art__pillar--right" />
            <div className="about-art__horizon" />
            <div className="about-art__sun"><Sparkles size={19} strokeWidth={1.2} /></div>
            <span className="about-art__word">VERITAS</span>
            <span className="about-art__caption">A practice built around trust</span>
          </div>
          <div className="about-art__stamp"><span>PRINCIPLED</span><span>BY DESIGN</span><ArrowUpRight size={18} /></div>
        </div>
      </div>
    </section>
  );
}
