const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../origo/plugins`,
    publicPath: '/build/js',
    filename: 'oidc.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Oidc'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {},
  devServer: {
    contentBase: './',
    port: 9001
  }
});
