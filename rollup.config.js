import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
//import { terser } from '@rollup/plugin-terser'; // Import the terser plugin
import terser from '@rollup/plugin-terser'

const extensions = ['.js', '.jsx'];

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
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  },
  // CJS Configurations
  {
    input: 'src/quikchat.js',
    output: [
      {
        file: 'dist/quikchat.cjs.js', // Unminified CJS build
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/quikchat.cjs.min.js', // Minified CJS build
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()], // Apply terser only to this output
      }
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
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
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      })
    ]
  }
];
