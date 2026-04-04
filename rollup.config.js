import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
//import { terser } from '@rollup/plugin-terser'; // Import the terser plugin
import terser from '@rollup/plugin-terser'
import css from 'rollup-plugin-css-only'

const extensions = ['.js', '.jsx'];

const basePlugins = [
  resolve({ extensions }),
  commonjs(),
  babel({
    extensions,
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env']
  })
];

// Rollup configuration for the quikchat project
export default [
  // UMD Configurations
  {
    input: 'src/quikchat.js',
    output: [
      {
        file: 'dist/quikchat.umd.js', // Unminified UMD build
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat.umd.min.js', // Minified UMD build
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [...basePlugins]
  },
  // CJS Configurations
  {
    input: 'src/quikchat.js',
    output: [
      {
        file: 'dist/quikchat.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // ESM Configurations
  {
    input: 'src/quikchat.js',
    output: [
      {
        file: 'dist/quikchat.esm.js', // Unminified ESM build
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat.esm.min.js', // Minified ESM build
        format: 'es',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [...basePlugins]
  },
  // ===== quikchat-md builds (with quikdown bundled) =====
  // UMD
  {
    input: 'src/quikchat-md.js',
    output: [
      {
        file: 'dist/quikchat-md.umd.js',
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md.umd.min.js',
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // CJS
  {
    input: 'src/quikchat-md.js',
    output: [
      {
        file: 'dist/quikchat-md.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // ESM
  {
    input: 'src/quikchat-md.js',
    output: [
      {
        file: 'dist/quikchat-md.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md.esm.min.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // ===== quikchat-md-full builds (with quikdown edit — dynamic loading) =====
  // UMD
  {
    input: 'src/quikchat-md-full.js',
    output: [
      {
        file: 'dist/quikchat-md-full.umd.js',
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md-full.umd.min.js',
        format: 'umd',
        name: 'quikchat',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // CJS
  {
    input: 'src/quikchat-md-full.js',
    output: [
      {
        file: 'dist/quikchat-md-full.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md-full.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  },
  // ESM
  {
    input: 'src/quikchat-md-full.js',
    output: [
      {
        file: 'dist/quikchat-md-full.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat-md-full.esm.min.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      }
    ],
    plugins: [...basePlugins]
  }
];
