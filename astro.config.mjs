import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://dabtech.me',
  vite: { define: { __DAB_ANALYTICS_PRODUCTION__: JSON.stringify(process.env.VERCEL_ENV === 'production' && process.env.PUBLIC_SIMPLE_ANALYTICS_ENABLED !== 'false' && process.env.DAB_EVIDENCE !== 'true' && process.env.NODE_ENV !== 'test') } },
  integrations: [react()],
  output: 'static',
});
