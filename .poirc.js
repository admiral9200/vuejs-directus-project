const webpack = require('webpack')
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  presets: [require('poi-preset-eslint')({ mode: '*' })],
  webpack(config) {
    config.plugins.push(
      new StylelintPlugin({
        files: ['./src/**/*.{vue,css,scss,sass,less}']
      }),
      new webpack.ProvidePlugin({
        'window.Quill': 'quill'
      })
    )
    return config
  }
}
