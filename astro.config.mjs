// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
//import { ChemicalVitePlugin } from 'chemicaljs';

// https://astro.build/config
export default defineConfig({
  //  vite: {
  //    plugins: [ChemicalVitePlugin({})]
  //  }
  output: 'hybrid',

  adapter: netlify({
    edgeMiddleware: true
  }),
});