const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: './scripts/console/index.ts',
  mode: 'development',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    pathinfo: false,
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
