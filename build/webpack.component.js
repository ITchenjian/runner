/**
 * 打包编译单组件文件lib/{componentname}.js
 */
const path = require('path');           //nodejs内置模块
const ProgressBarPlugin = require('progress-bar-webpack-plugin');       //进度条插件（强化插件）
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const Components = require('../components.json');                       //入口文件设置
const config = require('./config');     //配置文件

const webpackConfig = {
    mode: 'production',
    entry: Components,
    output: {
        path: path.resolve(process.cwd(), './lib'),             //path.resolve将路径或路径片段的序列解析为绝对路径，process.cwd()返回 Node.js 进程的当前工作目录
        publicPath: '/dist/',                                 //文件目录url 相对于 HTML 页面
        filename: '[name].js',
        chunkFilename: '[id].js',
        libraryTarget: 'commonjs2',
    },
    resolve: {                                                   //模块解析规则
        extensions: ['.js', '.vue', '.json'],                    //拓展名（当引用模块没带后缀应用此后缀进行匹配）                               
        alias: config.alias,                                     //重写模块引入路径-别名
        modules: ['node_modules'],
    },
    externals: config.externals,                                 //拓展模块，防止打包到 bundle中，运行时直接从外部获取这些扩展依赖
    performance: {                                               //性能
        hints: false
    },
    stats: 'none',                                               //编译时统计信息
    optimization: {                                              //优化
        minimize: false
    },
    module: {
        rules: [
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
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('static', '[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin(),
        new VueLoaderPlugin()
    ]
}

module.exports = webpackConfig;