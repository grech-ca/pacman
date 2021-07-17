const esbuild = require('esbuild');

const { derver } = require('derver');

const DEV = process.argv.includes('--dev');
const PORT = 3000;
const HOST = 'localhost';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'public/build/bundle.js',
    bundle: true,
    minify: !DEV,
    incremental: DEV,
    sourcemap: DEV,
  })
  .then(bundle => {
    DEV && derver({
      dir: 'public',
      host: HOST,
      port: PORT,
      watch: ['public', 'src'],
      onwatch: async (lr, item) => {
        if (item === 'src') {
          lr.prevent();
          bundle.rebuild().catch(err => lr.error(err.message, 'Compile error'));
        }
      },
    });
  })
  .catch(() => process.exit(1));
