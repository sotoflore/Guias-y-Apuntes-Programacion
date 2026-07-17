import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import mermaid from 'rspress-plugin-mermaid';
import { pluginPWA } from 'rsbuild-plugin-pwa';

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    plugins: [
        mermaid({
            mermaidConfig: {
                theme: 'default',
            },
        }),
    ],
    lang: 'es',
    title: 'DevNotes',
    description: 'Apuntes y guías para desarrolladores web. Tu centro de aprendizaje y referencia rápida para React, TypeScript, Node.js y más.',
    icon: '/mask-icon.svg',
    globalStyles: path.join(__dirname, 'docs/custom.css'),
    logo: {
        light: '/logo-app.svg',
        dark: '/logo-app.svg',
    },
    head: [
        ['meta', { name: 'theme-color', content: '#e11d48' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
        ['meta', { name: 'apple-mobile-web-app-title', content: 'DevNotes' }],
        ['meta', { name: 'msapplication-TileColor', content: '#e11d48' }],
        ['meta', { name: 'msapplication-tap-highlight', content: 'no' }],
        ['meta', { name: 'application-name', content: 'DevNotes' }],
        ['meta', { name: 'subject', content: 'Apuntes y guías para desarrolladores web' }],
        ['meta', { name: 'author', content: 'DevNotes' }],
        ['meta', { name: 'keywords', content: 'desarrollo web, React, TypeScript, Node.js, JavaScript, guías, tutoriales' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'DevNotes' }],
        ['meta', { property: 'og:description', content: 'Apuntes y guías para desarrolladores web. Tu centro de aprendizaje y referencia rápida para React, TypeScript, Node.js y más.' }],
        ['meta', { property: 'og:site_name', content: 'DevNotes' }],
        ['meta', { property: 'og:locale', content: 'es_ES' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: 'DevNotes' }],
        ['meta', { name: 'twitter:description', content: 'Apuntes y guías para desarrolladores web. Tu centro de aprendizaje y referencia rápida para React, TypeScript, Node.js y más.' }],
        ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
        ['link', { rel: 'mask-icon', href: '/mask-icon.svg', color: '#e11d48' }],
    ],
    themeConfig: {
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content: 'https://github.com/web-infra-dev/rspress',
            },
        ],
    },
    builderConfig: {
        plugins: [
            pluginPWA({
                dev: false,
                registerSw: {
                    type: 'script',
                },
                webAppManifest: {
                    content: {
                        name: 'DevNotes',
                        short_name: 'DevNotes',
                        description: 'Apuntes y guías para desarrolladores web. Tu centro de aprendizaje y referencia rápida para React, TypeScript, Node.js y más.',
                        start_url: '/',
                        scope: '/',
                        display: 'standalone',
                        orientation: 'portrait-primary',
                        theme_color: '#28020a',
                        background_color: '#ffffff',
                        lang: 'es',
                        categories: ['education', 'developer tools'],
                        icons: [
                            {
                                src: '/pwa-192x192.svg',
                                sizes: '192x192',
                                type: 'image/svg+xml',
                            },
                            {
                                src: '/pwa-512x512.svg',
                                sizes: '512x512',
                                type: 'image/svg+xml',
                            },
                            {
                                src: '/pwa-maskable-512x512.svg',
                                sizes: '512x512',
                                type: 'image/svg+xml',
                                purpose: 'maskable',
                            },
                        ],
                        shortcuts: [
                            {
                                name: 'Introducción',
                                short_name: 'Intro',
                                url: '/guide/start/introduction',
                                description: 'Guía de introducción a DevNotes',
                            },
                            {
                                name: 'React',
                                short_name: 'React',
                                url: '/guide/start/introduction',
                                description: 'Guías de React',
                            },
                        ],
                    },
                },
                sw: {
                    mode: 'generateSw',
                    filename: 'sw.js',
                    includeWebAppManifestIcons: true,
                    workboxOptions: {
                        clientsClaim: true,
                        skipWaiting: true,
                        runtimeCaching: [
                            {
                                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                                handler: 'CacheFirst',
                                options: {
                                    cacheName: 'google-fonts-cache',
                                    expiration: {
                                        maxEntries: 10,
                                        maxAgeSeconds: 60 * 60 * 24 * 365,
                                    },
                                    cacheableResponse: {
                                        statuses: [0, 200],
                                    },
                                },
                            },
                            {
                                urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
                                handler: 'StaleWhileRevalidate',
                                options: {
                                    cacheName: 'images-cache',
                                    expiration: {
                                        maxEntries: 60,
                                        maxAgeSeconds: 60 * 60 * 24 * 30,
                                    },
                                },
                            },
                            {
                                urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
                                handler: 'CacheFirst',
                                options: {
                                    cacheName: 'fonts-cache',
                                    expiration: {
                                        maxEntries: 10,
                                        maxAgeSeconds: 60 * 60 * 24 * 365,
                                    },
                                },
                            },
                            {
                                urlPattern: /\/api\/.*/i,
                                handler: 'NetworkFirst',
                                options: {
                                    cacheName: 'api-cache',
                                    expiration: {
                                        maxEntries: 50,
                                        maxAgeSeconds: 60 * 60 * 24,
                                    },
                                    cacheableResponse: {
                                        statuses: [0, 200],
                                    },
                                },
                            },
                        ],
                    },
                },
            }),
        ],
    },
});
