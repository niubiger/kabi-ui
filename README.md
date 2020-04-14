# kabi-ui
卡比UI是一个React组件库。
## 项目代码
入口为 `src/index.js`，组件代码放到 `src/components` 下。
### 初始化组件
使用脚本 `gen {MyComponent}` 来初始化组件，该命令会在：
*  *src/components/* 下生成 *MyComponent* 目录，并含有 **index.tsx** 及 **index.scss** 初始代码
* *src/doc/* 下生成 **mycomponent.mdx** 文档文件
* 入口文件 **src/index.js** 中增加组件导出
```sh
npm link # 或 sudo npm link
gen MyComponent
```
> ⚠️注意：还需要在 **.doczrc.js** 中增加配置，以使文档能生成相关路由

## 文档相关
### 开发运行
1. 借助 docz 工具进行开发
    ```sh
    npm run doc:dev
    ```
2. 使用 docz 打包文档包发布
    ```sh
    npm run doc:build
    ```
### 注意事项
#### 关于 `sharp` 依赖
1. `sharp` 依赖需要代理才能下载，无代理可以直接下载以下资源包
    > 链接：https://share.weiyun.com/5MRlBUO 密码：bj6mnx
2. 获取 npm cache 目录
    ```sh
    npm config get cache # mac系统下默认为 `/Users/username/.npm`
    ```
3. 将下载的包移入属于 `sharp` 的 cache 目录
    ```sh
    mv /Users/username/Download/libvips-8.9.1-darwin-x64.tar.gz /Users/username/.npm/_libvips
    ```
## 待增加
1. 在使用初始化脚本 *src/bin/gen* 生成组件相关文件的同时，增加 **.doczrc.js** 中 *docz* 文档路由的自动化配置