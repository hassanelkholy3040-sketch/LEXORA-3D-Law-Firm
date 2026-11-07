import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../../data/content.js';
import Button from '../ui/Button.jsx';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = navItems
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.3, 0.55] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1101px)');
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener('change', closeOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = drawerRef.current?.querySelector('a');
    firstLink?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && drawerRef.current) {
        const focusable = [...drawerRef.current.querySelectorAll('a[href], button:not([disabled])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    if (menuOpen) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    setMenuOpen(false);
  };

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <div className="nav-shell">
        <a className="brand" href="#home" aria-label="LEXORA home" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true">L</span>
          <span className="brand__name">LEXORA<span>LAW FIRM</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? 'is-active' : ''}
              aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button className="nav-cta" href="#contact" arrow={false}>Consultation</Button>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          ref={menuButtonRef}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div
        className={`mobile-drawer${menuOpen ? ' mobile-drawer--open' : ''}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        ref={drawerRef}
      >
        <nav aria-label="Mobile navigation">
          <span className="mobile-drawer__label">Navigate</span>
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={activeSection === item.href.slice(1) ? 'is-active' : ''}
              aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
            >
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
          <a className="mobile-drawer__contact" href="#contact" onClick={closeMenu}>Schedule a consultation <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
