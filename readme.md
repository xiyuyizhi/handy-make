## handy-cli

> a tool for create react app,support common use features,inspired by vue-cli and create-react-app

English|[中文](./readme_zh.md)

## Features

- Create react apps with no build configuration

- Rich features to select (Ant Design,TypeScript,Mobx,EsLint,TsLint)

- Can eject webpack config to project directory,give you more controll

- Multiple pages support

- Multiple state management way

- Easy custom ant design theme

- Support lint code when commit or save code

## Install

```
npm install handy-cli -g

yarn add handy-cli -g
```

## Usage

```
handy create <new-app>

handy eject
```

## Preview

![](./preview.gif)

## User Guide

- [Folder Structure](#folder-structure)

- [Single And Multi Page](#single-and-multi-page)

- [Eject](#eject)

- [Linter](#linter)

- [State Management](#state-management)

- [Use Ant Design](#use-ant-design)

- [Styles And Modules](#styles-and-modules)

- [Proxy](#confnig-proxy)

### Folder Structure

After run `handy create you-app-name`(select ant-design、linter、mobx),you can get the folder with the follow structure

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

Under src,there have some subdirectories

- components(the common components folder), all components shared by multi router pages on this

- modules(the router pages folder),each subdirectory under modules represent **a router page**,such as Dashboard、Welcome

- pages(the multi pages folder), each subdirectory under pages is **a single SPA**

- stores(the mobx stores folder,if you select use Mobx when create app)

- utils

#### Note

The folder show above already configure in `config.resolve.alias`,so,you can write

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

handy-cli create single page by default,but it's easy to add new page.

after init,you can add new page files under src/pages, like doule12

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

then, restart server,location to localhost:3000/doble12,you can get the view

### Eject

on you apps root directory,after commit your code , you can run `handy eject` to export webpack configs and scripts to your project to do same thing customized.

### Linter

Support eslint and tslint.

when you select the TypeScript feature,there is only Tslint allow,otherwise support [eslint with airbnb config](https://www.npmjs.com/package/eslint-config-airbnb) and [eslint with prettier config](https://www.npmjs.com/package/eslint-config-prettier)

#### Linter condition

lint when save code or lint when commit code,recommended use when commit,for faster compile,in package.json

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

when use handy-cli,you can select the way to controll you app's state

- Normal(the build in Context API)

- Mobx

- Dva(not yet)

### Use Ant Design

After select `ant design` feature when create new apps,you can use antd easy

in you code, add

```
+ import { Pagination } from "antd";
+ <Pagination total={100} />
  <Search />
```

you can see the UI changed,you can use antd `according to the need to load` with noting to configure

#### custom ant design theme

under you app root directory,you can see a file named modifyVar.json, you can override [the less styles variable defined there](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less),_note!!_,when you changed the modifyVar.json, the dev server will restart auto!!!,you need not manually restart service

### Styles And Modules

support less,sass,stylus and css modules

if you want use css modules,you need named the file with the suffix `.module.css 、 .module.less、 .module.sass、.module.styl`

### Proxy

add a proxy field to your package.json,for example

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
