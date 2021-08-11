## Install
```shell
npm install runner-ui -S
```

## Quick Start
``` javascript
import Vue from 'vue'
import Runner from 'runner-ui'

Vue.use(Runner)

// or
import {
  TreeSelect
  // ...
} from 'runner-ui'

Vue.component(TreeSelect.name, TreeSelect)
```

## Theme

```javascript
// 主题引入
import 'runner-ui/lib/theme-chalk/index.css'

// or是搭配 babel-plugin-component 一起使用，只需要修改 .babelrc 的配置
{
  "plugins": [
    [
      "component",
      {
        "libraryName": "runner-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```








