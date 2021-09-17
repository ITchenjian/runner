## 基础文件

.babelrc	babel-loader的配置文件

.eslintrc	eslint-loader的配置文件

components.json	组件json，生成入口文件的src/index.js、index.scss的关键文件



## 组件开发流程

```shell
# 生成element主题包
npm run theme:ele

# 生成组件架包（xxx组件名，推荐a或a-b形式）
npm run new xxx

# 清除编译包
npm run clean

# 生成主题文件（1.生成index.scss;  2.gulp编译打包.scss文件; 3.复制主题编译包到lib文件夹）
npm run build:theme

# 生成入口文件src/index.js
npm run build:file

#复制工具类到lib
npm run build:utils

#启动单组件开发环境
npm run dev:play

#编译发布文件 lib/index.js、lib/{componentname}.js、lib/runner-ui.common.js
npm run build
```




## 开发依赖

```
{
  "name": "runner-ui",
  "version": "1.0.0",
  "description": "A Component Library for Vue.js",
  "main": "lib/runner-ui.common.js",		//入口文件
  "files": [				//npm publish 发布文件
    "lib",
    "src",
    "packages"
  ],
  "scripts": {
    //element主题
    "theme:ele": "rimraf packages/theme-element/theme && et -c packages/theme-element/element-variables.scss -o packages/theme-element/theme",
  	//生成单组件架包
  	"new": "node build/bin/new.js",
  	//生成主题文件
  	"build:theme": "node build/bin/build-cssfile.js && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
  	//生成入口文件src/index.js
  	"build:file": "node build/bin/build-entry.js",
  	//组件开发
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    //编译发布文件
    "build": "webpack --config build/webpack.conf.js && webpack --config build/webpack.component.js && webpack --config build/webpack.common.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
  	/*babel全家桶*/
    "babel-cli": "^6.26.0",			
    "babel-core": "^6.26.3",		//核心代码
    "babel-loader": "^7.1.5",		//基础代码
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-istanbul": "^4.1.1",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-regenerator-runtime": "^6.5.0",
    "babel-plugin-component": "^1.1.1",		//element-ui 自家用的babel打包工具(按需引入组件主题)
    "cross-env": "^3.1.3",		//兼容平台设置和使用环境变量的脚本（unix、windows）	
    "rimraf": "^2.5.4",			//文件删除插件

    "progress-bar-webpack-plugin": "^1.11.0",		//进度条插件（编译增强）
    "mini-css-extract-plugin": "^0.4.1",
    "copy-webpack-plugin": "^5.0.0",
    "html-webpack-plugin": "^3.2.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "uglifyjs-webpack-plugin": "^2.1.1",

    "uppercamelcase": "^1.1.0",		//大驼峰转换器
    "json-templater": "^1.0.4",		//字符串模板生成器
	
	/*语法校验全家桶*/
    "eslint": "4.18.2",				//核心代码
    "eslint-loader": "^2.0.0",		//基础代码
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
    "eslint-config-elemefe": "0.1.1",

    "file-loader": "^1.1.11",
    "file-save": "^0.2.0",
    
    "node-sass": "^4.11.0",		//核心代码
    "sass-loader": "^7.1.0",	//基础代码
    "element-ui": "^2.15.1",
    "element-theme": "^2.0.1",
    "element-theme-chalk": "^2.15.1",

    "cp-cli": "^1.0.2",
    "gulp": "^4.0.0",
    "gulp-autoprefixer": "^6.0.0",
    "gulp-cssmin": "^0.2.0",
    "gulp-sass": "^4.0.2",

    "css-loader": "^2.1.0",
    "style-loader": "^0.23.1",
    "url-loader": "^1.0.1",
    "vue": "2.5.21",
    "vue-loader": "^15.7.0",
    "vue-template-compiler": "2.5.21",
    "vue-template-es2015-compiler": "^1.6.0",
    "webpack": "^4.14.0",
    "webpack-cli": "^3.0.8",				//webpack命令插件
    "webpack-dev-server": "^3.1.11",
    "webpack-node-externals": "^1.7.2"		//忽略node_modules文件夹中的所有模块
  }
}

```







