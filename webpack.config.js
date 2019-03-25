const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const publicPath = path.join(__dirname, 'public')
const distPath = path.join(publicPath, 'dist')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    path.join(publicPath, 'app.ts')
  ],
  output: {
    path: distPath,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
   module: {
    rules: [{
      test: /.tsx?$/,
      include: [
        publicPath
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      use: [
        {
          loader: 'babel-loader',
        },
        { loader: 'ts-loader' },
      ]
    }, {
      test: /.styl$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'stylus-loader' },
      ]
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name(file) {
              if (!isProduction) {
                return '[path][name].[ext]'
              }

              return '[path][hash].[ext]'
            },
          },
        },
      ]
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Cycle.js is awesome!',
      template: path.join(__dirname, 'template/index.html'),
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devtool: isProduction ? 'none' : 'source-map',
}

if (!isProduction) {
  config.entry.unshift('webpack-hot-middleware/client')
  config.plugins = (config.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ])
}

module.exports = config
