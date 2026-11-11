import { defineConfig, type Plugin } from 'vite';
import { site } from './src/data/site.ts';
import { renderBody, renderHead } from './src/render/page.ts';

/** Renders all sections from src/data/site.ts into index.html at dev & build time,
 *  so the content (and the LCP headline) is in the HTML before any JS runs. */
function staticPage(): Plugin {
  return {
    name: 'uboc-static-page',
    // Content is rendered by the config itself, so edits to site.ts / render/* restart the dev server.
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (/[\\/]src[\\/](data|render)[\\/]/.test(file)) server.restart();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace('<!--head-->', renderHead(site)).replace('<!--app-->', renderBody(site)),
    },
  };
}

export default defineConfig({
  plugins: [staticPage()],
  server: { port: 5180 },
  preview: { port: 4180 },
  build: { target: 'es2020', cssCodeSplit: false },
});
