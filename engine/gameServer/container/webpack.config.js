const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    entry: './src/index.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@common': path.resolve(__dirname, '../../common/src'),
        '@serverCommon': path.resolve(__dirname, '../../serverCommon/src'),
        '@framework': path.resolve(__dirname, '../../../framework/server'),
        '@framework-common': path.resolve(__dirname, '../../../framework/common'),
      },
    },
    externals: [nodeExternals({whitelist: ['ws', 'node-fetch', 'aws-sdk/clients/elbv2','aws-sdk/clients/ecs', 'jmespath','xml2js','xmlbuilder','sax']})],
    plugins: [new webpack.DefinePlugin({'process.env.ENV': '"prod"'})].filter((a) => a),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {noEmit: false},
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
      ],
    },
  };
};
