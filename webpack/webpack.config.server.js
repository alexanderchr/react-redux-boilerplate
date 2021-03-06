var webpack = require('webpack')
var path = require('path')
var fs = require('fs');

var cssNext = require('postcss-cssnext');
var modulesValues = require('postcss-modules-values');

var nodeModules = {};
fs.readdirSync(prependRoot('node_modules'))
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  target: 'node',
  node: {
    __dirname: '.',
    __filename: false
  },
  entry: [
    'webpack/hot/signal',
    'babel-polyfill',
    'server'
  ],
  output: {
    filename: '[name].js',
    path: prependRoot('build/server'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [prependRoot('node_modules'), prependRoot('src')],
  },
  externals: nodeModules,
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: prependRoot('src'),
        exclude: [/node_modules/],
      },

      {
        test: /\.css$/,
        loaders: [
          'isomorphic-style',
          {
            loader: 'css',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]---[local]---[hash:base64:5]',
            },
          },
          'postcss',
        ],
      },

      { test: /\.(eot|woff|woff2|ttf|svg)(\?[a-zA-Z0-9\.\=]*)?$/, loader: 'file-loader' },
    ]
  },
  postcss: function() {
    return [modulesValues, cssNext({ features: { customProperties: false } })];
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.NormalModuleReplacementPlugin(/\.s?css/, 'node-noop'),
  ]
};

function prependRoot(directory) {
  return path.resolve(__dirname, '..', directory)
}
