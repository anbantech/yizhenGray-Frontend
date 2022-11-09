const { resolve } = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const common = require('./webpack.common.js')
const { PROJECT_PATH, shouldOpenAnalyzer } = require('../constants')
const SentryPlugin = require("@sentry/webpack-plugin");
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
    //   whitelist: ['html', 'body']
    // }),
    // new webpack.BannerPlugin({
    //   raw: true,
    //   banner: '/** @preserve Powered by react-ts-quick-starter (https://github.com/vortesnail/react-ts-quick-starter) */',
    // }),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(gitRevisionPlugin.version()),
      'process.env.COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
      'process.env.BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    // new SentryPlugin({
    //   ignoreFile: '.gitignore',
    //   include: './dist',
    //   configFile: 'sentry.properties',
    //   release: process.env.COMMITHASH,
    //   urlPrefix: '~/'
    // }),
    shouldOpenAnalyzer && new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
    }),
  ].filter(Boolean),
})
