const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const WriteFilePlugin = require('write-file-webpack-plugin');

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
  module: {},
  plugins: [new WriteFilePlugin()],
  devServer: {
    contentBase: './',
    port: 9008
  }
});
