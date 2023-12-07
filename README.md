# template-vue

## 项目简介

这是一个基于微信端 html5 的模板工具，使用 vue-cli 构建。使用 vue 构建的原因如下：

1. 将原本手工实现 mvc 框架的结构迁移到外界更认可更广泛运用的 mvvm 框架上
2. 更多使用到 es6，webpack 等功能
3. 流程规范化

## 最终目标

本框架的最终目标要实现以下功能：

-   [x] 一套简单的整体页面跳转流程
-   [x] Loading 初始页面
-   [x] Loading 图片机制
-   [x] 百度统计
-   [x] 背景音乐播放
-   [x] 静态资源 cdn 路径转化
-   [x] 微信分享
-   [x] 微信调试工具
-   [x] 过场动画以及页面管理工具
-   [x] 序列帧组件 MovieClip.vue

## npm 说明

### node 版本降级

**务必使用 node v8.17.0 版本**

时过境迁，此项目创建于 2019 年前后，目前无法依赖最新版 node 运行。即使升级 node，也会导致其他依赖包报错

推荐版本如下：

```
html5-template-vue % node -v
v8.17.0
html5-template-vue % npm -v
6.13.4
```

请使用 nvm use 命令切换到**node 8**

```
nvm use 8
```

如果你还没有安装 nvm，请参考以下链接进行 nvm 的安装

-   [如何在 macOS 上安装 NVM](https://juejin.cn/post/7083026831263137800)
-   [brew 安装 nvm 后无法使用 nvm 命令](https://blog.csdn.net/cainiao1412/article/details/124016883)
    > macOS Sonoma 14.1.2 需要在~/.zshrc 中去更新 nvm 的环境变量

## Project setup

```
npm i -D
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```
