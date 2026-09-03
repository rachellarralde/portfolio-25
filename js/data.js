// Portfolio content. Voice: the machine reporting — lowercase body, uppercase labels.

export const owner = {
  name: 'rachel larralde',
  handle: 'rachel',
  host: 'rachell.dev',
  email: 'rachellarralde@gmail.com',
  banner: 'RACHELL',
};

export const roles = [
  'software development engineer in test',
  'fullstack developer',
  'context ai engineer',
];

export const about = [
  'i am many things: <span class="hl">software development engineer in test</span>, <span class="hl">fullstack developer</span>, and <span class="hl">context ai engineer</span>.',
  'i engineer resilient full-stack systems and intelligent automation frameworks. the focus: merging rigorous software quality standards with current ai tooling to build scalable, future-proof applications.',
];

export const projects = [
  {
    id: 'arcade',
    title: 'ARCADE',
    category: 'audio sampler plug-in · output',
    tags: ['audio'],
    description: 'a sampler plug-in for audio production.',
    imageUrl: '/assets/arcade.png',
    liveUrl: 'https://output.com/arcade',
  },
  {
    id: 'flicked',
    title: 'GET FLICKED',
    category: 'ios app',
    tags: ['ios'],
    description: 'a movies and tv show recommendation engine.',
    imageUrl: '/assets/optimized/flicked.webp',
    liveUrl: 'https://getflicked.app',
    featured: true,
  },
  {
    id: 'resume-match',
    title: 'RESUME MATCH',
    category: 'ai powered web app',
    tags: ['ai', 'web'],
    description: 'ai-powered resume analysis and optimization tool.',
    imageUrl: '/assets/resume-match-dashboard.png',
    liveUrl: 'https://www.resumematch.online',
    featured: true,
  },
  {
    id: 'witchaudio',
    title: 'WITCH@UDIO',
    category: 'web development',
    tags: ['web'],
    description: 'stylish and interactive portfolio website.',
    imageUrl: '/assets/optimized/witchaudio.webp',
    liveUrl: 'https://witchaudio.me/',
  },
  {
    id: 'co-producer',
    title: 'CO-PRODUCER',
    category: 'ai powered plug-in · output',
    tags: ['audio', 'ai'],
    description: 'an ai-powered plug-in for audio production.',
    imageUrl: '/assets/copro.png',
    liveUrl: 'https://output.com/products/co-producer',
  },
  {
    id: 'missing-brontosaurus',
    title: 'MISSING BRONTOSAURUS',
    category: 'web development',
    tags: ['web'],
    description: 'a fully responsive music label landing page.',
    imageUrl: '/assets/optimized/missing-brontosaurus.webp',
    liveUrl: 'https://missingbrontosaur.us',
    featured: true,
  },
];

export const filters = [
  { id: 'all', label: 'all' },
  { id: 'web', label: 'web' },
  { id: 'ios', label: 'ios' },
  { id: 'audio', label: 'audio' },
  { id: 'ai', label: 'ai' },
];

export const skills = [
  { id: 'languages', name: 'languages', tags: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL (PostgreSQL)', 'HTML5', 'CSS3/SASS', 'Markdown'] },
  { id: 'frameworks', name: 'frameworks & libraries', tags: ['React', 'Next.js', 'Node.js', 'Express', 'Flask', 'FastAPI', 'Material-UI', 'TailwindCSS'] },
  { id: 'automation', name: 'automation & testing', tags: ['Playwright', 'Cypress', 'Postman', 'Pytest', 'GitHub Actions', 'Jenkins', 'CircleCI', 'BrowserStack', 'Selenium', 'TestNG', 'Appium', 'Sauce Labs', 'Rest Assured', 'Cucumber', 'Jasmine', 'Protractor', 'TDD / BDD', 'Agile Management'] },
  { id: 'devops', name: 'devops & cloud', tags: ['Docker', 'AWS', 'GCP', 'Firebase', 'Netlify', 'Vercel', 'CI/CD Pipelines', 'MockServer'] },
  { id: 'tools', name: 'developer tools', tags: ['Git / GitHub', 'VS Code', 'Webpack / Babel', 'npm / yarn', 'Chrome DevTools', 'Notion', 'Claude Code', 'Gemini CLI', 'GPT-Codex', 'Cursor', 'N8N', 'AI/ML Automation'] },
  { id: 'design', name: 'design tools', tags: ['Figma', 'Adobe Suite', 'Sketch', 'Framer', 'Adobe Experience Manager', 'CMS'] },
];

export const sections = [
  { id: 'hero', label: 'home', n: 1 },
  { id: 'work', label: 'work', n: 2 },
  { id: 'about', label: 'about', n: 3 },
  { id: 'contact', label: 'contact', n: 4 },
];
