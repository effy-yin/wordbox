
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {        
    path: path.resolve(__dirname, 'dist'),
    filename: 'wordbox.js',
    library: 'dodoroy',
    libraryTarget: 'umd'
  },
  externals: {
    jquery: {
      commonjs: 'jQuery',
      commonjs2: 'jQuery',
      amd: 'jQuery',
      root: '$'
    }
  },
  module: {
    rules: [{            
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,// style-loader creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader' // compiles Sass to CSS, using Node Sass by default
      ]
    }, {
      enforce: 'pre',
      test: /\.js$/,                 
      exclude: /(node_modules)/,
      loader: 'eslint-loader'
    }, {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.out st
      // both options are optional
      filename: 'wordbox.css',
      chunkFilename: '[id].css'
    }),
  ]
}

module.exports = config
