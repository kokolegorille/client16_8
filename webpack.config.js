const glob = require('glob');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');

const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

// For dev server
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR_LIBS = [
  'react', 'react-dom'
]

module.exports = (env) => ({
  context: __dirname,
  // This increase dev bundle size by ALOT!
  devtool: env && env.dev ? 'inline-sourcemap' : false,
  entry: {
    bundle: SRC_PATH + '/index',
    vendor: VENDOR_LIBS.concat(glob.sync('./vendor/**/*.js')),
  },
  output: {
    path: DIST_PATH,
    publicPath: '',
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({ filename: './css/app.css' }),
    new CopyWebpackPlugin([{ from: 'static/', to: './' }]),
    new Webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin(),
  ],
  optimization: {
    // https://github.com/webpack/webpack/issues/6357
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /react|react-dom/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({ cache: true, parallel: true, sourceMap: false }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  module: {
    rules: [
      // Load javascripts
      {
        test: /\.jsx?$/,
        include: SRC_PATH,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // Load stylesheets
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      // Load images
      {
        test: /\.(png|svg|jpe?g|gif)(\?.*$|$)/,
        loader: 'url-loader?limit=10000',
      },
      // Load fonts
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?(\?.*$|$)/,
        use: 'url-loader?&limit=10000&name=/fonts/[name].[ext]',
      },
      {
        test: /\.(eot|ttf|otf)?(\?.*$|$)/,
        loader: 'file-loader?&limit=10000&name=/fonts/[name].[ext]',
      },
    ]
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    open: true,
    hot: true,
  },
});