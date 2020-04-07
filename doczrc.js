import { css } from 'docz-plugin-css';

export default {
  title: 'Kabi UI',
  description: 'Kabi UI is a React UI library. Easy to use.',
  src: './src',
  filterComponents: files =>
    files.filter(filepath => /src\/.*\/*\.(js|jsx|ts|tsx)$/.test(filepath)),
  codeSandbox: false,
  notUseSpecifiers: true,
  typescript: true,
  plugins: [
    css({ preprocessor: 'sass', cssmodules: true, test: /\.(scss|css)$/ }),
    css({ preprocessor: 'postcss' }),
  ],
  menu: [
    'Getting started',
    {
      name: 'Components',
      menu: ['Button', 'Input', 'Popover', 'Message', 'Switch'],
    },
  ],
};
