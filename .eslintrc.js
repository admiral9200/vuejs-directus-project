const poi = require('poi')
const poiConfig = require('./.poirc.js')
const poiApp = poi(poiConfig)
const webpackConfig = poiApp.createWebpackConfig()

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended'
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: webpackConfig
      }
    }
  },
  rules: {
    'promise/catch-or-return': 0,
    'promise/avoid-new': 0,
    'arrow-parens': 0,
    'capitalized-comments': 0,
    'no-var': 2,
    'no-new': 0,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-unused-vars': [2, { vars: 'all', args: 'none' }],
    'vue/max-attributes-per-line': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'always',
        prev: '*',
        next: ['import', 'export', 'block', 'block-like', 'if', 'const', 'let']
      },
      {
        blankLine: 'always',
        prev: ['import', 'export', 'block', 'block-like', 'if', 'const', 'let'],
        next: '*'
      },
      {
        blankLine: 'never',
        prev: ['import', 'export', 'const', 'let'],
        next: ['import', 'export', 'const', 'let']
      }
    ]
  }
}
