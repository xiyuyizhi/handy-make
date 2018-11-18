## handy-cli

> 初始化 react 应用的脚手架工具，支持常用的特性，灵感来自 vue-cli 和 create-react-app

中文|[English](./readme_en.md)

## 特性

- 简单易用，零配置

- 丰富的特性可供选择 (Ant Design,TypeScript,Mobx,EsLint,TsLint)

- 支持导出 webpack 相关配置到项目目录下

- 多页面的支持

- 提供多种状态管理方式

- 使用 ant-design 后,非常容易定制化 ant-design 主题

- 支持代码保存时和代码提交时校验代码风格

## 安装

```
如果你使用npm管理node包
npm install handy-cli -g

如果你使用yarn管理node包
yarn global add handy-cli
```

## 使用

```
handy create <new-app>

handy eject
```

## 预览

![](./preview.gif)

## 使用手册

- [Folder Structure](#folder-structure)

- [Single And Multi Page](#single-and-multi-page)

- [Eject](#eject)

- [Linter](#linter)

- [State Management](#state-management)

- [Use Ant Design](#use-ant-design)

- [Styles And Modules](#styles-and-modules)

- [Proxy](#confnig-proxy)

### Folder Structure

运行`handy create you-app-name`(例如选择了 ant-design、eslint、mobx),handy-cli 会生成如下项目结构

```
├── node_modules
├── public
├── modifyVars.json
├── package.json
├── readme.md
├── .eslintrc
├── .gitignore
└── src
    ├── components
    │   ├── ResultItem
    │   │   └── ResultItem.js
    │   └── Scroll
    │       └── Scroll.js
    ├── modules
    │   └── mobxGitSearch
    │       ├── components
    │       │   ├── ResultList
    │       │   │   └── ResultList.js
    │       │   └── Search
    │       │       └── Search.js
    │       └── index.js
    ├── pages
    │   └── index
    │       ├── index.js
    │       └── routes.js
    ├── stores
    │   └── SearchGitStore.js
    └── utils
        └── index.js
```

在 src 目录下，有如下子目录

- components(公共组件目录), 多个路由页面都会用到的公共组件放在这

- modules(路由页面目录),modules 下的每一个子文件夹代表一个单一的路由页面,比如 Dashboard 页面,欢迎页面

- pages(多页面文件夹), 每一个子文件夹代表一个单一的**SPA 项目**,主要存放 SPA 的入口文件

- stores(存放 mobx 的 stores)

- utils

#### 注意

上面说的这些目录已经配置在`config.resolve.alias`,所以，在代码中不需要指定相对路径了

```
in src/modules/mobxGitSearch/index.js

import {shake} from "utils"
```

not

```
in src/modules/mobxGitSearch/index.js

import {shake} from "../utils"
```

### Single And Multi Page

使用 handy-cli 初始化项目后，src/pages 下只有一个 index 文件夹，也就是是个单页应用，要想添加新的独立的单页面很简单

例如，在 src/pages 下新建 doule12 文件夹

```
src
├── pages
    └── index
    │   ├── index.js
    │   └── routes.js
    ├── doule12
        │── index.js

in src/pages/doule12/index.js.

ReactDOM.render(
  <h1>double 12</h1>,
  document.getElementById("root"),
);

if (module.hot) {
  module.hot.accept(() => {});
}
```

重启服务后访问 localhost:3000/doble12 就可以看到新加的页面，而 localhost:3000 是默认的单页面

### Eject

如果你想修改一些 webpack 的配置，在项目根目录，确认代码已经 commit 后，可以执行`handy eject`来导出 webpack 的相关配置

### Linter

支持 Tslint 和 Eslint

如果在创建项目时选择了使用 Typescript,代码校验就只提供 Tslint,要是没选 TypeScript,就提供 Eslint 供选择，Eslint 相关的提供了[eslint with airbnb config](https://www.npmjs.com/package/eslint-config-airbnb) , [eslint with prettier config](https://www.npmjs.com/package/eslint-config-prettier),[eslint-config-ali](https://www.npmjs.com/package/eslint-config-ali)推荐使用 airbnb config

要想修改一些校验规则，可以修改项目根目录下的.eslintrc 或者 tslint.json

#### 检测时机

可以选择在代码保存或者提交代码的时候校验,为了代码更快的编译，在提交时校验比较好。提交代码校验的相关配置在 package.json 中

```
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "linters": {
      "*.{js,jsx}": [
        "eslint --fix",
        "git add"
      ]
    },
    "ignore": [
      "**/build/**.js"
    ]
  }
```

### State Management

可供选择的状态管理方式

- Normal(the build in Context API)

- Mobx

- Dva(开发中))

### Use Ant Design

handy-cli 提供了 ant-design 的**按需使用加载**,创建项目时选择了 ant-design 后可以零配置的直接使用

```
+ import { Pagination } from "antd";
+ <Pagination total={100} />
  <Search />
```

#### 自定义 ant-design 的样式主题

如果选择了使用 ant-design，在项目根目录下会有个 modifyVar.json 文件，在[这里定义的那些 less 样式变量](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less),都可以在 modifyVar.json 中赋予新值，保存后，**不用重启服务,自动会重启**,页面样式就变了

### Styles And Modules

支持 less,sass,stylus and css modules

注意: 如何想使用 css modules,样式文件要以 `.module.css 、 .module.less、 .module.sass、.module.styl`作为后缀

### Proxy

开发时要代理到后端服务，在 package.json 中新增 proxy 字段，如下

```
 "proxy": "http://localhost:4000",

 or

 proxy: {
  '/api': {
    target: '<url>',
    pathRewrite:{
      'api':''
    },
    changeOrigin: true
  },
  '/foo': {
    target: '<other_url>'
  }
 }
```

see more proxy [options](https://github.com/chimurai/http-proxy-middleware#options)

## Todo

[ ] integration [dva](https://github.com/dvajs/dva)

[ ] dynamic load

## Development

```
npm install lerna -g

git clone https://github.com/xiyuyizhi/handy-make.git

cd handy-make

npm install

lerna bootstrap
```

if you use vscode , add the [content](./vscode_launch.json) to launch.json

## License

The MIT License (MIT)
