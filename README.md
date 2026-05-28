# Lumina Sky Citadel

沉浸式品牌着陆页，以白龙掠过云海的视频为背景，结合视差交互与场景叙事，呈现一座漂浮天空城堡的序章。

## 特性

- **视频背景** — 全屏循环播放的天空城堡视频，支持暂停/播放与声音切换
- **场景叙事** — 根据视频时间轴同步切换三个场景（Awakening / Citadel Glow / Cloud Descent），动态更新文案与视觉风格
- **视差交互** — 鼠标移动驱动标题和场景面板的微位移，增强空间感
- **毛玻璃 UI** — 导航栏、按钮、卡片均采用 backdrop-filter 玻璃质感
- **响应式布局** — 适配桌面、平板与移动端
- **无障碍** — 支持 `prefers-reduced-motion`，语义化 HTML 结构

## 技术栈

纯静态页面，无需构建工具：

- HTML5
- CSS3（自定义属性、Grid、动画、毛玻璃效果）
- Vanilla JavaScript（视频同步、Web Audio API、视差）

## 快速开始

用任意静态服务器打开，例如：

```bash
npx serve .
```

或直接用浏览器打开 `index.html`。

## 项目结构

```
.
├── index.html          # 主页面
├── styles.css          # 样式
├── script.js           # 交互逻辑
├── assets/
│   ├── lumina-sky-castle.mp4   # 背景视频
│   ├── glass.svg               # 玻璃纹理
│   ├── magnet.svg              # 磁铁图标
│   ├── nebula.svg              # 星云纹理
│   ├── panel-texture.svg       # 面板纹理
│   └── pulse.svg               # 脉冲图标
└── README.md
```

## 浏览器支持

所有支持 CSS `backdrop-filter`、`aspect-ratio` 和 Web Audio API 的现代浏览器。
