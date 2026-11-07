import { Quote } from 'lucide-react';
import { testimonials } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import { usePointerTilt } from '../../hooks/usePointerTilt.js';

function TestimonialCard({ testimonial, index }) {
  const tiltHandlers = usePointerTilt({ targetSelector: '.testimonial-card__surface', maxTilt: 1.8, lift: -3, perspective: 1000 });

  return (
    <figure className="testimonial-card" {...tiltHandlers}>
      <div className="testimonial-card__surface">
        <div className="testimonial-card__top"><Quote size={25} strokeWidth={1.2} aria-hidden="true" /><span>0{index + 1}</span></div>
        <blockquote>“{testimonial.quote}”</blockquote>
        <figcaption><span className="testimonial-card__client">{testimonial.name}</span><span>{testimonial.category}</span></figcaption>
      </div>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section className="section testimonials" id="insights" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="testimonials__intro">
          <SectionHeading eyebrow="Words of confidence" title={<>What Our Clients <em>Say</em></>} description="A few words about the experience of working together." id="testimonials-title" />
          <p className="testimonials__demo-note" data-reveal>Fictional sample testimonials</p>
        </div>
        <div className="testimonial-grid" data-stagger>
          {testimonials.map((testimonial, index) => <TestimonialCard testimonial={testimonial} index={index} key={testimonial.name} />)}
        </div>
      </div>
    </section>
  );
}
