const path = require("path");
const fs = require("fs");

var config = {
    entry: './index.ts',
    output: {
        filename: './dist/bundle.js'
    },
    target: "node",
    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
        alias: {
            "@common": path.resolve(__dirname, "../common/"),
            // "@framework": path.resolve(__dirname, "../../../framework/server"),
            // "@framework-common": path.resolve(__dirname, "../../../framework/common")
        }
    },
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