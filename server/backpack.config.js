const WebpackBar = require('webpackbar')

module.exports = {
  webpack: (config) => {
    // Perform customizations to config
    // Important: return the modified config
    config.plugins.splice(1, 1) // remove the BannerPlugin
    config.module.rules.push(
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      }
    )
    config.plugins.push(new WebpackBar())
    return config
  }
}
