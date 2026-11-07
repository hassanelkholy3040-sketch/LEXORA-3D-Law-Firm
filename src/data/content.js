import {
  Building2,
  BriefcaseBusiness,
  House,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Compass,
  Handshake,
  Scale,
  BadgeCheck,
  SearchCheck,
  FileCheck2,
} from 'lucide-react';

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Practice Areas', href: '#practice-areas' },
  { label: 'Attorneys', href: '#attorneys' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
];

export const practiceAreas = [
  {
    number: '01',
    title: 'Corporate Law',
    description: 'Strategic legal guidance for businesses, transactions, and corporate governance.',
    icon: Building2,
  },
  {
    number: '02',
    title: 'Commercial Litigation',
    description: 'Effective representation in complex commercial disputes and negotiations.',
    icon: BriefcaseBusiness,
  },
  {
    number: '03',
    title: 'Real Estate Law',
    description: 'Comprehensive counsel for property transactions, development, and real estate matters.',
    icon: House,
  },
  {
    number: '04',
    title: 'Criminal Defense',
    description: 'Dedicated legal representation focused on protecting individual rights.',
    icon: ShieldCheck,
  },
  {
    number: '05',
    title: 'Family Law',
    description: 'Thoughtful legal guidance through sensitive family-related matters.',
    icon: HeartHandshake,
  },
  {
    number: '06',
    title: 'Intellectual Property',
    description: 'Protecting creative assets, trademarks, and valuable intellectual property.',
    icon: Lightbulb,
  },
];

export const attorneys = [
  {
    name: 'Julian Mercer',
    role: 'Managing Partner',
    experience: '22 years of experience',
    focus: 'Corporate & Commercial Law',
    portrait: '/assets/attorney-julian.svg',
    alt: 'Illustrated portrait of fictional attorney Julian Mercer',
  },
  {
    name: 'Amara Bennett',
    role: 'Senior Counsel',
    experience: '16 years of experience',
    focus: 'Litigation & Dispute Resolution',
    portrait: '/assets/attorney-amara.svg',
    alt: 'Illustrated portrait of fictional attorney Amara Bennett',
  },
  {
    name: 'Sofia Laurent',
    role: 'Partner',
    experience: '14 years of experience',
    focus: 'Private Client & Real Estate',
    portrait: '/assets/attorney-sofia.svg',
    alt: 'Illustrated portrait of fictional attorney Sofia Laurent',
  },
];

export const reasons = [
  {
    number: '01',
    title: 'Proven Expertise',
    description: 'Deep legal knowledge paired with the judgment to see beyond the immediate question.',
    icon: BadgeCheck,
  },
  {
    number: '02',
    title: 'Client-First Approach',
    description: 'Clear communication and close collaboration at every stage of your matter.',
    icon: HeartHandshake,
  },
  {
    number: '03',
    title: 'Strategic Thinking',
    description: 'Careful analysis shaped around your goals, your context, and the path ahead.',
    icon: Compass,
  },
  {
    number: '04',
    title: 'Professional Integrity',
    description: 'Steady, principled counsel grounded in discretion, candor, and respect.',
    icon: Handshake,
  },
];

export const processSteps = [
  { number: '01', title: 'Initial Consultation', description: 'A focused conversation about your concerns and priorities.', icon: SearchCheck },
  { number: '02', title: 'Case Assessment', description: 'We review the facts, identify key issues, and clarify your options.', icon: Scale },
  { number: '03', title: 'Legal Strategy', description: 'A considered plan shaped around your aims and circumstances.', icon: Compass },
  { number: '04', title: 'Representation', description: 'Experienced advocacy with clear updates throughout the matter.', icon: FileCheck2 },
  { number: '05', title: 'Resolution', description: 'We work toward a thoughtful and practical outcome.', icon: BadgeCheck },
];

export const testimonials = [
  {
    quote: 'The team brought clarity to a complicated transaction. We always understood the options and the reasons behind each recommendation.',
    name: 'Eleanor W.',
    category: 'Business client',
  },
  {
    quote: 'Thoughtful, direct, and deeply prepared. I felt supported through a difficult process and confident in every decision.',
    name: 'Marcus R.',
    category: 'Private client',
  },
  {
    quote: 'LEXORA understood the commercial realities as well as the legal detail. Their steady advice helped us move forward with confidence.',
    name: 'Priya S.',
    category: 'Corporate client',
  },
];
