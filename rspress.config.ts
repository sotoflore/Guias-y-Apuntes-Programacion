import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import mermaid from 'rspress-plugin-mermaid';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
    plugins: [
        mermaid({
            mermaidConfig: {
                theme: 'default',
            },
        }),
    ],
  lang: 'en',
  title: 'DevNotes',
  icon: '/rspress-icon.png',
  globalStyles: path.join(__dirname, 'docs/custom.css'),
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
});
