var path = require('path');
var fs = require('fs');             //node内置模块fs
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');

var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`runner-ui/packages/${key}`] = `runner-ui/lib/${key}`;      //相应路径的引用不会打包到bundle中（应用：在runner-ui.common.js中不会存在对应代码，只存在引用），其他同理
});

externals['runner-ui/src/locale'] = 'runner-ui/lib/locale';           //此文件夹下仅index.js一个入口文件
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`runner-ui/src/utils/${file}`] = `runner-ui/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`runner-ui/src/mixins/${file}`] = `runner-ui/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`runner-ui/src/transitions/${file}`] = `runner-ui/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'runner-ui': path.resolve(__dirname, '../')           //引用路径runner-ui会替换为当前路径下的'../'
};

exports.vue = {
  root: 'Vue',                  //可通过全局变量访问
  commonjs: 'vue',              //CommonJS 模块系统中通过 vue 访问（相对于commonjs增加了一层命名空间；引用时require('xxx').vue）
  commonjs2: 'vue',             //CommonJS2 模块系统中通过 vue 访问（require('xxx')）
  amd: 'vue'                    //AMD 模块系统中通过 vue 访问
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
