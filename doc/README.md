# kabi-doc
doc for kabi-ui

## 注意
### 关于 `sharp` 依赖
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