const path = require("path");
const fs = require("fs");
const NodemonPlugin = require('nodemon-webpack-plugin')

var config = {
    entry: './src/server.ts',
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'source-map',
    target: "node",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
        alias: {
            "@common": path.resolve(__dirname, "../common/"),
            "@serverCommon": path.resolve(__dirname, "../serverCommon/")
        }
    },
    plugins: [
        new NodemonPlugin({
            watch: path.resolve('./dist'),
            verbose: true,
            // Node arguments.
            nodeArgs: ['--inspect=9222'],
            script: './dist/bundle.js'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        noEmit: false
                    }
                }
            }
        ]
    }};

config.externals = fs.readdirSync("node_modules")
    .reduce(function (acc, mod) {
        if (mod === ".bin") {
            return acc
        }

        acc[mod] = "commonjs " + mod
        return acc
    }, {});

module.exports = config;