import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';

const fs = require('fs');
const path = require('path');
const componentDir = 'src/components';
const cModuleNames = fs.readdirSync(path.resolve(componentDir));
const cModuleMap = cModuleNames.reduce((prev, name) => {
  prev[name] = `${componentDir}/${name}/index.js`;
  return prev;
}, {});

const plugins = [
  external(),
  postcss(),
  url(),
  svgr(),
  babel({
    exclude: 'node_modules/**',
    plugins: ['@babel/plugin-external-helpers'],
  }),
  resolve(),
  commonjs(),
];

export default [
  {
    input: {
      index: 'src/index.js',
      ...cModuleMap,
    },
    output: [
      {
        dir: 'lib',
        entryFileNames: '[name]/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        dir: 'es',
        entryFileNames: '[name]/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins,
    experimentalCodeSplitting: true,
  },
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      file: 'umd/kabi.js',
      name: 'kabi',
    },
    plugins: [...plugins, replace({ 'process.env.NODE_ENV': '"development"' })],
  },
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      file: 'umd/kabi.min.js',
      name: 'kabi',
    },
    plugins: [...plugins, replace({ 'process.env.NODE_ENV': '"production"' }), uglify()],
  },
];
