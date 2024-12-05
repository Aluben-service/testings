// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import clerk from "@clerk/astro";

//import { ChemicalVitePlugin } from 'chemicaljs';

// https://astro.build/config
export default defineConfig({
  //  vite: {
  //    plugins: [ChemicalVitePlugin({})]
  //  }
  integrations: [clerk()],
  output: 'hybrid',

  adapter: netlify({
    edgeMiddleware: true,
    // @ts-ignore
    edgeFunctions: {
        // This will automatically include all files in src/pages/api
      experimental: {
        autoInclude: true
      }
    }
  }),
});