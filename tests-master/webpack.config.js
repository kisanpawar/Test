const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const entry = {
    'index-all': `./src/index-all.js`
};

module.exports = {
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.html']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['raw-loader']
            },
            {
                test: /\.scss$/,
                use: ['raw-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: ['raw-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                    // ,{
                    //     loader: 'eslint-loader'
                    // }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve('./node_modules/@experian/eds-components/dist/*.js'),
                to: '',
                flatten: true,
                ignore: ['doc-elements.js']
            }
        ])
    ]
};
