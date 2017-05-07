const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    bundle: path.join(__dirname, '..', 'src/client.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '..', 'public'),
    publicPath: 'http://localhost:8081/',
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'common.js'
    })
  ]
};
