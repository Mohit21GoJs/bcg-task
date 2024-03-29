const path = require("path");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }, {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }, ],
    },
    plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({
        title: 'Ideas App',
        template: './index.html'
    })],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    }
};