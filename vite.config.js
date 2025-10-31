import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isSell = mode === 'sell';
  return {
    plugins: [
      react(),
      AutoImport({
        imports: [util.unimportPreset],
      }),
      monkey({
        entry: 'src/main.jsx',
        userscript: {
          icon: 'https://vitejs.dev/logo.svg',
          namespace: isSell ? '' : pkg.homepage,
          homepage: isSell ? '' : pkg.homepage,
          homepageURL: isSell ? '' : pkg.homepage,
          match: ['https://music.163.com/**/*', 'https://y.music.163.com/*'],
          require: [
            // "https://cdn.jsdelivr.net/npm/antd@5.22.4/dist/reset.min.css",
            'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js',
          ],
          connect: ['music.163.com', 'interface.music.163.com'],
        },
        server: {
          open: false,
        },
        resolve: {
          alias: {
            '@/': path.resolve(__dirname, './src/'),
          },
        },
        build: {
          minify: isSell ? true : false,
          fileName: isSell ? 'cloudmusic-Sell.user.js' : 'cloudmusic.user.js',
          externalGlobals: [
            ['react', cdn.jsdelivr('React', 'umd/react.production.min.js')],
            [
              'react-dom',
              cdn.jsdelivr('ReactDOM', 'umd/react-dom.production.min.js'),
            ],
            ['antd', cdn.jsdelivr('antd', 'dist/antd.min.js')],
            [
              '@ant-design/icons',
              cdn.jsdelivr('icons', 'dist/index.umd.min.js'),
            ],
            ['node-forge', cdn.jsdelivr('forge', 'dist/forge.min.js')],
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: isSell ? './dist-sell' : './dist',
    },
  };
});
