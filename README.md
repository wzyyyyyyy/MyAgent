# MyAgent

基于 Node.js、TypeScript 和 ES Modules 的项目基础骨架。目前入口为 `src/index.ts`，运行后输出 `123`，尚未实现 Agent 功能。

## 环境要求

- Node.js 24 或更新版本，推荐使用 Node.js 24。
- npm。

使用 nvm 时，可执行 `nvm install` 和 `nvm use`，读取项目的 `.nvmrc` 配置。

## 安装与运行

```bash
npm ci
npm run dev
```

开发模式会监听源码变更并重新运行入口。构建并运行编译产物：

```bash
npm run check
npm run build
npm start
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 使用 tsx 监听并运行 TypeScript 入口 |
| `npm run check` | 执行严格类型检查，不生成文件 |
| `npm run build` | 将源码编译到 `dist/` |
| `npm start` | 运行已构建的 `dist/index.js` |

项目尚未包含业务测试。GitHub Actions 会在推送和拉取请求时执行依赖安装、类型检查、构建和入口运行检查。

## WebStorm 运行与调试

项目的 `.run/` 目录包含可共享的运行配置，在右上角配置菜单中选择：

- `MyAgent`：直接运行 TypeScript 入口；点击 Run 运行，或在 `src/index.ts` 设置断点后点击 Debug 调试。
- `Dev (watch)`：开发监听模式，修改源码后自动重启。
- `Build`：编译项目。
- `Type check`：执行类型检查。

`MyAgent` 通过 `--import tsx --enable-source-maps` 加载 TypeScript，无需提前构建。所有配置使用项目的 Node.js 解释器。首次使用请先执行 `npm ci`，并确认 WebStorm 的 JavaScript Runtime 设置指向 Node.js 24 或更新版本。

共享运行配置不包含 API 密钥等本地环境变量；需要时在本地配置中填写。

## 目录

```text
src/index.ts       程序入口
tsconfig.json      TypeScript 编译配置
package-lock.json  依赖版本锁定
.github/workflows/ 自动检查
```

依赖、编译产物、编辑器配置和本地 `.env` 文件已加入 Git 忽略规则。后续如需 API 密钥，请使用本地环境变量，并在 `.env.example` 中仅提供占位示例。

## 许可

[MIT](LICENSE)
