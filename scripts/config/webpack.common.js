const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { isDev, PROJECT_PATH, IS_OPEN_HARD_SOURCE } = require('../constants')
const CompressionPlugin = require('compression-webpack-plugin')
const { WebpackCleanUndependentFilesPlugin } = require("../clean");

const getCssLoaders = (importLoaders, useModule) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: useModule ? {
        localIdentName: '[name]__[local]__[hash:base64:5]'
      }: false,
      sourceMap: isDev,
      importLoaders
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        // 修复一些和 flex 布局相关的 bug
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            grid: true,
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        require('postcss-normalize')
      ],
      sourceMap: isDev
    }
  }
]

module.exports = {
  entry: {
    app: resolve(PROJECT_PATH, './src/index.tsx')
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    path: resolve(PROJECT_PATH, './dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      'Src': resolve(PROJECT_PATH, './src'),
      'Api': resolve(PROJECT_PATH, './src/services/api'),
      'Image': resolve(PROJECT_PATH, './src/assets/image'),
      'Components': resolve(PROJECT_PATH, './src/components'),
      'Utils': resolve(PROJECT_PATH, './src/util')
    }
  },
  module: {
    rules: [
       {
        test: /\.md$/,
        use: "raw-loader"
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules|antd\.css/,
        use: getCssLoaders(1, true)
      },
      {
        test: /\.css$/,
        include: /node_modules|antd\.css/,
        use: getCssLoaders(2, false)
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(3, true),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(3, true),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/images'
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts'
            }
          }
        ]
      },
      {
        test: /node_modules[\/\\]@?reactflow[\/\\].*.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/
    }),
    new HtmlWebpackPlugin({
      template: process.env.NODE_ENV === 'development' ? resolve(PROJECT_PATH, './scripts/index-dev.html') : resolve(PROJECT_PATH, './scripts/index.html'),
      filename: 'index.html',
      cache: false,
      minify: isDev ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        useShortDoctype: true
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(PROJECT_PATH, './public'),
          from: '**/*',
          to: resolve(PROJECT_PATH, './dist'),
          toType: 'dir'
        }
      ]
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16'
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(PROJECT_PATH, './tsconfig.json')
      }
    }),
    IS_OPEN_HARD_SOURCE && new HardSourceWebpackPlugin(),
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false
    }),
    new WebpackCleanUndependentFilesPlugin({ autoDelete: false, outputLogs: false })
  ].filter(Boolean),
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },
  optimization: {
    minimize: !isDev,
    minimizer: [
      !isDev && new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] }
        }
      }),
      !isDev && new OptimizeCssAssetsPlugin()
    ].filter(Boolean),
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      maxInitialRequests: 6,
      maxAsyncRequests: 6,
      cacheGroups: {
        antd: {
          name: 'antd',
          test: (module) => {
              return /(antd|@ant-design)/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        moment: {
          name: 'moment',
          test: (module) => {
              return /moment/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        sentry: {
          name: 'sentry',
          test: (module) => {
              return /sentry/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        react: {
          name: 'react',
          test: (module) => {
            return /react|redux|prop-types|react-dom|react-dnd|rc-.*/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
          priority: 0,
        }
      }
    }
  }
}
