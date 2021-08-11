/**
 * 构建主题文件packages/theme-chalk/src/index.scss
 * 如果在components.json不存在相应组件的.scss文件，会自动创建一个相应空文件
 */
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = ['theme-chalk'];
var excludeFile = ['icon'];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

themes.forEach((theme) => {
    var isSCSS = theme !== 'theme-default';
    var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
    Components.forEach(function(key) {
        if (excludeFile.indexOf(key) > -1) return;
        var fileName = key + (isSCSS ? '.scss' : '.css');
        indexContent += '@import "./' + fileName + '";\n';
        var filePath = path.resolve(basepath, theme, 'src', fileName);
        if (!fileExists(filePath)) {
            fs.writeFileSync(filePath, '', 'utf8');
            console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
        }
    });
    fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
