export const DEMO_USER = {
  email: 'demo@example.com',
  password: 'secretPassword',
  maxPages: 10,
  protectedPageSlugs: new Set(['welcome-to-notes-manager', 'getting-started']),
} as const
