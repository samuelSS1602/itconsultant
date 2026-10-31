// All site content lives here. Everything below is placeholder (fictional) data —
// replace it with real company details before going live.

export const company = {
  name: 'XYZ',
  legalName: 'XYZ Consulting Ltd.',
  email: 'hello@xyz-consulting.com',
  phone: '+1 (212) 555-0147',
  founded: 2012,
  // Free access key from https://web3forms.com. Contact-form messages and newsletter sign-ups are then
  // emailed to the address you registered there. While it's empty, the forms open the visitor's
  // email app instead, addressed to `email` above.
  formKey: '',
}

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'How we work', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Insights', href: '#insights' },
]

// lat/lon place each office on the hero globe.
export const offices = [
  { city: 'New York', country: 'United States', tz: 'America/New_York', lat: 40.71, lon: -74.01, address: '350 Hudson Street, Floor 9, New York, NY 10014' },
  { city: 'London', country: 'United Kingdom', tz: 'Europe/London', lat: 51.51, lon: -0.13, address: '21 Paul Street, Shoreditch, London EC2A 4JU' },
  { city: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', lat: 25.2, lon: 55.27, address: 'Office 1204, Bay Square 7, Business Bay, Dubai' },
  { city: 'Bengaluru', country: 'India', tz: 'Asia/Kolkata', lat: 12.97, lon: 77.59, address: '4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru 560103' },
  { city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', lat: 1.35, lon: 103.82, address: '8 Marina View, #23-01, Singapore 018960' },
  { city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', lat: -33.87, lon: 151.21, address: 'Level 14, 60 Martin Place, Sydney NSW 2000' },
]

export const capabilities = [
  'Cloud migration',
  'Custom software',
  'Data & AI',
  'Cybersecurity',
  'Digital strategy',
  'Managed IT',
  'ERP & CRM',
  'Mobile apps',
]

export const clients = [
  'Northwind Freight', 'Halden Bank', 'Medra Health', 'Solace Retail', 'Kestrel Energy',
  'Atlas Learning', 'Orbit Telecom', 'Vela Insurance', 'Pinecrest Foods', 'Marlow & Finch',
  'Lumen Motors', 'Quarry Labs',
]

export const services = [
  {
    id: 'cloud',
    name: 'Cloud & infrastructure',
    summary: 'Move to AWS, Azure or Google Cloud without downtime, and stop paying for servers you don’t use.',
    includes: ['Cloud readiness assessment', 'Migration planning and execution', 'Cost optimisation (FinOps)', 'Kubernetes and DevOps pipelines'],
    timeline: '6–20 weeks',
    from: 'From $18,000',
  },
  {
    id: 'software',
    name: 'Custom software',
    summary: 'Web platforms, internal tools and customer portals built around how your team actually works.',
    includes: ['Product discovery and UX design', 'Web and API development', 'Legacy system modernisation', 'Quality assurance and testing'],
    timeline: '8–24 weeks',
    from: 'From $25,000',
  },
  {
    id: 'data',
    name: 'Data & AI',
    summary: 'Bring scattered data into one place, then use it — dashboards, forecasts and practical AI assistants.',
    includes: ['Data warehouse and pipelines', 'Business intelligence dashboards', 'Machine learning models', 'AI assistants on your own documents'],
    timeline: '4–16 weeks',
    from: 'From $15,000',
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    summary: 'Find weak points before attackers do, and meet ISO 27001, SOC 2 and GDPR requirements.',
    includes: ['Security audits and penetration testing', 'Compliance readiness', 'Identity and access management', '24/7 threat monitoring'],
    timeline: '2–12 weeks',
    from: 'From $9,500',
  },
  {
    id: 'strategy',
    name: 'Digital strategy',
    summary: 'A clear, costed technology roadmap so every investment ties back to a business goal.',
    includes: ['Technology audit', 'Three-year roadmap', 'Vendor and platform selection', 'Budget and team planning'],
    timeline: '3–6 weeks',
    from: 'From $7,500',
  },
  {
    id: 'managed',
    name: 'Managed IT support',
    summary: 'One team that keeps your systems running, patched and backed up — with real people on call around the clock.',
    includes: ['24/7 help desk in 6 time zones', 'Monitoring and incident response', 'Backups and disaster recovery', 'Monthly health reports'],
    timeline: 'Ongoing',
    from: 'From $2,400 / month',
  },
]

export const industries = ['All', 'Finance', 'Healthcare', 'Logistics', 'Retail', 'Energy', 'Education']

export const caseStudies = [
  {
    id: 'northwind',
    client: 'Northwind Freight',
    industry: 'Logistics',
    region: 'Germany',
    title: 'Route planning that used to take a day now takes 20 minutes',
    metric: '63%',
    metricLabel: 'less planning time',
    motif: 'routes',
    color: '#2B4EFF',
    services: ['Custom software', 'Data & AI'],
    challenge: 'Dispatchers planned 1,800 daily deliveries in spreadsheets, re-entering data from three systems.',
    solution: 'We built a planning tool that pulls orders, fleet and traffic data together and suggests optimised routes dispatchers can adjust by drag and drop.',
    results: ['63% less planning time', '11% fewer kilometres driven', 'Rolled out to 14 depots in 5 months'],
  },
  {
    id: 'halden',
    client: 'Halden Bank',
    industry: 'Finance',
    region: 'Norway',
    title: 'Core banking moved to the cloud with zero minutes of downtime',
    metric: '0 min',
    metricLabel: 'downtime during migration',
    motif: 'bars',
    color: '#101B33',
    services: ['Cloud & infrastructure', 'Cybersecurity'],
    challenge: 'An ageing data centre lease was ending, and regulators required uninterrupted service for 400,000 customers.',
    solution: 'A phased migration to Azure with parallel running, automated rollback and a full security review signed off by the regulator.',
    results: ['Zero downtime across 9 cut-overs', '34% lower infrastructure cost', 'Passed regulatory audit first time'],
  },
  {
    id: 'medra',
    client: 'Medra Health',
    industry: 'Healthcare',
    region: 'United Kingdom',
    title: 'A patient portal used by 1.2 million people',
    metric: '1.2M',
    metricLabel: 'active patients',
    motif: 'pulse',
    color: '#0F7B6C',
    services: ['Custom software', 'Cybersecurity'],
    challenge: 'Patients called clinics to book, cancel or get results — 40,000 calls a week.',
    solution: 'An accessible web and mobile portal for bookings, results and secure messaging, connected to existing clinical systems.',
    results: ['52% fewer phone calls', 'WCAG 2.2 AA accessible', '4.8 / 5 average app rating'],
  },
  {
    id: 'solace',
    client: 'Solace Retail',
    industry: 'Retail',
    region: 'United Arab Emirates',
    title: 'One stock system for 90 stores and the online shop',
    metric: '+38%',
    metricLabel: 'online revenue',
    motif: 'grid',
    color: '#BE185D',
    services: ['ERP & CRM', 'Data & AI'],
    challenge: 'Store and online stock lived in separate systems, so customers ordered items that were already sold out.',
    solution: 'We unified inventory, orders and customer data on one platform and added click-and-collect across all stores.',
    results: ['+38% online revenue in year one', '97% stock accuracy', 'Click-and-collect in 90 stores'],
  },
  {
    id: 'kestrel',
    client: 'Kestrel Energy',
    industry: 'Energy',
    region: 'Australia',
    title: 'Live monitoring for 4,000 solar sites',
    metric: '4,000',
    metricLabel: 'sites monitored live',
    motif: 'rings',
    color: '#B45309',
    services: ['Data & AI', 'Managed IT'],
    challenge: 'Faults at remote solar farms were found days late, during scheduled visits.',
    solution: 'Sensors stream readings to a cloud platform that flags faults automatically and sends a technician with the right part.',
    results: ['Faults detected in minutes, not days', '21% fewer site visits', '99.97% platform uptime'],
  },
  {
    id: 'atlas',
    client: 'Atlas Learning',
    industry: 'Education',
    region: 'Singapore',
    title: 'An online classroom for 300,000 students in 12 countries',
    metric: '300k',
    metricLabel: 'students',
    motif: 'dots',
    color: '#6D28D9',
    services: ['Custom software', 'Cloud & infrastructure'],
    challenge: 'A fast-growing tutoring company had outgrown an off-the-shelf learning system that crashed during exams.',
    solution: 'A custom learning platform with live classes, assignments and progress reports, built to scale automatically at peak times.',
    results: ['No outages during exam season', 'Available in 7 languages', 'Teacher admin time down 30%'],
  },
]

export const steps = [
  { name: 'Discover', duration: '1–2 weeks', text: 'We meet your team, review your systems and agree on goals, budget and what success looks like.' },
  { name: 'Design', duration: '2–4 weeks', text: 'You get a plan, architecture and clickable prototypes to approve before any major build starts.' },
  { name: 'Build', duration: 'Two-week sprints', text: 'We deliver working software every two weeks. You see progress and give feedback as we go.' },
  { name: 'Run & improve', duration: 'Ongoing', text: 'We launch, train your people and stay on to monitor, support and keep improving.' },
]

export const stats = [
  { value: '420+', label: 'projects delivered' },
  { value: '32', label: 'countries served' },
  { value: '96%', label: 'clients who come back' },
  { value: '180', label: 'engineers and consultants' },
]

export const testimonials = [
  {
    quote: 'XYZ didn’t just build what we asked for. They questioned the brief, and the product is better because of it.',
    name: 'Lena Hoffmann',
    role: 'Head of Operations, Northwind Freight',
  },
  {
    quote: 'We moved our entire core platform without a single customer noticing. That was the whole point.',
    name: 'Erik Solberg',
    role: 'CTO, Halden Bank',
  },
  {
    quote: 'Clear weekly updates, honest about risks, and always on time. Working across time zones felt easy.',
    name: 'Aisha Rahman',
    role: 'Director of Digital, Solace Retail',
  },
]

export const team = [
  { name: 'Daniel Okafor', role: 'Founder & CEO', base: 'London' },
  { name: 'Priya Raman', role: 'Chief Technology Officer', base: 'Bengaluru' },
  { name: 'Marco Bellini', role: 'Head of Cloud', base: 'New York' },
  { name: 'Mei Lin Tan', role: 'Head of Data & AI', base: 'Singapore' },
]

// motif/color pick the artwork in the hover preview (same options as the case studies).
export const insights = [
  { title: 'How much does a cloud migration really cost?', topic: 'Cloud', minutes: 7, date: 'Oct 14, 2026', motif: 'rings', color: '#2B4EFF' },
  { title: 'Five questions to ask before you start an AI project', topic: 'Data & AI', minutes: 5, date: 'Sep 29, 2026', motif: 'dots', color: '#6D28D9' },
  { title: 'Replacing a legacy system without stopping the business', topic: 'Software', minutes: 9, date: 'Sep 8, 2026', motif: 'grid', color: '#0F7B6C' },
]

export const faqs = [
  { q: 'Do you work with companies outside your office countries?', a: 'Yes. We work with clients in 32 countries. Most projects run remotely, and we travel for workshops and launches when it helps.' },
  { q: 'How do you handle time zones?', a: 'Every client gets a lead who overlaps at least four hours with your working day, plus a shared project channel and a weekly video call.' },
  { q: 'How much does a project cost?', a: 'Most projects range from $15,000 to $250,000 depending on scope. After a free 30-minute call, we send a fixed-price or monthly estimate within five working days.' },
  { q: 'Will we own the code and data?', a: 'Yes. You own all code, designs and data we produce for you, from day one. We sign an NDA before any detailed conversation.' },
  { q: 'Can you take over a system another vendor built?', a: 'Often, yes. We start with a two-week technical review, then tell you plainly whether to keep, improve or replace it.' },
]
