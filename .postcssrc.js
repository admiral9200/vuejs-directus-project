module.exports = {
  plugins: [
    require('postcss-import')({
      path: ['node_modules/', 'src/assets/css/']
    }),
    require('postcss-cssnext')(),
    require('postcss-nested')()
  ]
}
