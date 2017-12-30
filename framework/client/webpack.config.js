const path = require("path");

module.exports = {
    entry: './index.ts',
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
        alias: {
            // "@framework-common": path.resolve(__dirname, "../common/")
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
    }};