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
    id: 'yardflow',
    title: 'YARDFLOW',
    category: 'marketplace web app',
    tags: ['web', 'ai'],
    description: 'on-demand industrial yard space — a matching engine that connects tenants with qualified hosts.',
    imageUrl: '/assets/yardflow.png',
    liveUrl: 'https://getyardflow.com',
    featured: true,
  },
  {
    id: 'rachelnocode',
    title: 'RACHEL NOCODE',
    category: 'content platform · ai tooling',
    tags: ['web', 'ai'],
    description: 'templates, tiny tools, and vibe-coded builds paired with weekly ai tutorials.',
    imageUrl: '/assets/rachelnocode.png',
    liveUrl: 'https://rachelnocode.com',
    featured: true,
  },
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
  { id: 'languages', name: 'languages', tags: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Swift', 'SQL (PostgreSQL)', 'Bash / Zsh', 'Lua', 'HTML5', 'CSS3/SASS', 'Markdown'] },
  { id: 'ai', name: 'ai engineering', tags: ['Claude API', 'Claude Agent SDK', 'MCP (Model Context Protocol)', 'OpenAI API', 'Tool / function calling', 'Agent orchestration', 'RAG pipelines', 'Embeddings', 'Vector search (pgvector)', 'Prompt engineering', 'Context engineering', 'LLM evals', 'Streaming (SSE)', 'Structured outputs', 'LangChain', 'Hugging Face', 'Ollama (local models)', 'Whisper / speech-to-text'] },
  { id: 'frameworks', name: 'frameworks & libraries', tags: ['React', 'Next.js (App Router)', 'React Native', 'SwiftUI', 'Node.js', 'Express', 'FastAPI', 'Flask', 'Vite', 'TanStack Query', 'Zustand', 'TailwindCSS', 'shadcn/ui', 'Framer Motion', 'Material-UI'] },
  { id: 'backend', name: 'backend & data', tags: ['PostgreSQL', 'Supabase', 'Convex', 'Firebase / Firestore', 'Redis', 'MongoDB', 'SQLite', 'Prisma', 'Drizzle ORM', 'REST APIs', 'Webhooks', 'Auth (OAuth / JWT)', 'Stripe', 'Queues & background jobs'] },
  { id: 'automation', name: 'automation & testing', tags: ['Playwright', 'Cypress', 'Selenium', 'Appium', 'Pytest', 'Vitest / Jest', 'Postman', 'Rest Assured', 'Cucumber', 'TestNG', 'Jasmine', 'BrowserStack', 'Sauce Labs', 'MockServer', 'k6 load testing', 'Accessibility (axe / WCAG)', 'AI regression testing', 'TDD / BDD', 'Agile management'] },
  { id: 'devops', name: 'devops & cloud', tags: ['Docker', 'AWS (Lambda / S3)', 'GCP', 'Vercel', 'Netlify', 'Cloudflare Workers', 'Railway', 'GitHub Actions', 'Jenkins', 'CircleCI', 'CI/CD pipelines', 'Sentry / observability'] },
  { id: 'tools', name: 'developer tools', tags: ['Git / GitHub', 'Claude Code', 'Cursor', 'GPT-Codex', 'Gemini CLI', 'n8n', 'Zapier', 'VS Code', 'Neovim', 'Xcode', 'Chrome DevTools', 'Webpack / Babel', 'npm / pnpm', 'Notion'] },
  { id: 'design', name: 'design tools', tags: ['Figma', 'Framer', 'Sketch', 'Adobe Suite', 'Adobe Experience Manager', 'Design systems', 'CMS'] },
];

export const sections = [
  { id: 'hero', label: 'home', n: 1 },
  { id: 'work', label: 'work', n: 2 },
  { id: 'about', label: 'about', n: 3 },
  { id: 'contact', label: 'contact', n: 4 },
];
