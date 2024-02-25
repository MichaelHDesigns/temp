const path = require('path');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(commonConfiguration, {
    stats: 'errors-warnings',
    mode: 'development',
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../static/hth_home.html'),
            favicon: path.resolve(__dirname, '../public/images/favicon.ico'),
            minify: false,
            filename: 'hth_home.html',
        }),
    ],
});
