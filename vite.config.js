import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import SvgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgLoader({
      defaultImport: 'component',
      svgoConfig: {
        plugins: [{
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              convertColors: {
                shorthex: false,
                currentColor: true,
              },
              addAttributesToSVGElement: {
                attributes: ['preserveAspectRatio="xMidYMid"'],
              },
            },
          },
        }],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @use "sass:list";
          @import "./src/app/styles/abstracts/_functions.scss";
          @import "./src/app/styles/abstracts/_variables.scss";
          @import "./src/app/styles/abstracts/_mixins.scss";
        `,
      },
    },
    devSourcemap: true,
  },
});
