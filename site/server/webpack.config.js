const path = require("path");
const fs = require("fs");
const NodemonPlugin = require('nodemon-webpack-plugin')

var config = {
    entry: './src/server.ts',
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'inline-source-map',
    target: "node",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
        alias: {
            "@common": path.resolve(__dirname, "../common/")
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
        loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, loader: 'ts-loader'}
        ],
    }
};

config.externals = fs.readdirSync("node_modules")
    .reduce(function (acc, mod) {
        if (mod === ".bin") {
            return acc
        }

        acc[mod] = "commonjs " + mod
        return acc
    }, {});

module.exports = config;