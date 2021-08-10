/**
 * 构建单组件架包
 * 如开发input组件 运行 npm run new input 即可生成对应组件的目录结构
 * 将单个组件入口文件 packages/{componentname}/index.js 注册到 components.json 文件
 * 在 packages/theme-chalk 下生成对应组件的.scss文件，并注册到packages/theme-chalk/src/index.scss
 */
'use strict';

console.log();
process.on('exit', () => {
  console.log();
});

if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}

const path = require('path');
const fs = require('fs');
const fileSave = require('file-save');
const uppercamelcase = require('uppercamelcase');
const componentname = process.argv[2];
const ComponentName = uppercamelcase(componentname);
const PackagePath = path.resolve(__dirname, '../../packages', componentname);

// package单组件信息及对应主题文件{componentname}.scss
const Files = [{
    filename: 'index.js',
    content: `import ${ComponentName} from './src/main';

/* istanbul ignore next */
${ComponentName}.install = function(Vue) {
    Vue.component(${ComponentName}.name, ${ComponentName});
};

export default ${ComponentName};`
},{
    filename: 'src/main.vue',
    content: `<template>
    <div class="run-${componentname}"></div>
</template>

<script>
export default {
    name: 'Run${ComponentName}'
};
</script>`
},{
    filename: path.join('../../packages/theme-chalk/src', `${componentname}.scss`),
    content: `@import "basescss/mixins";
@import "basescss/var";

@include b(${componentname}) {
}`}];

// 添加到 components.json
const componentsFile = require('../../components.json');
if (componentsFile[componentname]) {
  console.error(`${componentname} 已存在.`);
  process.exit(1);
}
componentsFile[componentname] = `./packages/${componentname}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n');

// 添加到 index.scss
const sassPath = path.join(__dirname, '../../packages/theme-chalk/src/index.scss');
const sassImportText = `${fs.readFileSync(sassPath)}@import "./${componentname}.scss";`;
fileSave(sassPath)
  .write(sassImportText, 'utf8')
  .end('\n');

// 创建 package
Files.forEach(file => {
  fileSave(path.join(PackagePath, file.filename))
    .write(file.content, 'utf8')
    .end('\n');
});

console.log('DONE!');
