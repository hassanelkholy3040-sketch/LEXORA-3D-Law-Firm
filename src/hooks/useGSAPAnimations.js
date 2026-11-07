import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sectionOptions = (trigger) => ({
  trigger,
  start: 'top 78%',
  once: true,
});

export function useGSAPAnimations(scopeRef, reducedMotion) {
  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return undefined;

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('[data-reveal], [data-stagger] > *, .hero__copy > *, .section-heading h2, .about-art, .contact-form, .attorney-card__portrait', {
          autoAlpha: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          clipPath: 'inset(0 0 0 0)',
          clearProps: 'transform,filter',
        });
        gsap.set('.section-heading h2 em', { backgroundSize: '100% 1px' });
        gsap.utils.toArray('.stat__number', root).forEach((element) => {
          element.textContent = `${element.dataset.counterValue}${element.dataset.counterSuffix}`;
        });
        gsap.set('.scroll-progress__fill', { scaleX: 0 });
        return;
      }

      const sectionTimeline = (selector) => {
        const trigger = root.querySelector(selector);
        if (!trigger) return null;
        const timeline = gsap.timeline({ scrollTrigger: sectionOptions(trigger) });
        timeline.to(trigger, { '--ambient-opacity': 0.78, duration: 1.2, ease: 'power2.out' }, 0);
        return timeline;
      };

      const revealHeading = (timeline, selector, position = 0) => {
        if (!timeline) return;
        timeline
          .fromTo(`${selector} .section-heading .eyebrow`,
            { x: -18, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.58, ease: 'power2.out' }, position)
          .fromTo(`${selector} .section-heading h2`,
            { y: 28, clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 },
            { y: 0, clipPath: 'inset(0 0 0 0)', autoAlpha: 1, duration: 1.05, ease: 'power4.out' }, `${position}+=0.08`);
        timeline.fromTo(`${selector} .section-heading h2 em`,
          { backgroundSize: '0% 1px' },
          { backgroundSize: '100% 1px', duration: 1.05, ease: 'power2.out' }, `${position}+=0.2`);
      };

      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });
      heroTimeline
        .fromTo('.hero__eyebrow', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
        .fromTo('.hero__title > span', { y: 35, clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 }, { y: 0, clipPath: 'inset(0 0 0 0)', autoAlpha: 1, duration: 0.9, stagger: 0.12 }, '-=0.28')
        .fromTo('.hero__description', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72 }, '-=0.3')
        .fromTo('.hero__actions', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 }, '-=0.32')
        .fromTo('.hero__assurance', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.58 }, '-=0.28')
        .fromTo('.hero__visual-halo', { scale: 0.82, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.3, ease: 'power2.out' }, '-=0.9')
        .fromTo('.hero__visual-caption, .hero__vertical-note', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, '-=0.55');

      const progress = root.querySelector('.scroll-progress__fill');
      if (progress) {
        gsap.fromTo(progress, { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.35 },
        });
      }

      const about = sectionTimeline('.about');
      revealHeading(about, '.about');
      if (about) {
        about
          .fromTo('.about__description, .about__main > .text-link', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.12, ease: 'power2.out' }, '-=0.45')
          .fromTo('.about-art', { x: 32, rotateY: -8, clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 }, { x: 0, rotateY: 0, clipPath: 'inset(0 0 0 0)', autoAlpha: 1, duration: 1.15, ease: 'power3.out' }, '-=0.68')
          .fromTo('.about-art__stamp', { x: 20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5 }, '-=0.25')
          .fromTo('.stat', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.35');

        const counters = gsap.utils.toArray('.stat__number', root);
        counters.forEach((element, index) => {
          const counter = { value: 0 };
          about.to(counter, {
            value: Number(element.dataset.counterValue),
            duration: 1.25,
            ease: 'power2.out',
            snap: { value: 1 },
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value)}${element.dataset.counterSuffix}`;
            },
          }, index === 0 ? '<' : '<0.08');
        });
      }

      const practice = sectionTimeline('.practice');
      revealHeading(practice, '.practice');
      if (practice) {
        practice
          .fromTo('.practice__side-note', { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
          .fromTo('.practice-card__surface',
            { y: 68, rotateX: -9, transformPerspective: 950, transformOrigin: '50% 100%', autoAlpha: 0 },
            { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.82, stagger: 0.11, ease: 'power3.out' }, '-=0.25');
      }

      const attorneys = sectionTimeline('.attorneys');
      revealHeading(attorneys, '.attorneys');
      if (attorneys) {
        attorneys
          .fromTo('.attorneys__fiction-label', { x: 22, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6 }, '-=0.48')
          .fromTo('.attorney-card__portrait', { clipPath: 'inset(100% 0 0 0)', autoAlpha: 0 }, { clipPath: 'inset(0 0 0 0)', autoAlpha: 1, duration: 0.95, stagger: 0.14, ease: 'power3.inOut' }, '-=0.25')
          .fromTo('.attorney-card__meta, .attorney-card__focus', { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out' }, '-=0.55');
      }

      const why = sectionTimeline('.why');
      revealHeading(why, '.why');
      if (why) {
        why
          .fromTo('.why__intro .section-heading__description, .why__signature', { x: -28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.14, ease: 'power2.out' }, '-=0.48')
          .fromTo('.why-feature', { x: 44, y: 12, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.12, ease: 'power3.out' }, '-=0.28');
      }

      const process = sectionTimeline('.process');
      revealHeading(process, '.process');
      if (process) {
        process.fromTo('.process-step',
          { y: 36, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.35');
        process.fromTo('.process-step__marker',
          { scale: 0.7, rotate: -12 },
          { scale: 1, rotate: 0, duration: 0.58, stagger: 0.12, ease: 'back.out(1.4)' }, '<');
      }

      const insights = sectionTimeline('.testimonials');
      revealHeading(insights, '.testimonials');
      if (insights) {
        insights
          .fromTo('.testimonials__demo-note', { x: 25, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6 }, '-=0.48')
          .fromTo('.testimonial-card',
            { x: (index) => index === 1 ? 0 : (index === 0 ? -42 : 42), y: 28, rotateY: (index) => index === 0 ? -5 : 5, transformPerspective: 1000, autoAlpha: 0 },
            { x: 0, y: 0, rotateY: 0, autoAlpha: 1, duration: 0.86, stagger: 0.14, ease: 'power3.out' }, '-=0.25');
      }

      const contact = sectionTimeline('.contact');
      revealHeading(contact, '.contact');
      if (contact) {
        contact
          .fromTo('.contact__content .section-heading__description, .contact-details, .contact__note', { x: -26, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.68, stagger: 0.12, ease: 'power2.out' }, '-=0.48')
          .fromTo('.contact-form', { x: 28, clipPath: 'inset(0 0 0 100%)', autoAlpha: 0 }, { x: 0, clipPath: 'inset(0 0 0 0)', autoAlpha: 1, duration: 1.05, ease: 'power3.inOut' }, '-=0.6')
          .fromTo('.contact-form__heading, .contact-form .form-field, .contact-form__submit, .contact-form__demo', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '-=0.4');
      }

      const footer = sectionTimeline('.site-footer');
      if (footer) {
        footer.fromTo('.footer-intro, .footer-column', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' }, 0.1);
      }

    }, root);

    return () => context.revert();
  }, [reducedMotion, scopeRef]);
}
