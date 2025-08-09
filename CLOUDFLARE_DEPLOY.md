# Cloudflare Pages 部署配置

## 构建设置

- **构建命令**: `npm install && npm run build`
- **构建输出目录**: `build`
- **Node.js版本**: `18` 或 `20`

## 为什么使用 npm install 而不是 npm ci

由于版本兼容性问题，我们使用 `npm install && npm run build` 而不是默认的 `npm ci`。
这样可以确保依赖正确安装而不会出现版本不匹配的问题。

## 环境变量

无需特殊环境变量

## 部署说明

1. 连接GitHub仓库到Cloudflare Pages
2. 设置构建命令为 `npm install && npm run build`
3. 设置输出目录为 `build`
4. 部署即可

项目会自动从构建输出目录部署静态文件。