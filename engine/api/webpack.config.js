const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@common': path.resolve(__dirname, '..', 'common', 'src'),
      '@serverCommon': path.resolve(__dirname, '..', 'serverCommon', 'src'),
    },
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyWebpackPlugin([
      {
        copyPermissions: true,
        from: `./env-config.json`,
      },
    ]),
  ].filter((a) => a),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {noEmit: false},
        },
      },
    ],
  },
};
