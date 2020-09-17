const path = require('path');

module.exports = {
    entry: './index.ts',
    output: {
        filename: './bundle.js',
        libraryTarget: 'commonjs2',
    },
    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
        alias: {
            '@common': path.resolve(__dirname, '../common/'),
            // "@framework": path.resolve(__dirname, "../../../framework/client"),
            // "@framework-common": path.resolve(__dirname, "../../../framework/common")
        },
    },
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
