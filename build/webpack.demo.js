/**
 * 单组件开发demo，开发环境example/play
 */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./config');

const isProd = process.env.NODE_ENV === 'production';       //是否生产环境
const isPlay = !!process.env.PLAY_ENV;                      //是否单元组件开发

const webpackConfig = {
    mode: process.env.NODE_ENV,
    entry: './examples/play.js',
    output: {
        path: path.resolve(process.cwd(), './examples/runner-ui/'),
        publicPath: '',
        filename: '[name].[hash:7].js',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: config.alias,
        modules: ['node_modules']
    },
    devServer: {
        host: '0.0.0.0',
        port: 8086,
        publicPath: '/',
        hot: true
    },
    performance: {
        hints: false
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            /* {
                enforce: 'pre',
                test: /\.(vue|jsx?)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }, */
            {
                test: /\.(jsx?|babel|es6)$/,
                include: process.cwd(),
                exclude: config.jsexclude,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                // todo: 这种写法有待调整
                query: {
                    limit: 10000,
                    name: path.posix.join('static', '[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './examples/templates/index.html',
            filename: './index.html',
            favicon: './examples/favicon.ico'
        }),
        new ProgressBarPlugin(),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env.FAAS_ENV': JSON.stringify(process.env.FAAS_ENV)        //插件定义一些编译时的全局常量(替换)
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        })
    ],
    optimization: {
        minimizer: []
    },
    devtool: '#eval-source-map'
}

module.exports = webpackConfig;