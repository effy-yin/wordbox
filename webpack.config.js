
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
    mode: 'production',
    entry: './src/index.js',
    devtool: 'source-map',
    output: {        
        path: path.resolve(__dirname, 'dist'),
        filename: 'wordbox.js',
        library: 'Effy',
        libraryTarget: 'umd'
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [{            
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,//'style-loader',
                'css-loader'
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
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'wordbox.css',
            chunkFilename: "[id].css"
          }),
    ]
};

module.exports = config;
