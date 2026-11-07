import { ArrowUpRight, Instagram, Linkedin, MoveUpRight } from 'lucide-react';
import { navItems, practiceAreas } from '../../data/content.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-intro">
          <a className="brand brand--footer" href="#home" aria-label="LEXORA home">
            <span className="brand__mark" aria-hidden="true">L</span>
            <span className="brand__name">LEXORA<span>LAW FIRM</span></span>
          </a>
          <p>Thoughtful counsel for complex matters.<br />Principled representation, wherever the path leads.</p>
          <div className="footer-socials" aria-label="Social media">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div className="footer-column">
          <h3>Practice areas</h3>
          {practiceAreas.map((area) => <a key={area.title} href="#practice-areas">{area.title}</a>)}
          <a href="#practice-areas">View all expertise <ArrowUpRight size={13} /></a>
        </div>
        <div className="footer-column footer-contact">
          <h3>Get in touch</h3>
          <a href="mailto:contact@example.com">contact@example.com</a>
          <a href="tel:+10000000000">+1 000 000 0000</a>
          <span>Office address placeholder<br />New York, NY 00000</span>
          <a className="footer-contact__link" href="#contact">Start a conversation <MoveUpRight size={14} /></a>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} LEXORA. All rights reserved.</p>
        <p className="footer-disclaimer">Fictional demonstration website. No legal services are offered.</p>
        <a href="#home">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
