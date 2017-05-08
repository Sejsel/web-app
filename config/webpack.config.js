const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// load variables from .env
require('dotenv').config();

// fix Widnows 10 Ubuntu issues with less loader:
try {
  require('os').networkInterfaces();
} catch (e) {
  require('os').networkInterfaces = () => ({});
}

const extractCss = new ExtractTextPlugin('style.css');

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : 'none',
  entry: {
    recodex: path.join(__dirname, '..', 'src/client.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '..', 'public'),
    publicPath: '/',
    chunkFilename: 'chunk.[id].[chunkhash:8].js'
  },
  resolve: {
    alias: {
      moment: 'moment/moment.js'
    }
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loader: extractCss.extract(['css-loader'])
      },
      {
        test: /\.less$/,
        loader: extractCss.extract(['css-loader?modules', 'less-loader'])
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: ['file-loader']
      }
    ]
  },
  plugins: [
    extractCss,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '\'' + process.env.NODE_ENV + '\'',
        API_BASE: '\'' + process.env.API_BASE + '\''
      }
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks(module, count) {
        var context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),

    // catch all - anything used in more than one place
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      async: true,
      minChunks(module, count) {
        return count >= 2;
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'editor',
      async: true,
      minChunks(module, count) {
        var context = module.context;
        var targets = ['react-ace', 'brace'];
        return (
          context &&
          context.indexOf('node_modules') >= 0 &&
          targets.find(t => context.indexOf(t) >= 0)
        );
      }
    })
  ]
};
