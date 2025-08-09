# Chat Demo - AI聊天窗口项目

一个基于React的AI聊天界面演示项目，具有现代化的UI设计和流畅的用户体验。

## 🎯 在线预览

访问：[https://zhuyuesen.github.io/chat-demo](https://zhuyuesen.github.io/chat-demo)

## ✨ 功能特性

- 🎨 **现代化UI设计** - 使用Tailwind CSS构建的美观界面
- 💬 **实时聊天体验** - 模拟AI对话功能
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **流畅动画** - 消息发送和接收的平滑动画效果
- 📋 **消息复制** - 一键复制消息内容
- 🔄 **清空对话** - 重置聊天记录功能
- ⌨️ **快捷键支持** - Enter发送，Shift+Enter换行
- 🎭 **加载状态** - 优雅的打字指示器动画

## 🛠️ 技术栈

- **React 18** - 前端框架
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库
- **Create React App** - 项目脚手架

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/zhuyuesen/chat-demo.git
cd chat-demo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

项目将在 http://localhost:3000 运行

### 4. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
chat-demo/
├── public/
│   └── index.html           # HTML模板
├── src/
│   ├── components/
│   │   └── ChatDemo.js      # 主聊天组件
│   ├── App.js               # 应用主组件
│   ├── App.css              # 应用样式
│   ├── index.js             # 入口文件
│   ├── index.css            # 全局样式
│   └── reportWebVitals.js   # 性能监控
├── package.json             # 项目配置
├── package-lock.json        # 依赖锁文件
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🎮 功能说明

### 主要组件

**ChatDemo组件** - 核心聊天界面组件，包含：
- 消息管理：维护聊天记录状态
- 消息发送：处理用户输入和消息发送逻辑
- AI模拟：模拟AI回复功能
- UI交互：处理各种用户交互

### 交互功能

- **发送消息**：点击发送按钮或按Enter键
- **换行**：Shift + Enter
- **复制消息**：悬停在消息上显示复制按钮
- **清空对话**：点击右上角清空按钮

## 🔧 自定义配置

### 修改AI回复

在 `src/components/ChatDemo.js` 中的 `simulateAIResponse` 函数可以自定义AI回复逻辑：

```javascript
const simulateAIResponse = (userMessage) => {
  // 在这里添加你的AI回复逻辑
  // 可以集成真实的AI API
};
```

### 样式自定义

项目使用Tailwind CSS，你可以：

1. 修改 `tailwind.config.js` 来自定义主题
2. 在组件中直接使用Tailwind类名
3. 在CSS文件中添加自定义样式

## 🚀 部署

### GitHub Pages（推荐）

项目已配置好GitHub Actions自动部署：

1. 推送代码到main分支
2. GitHub Actions自动构建并部署到GitHub Pages
3. 访问：https://zhuyuesen.github.io/chat-demo

### Cloudflare Pages

项目支持Cloudflare Pages部署：

1. 连接GitHub仓库到Cloudflare Pages
2. 选择框架预设：`React static`
3. 构建命令：`npm run build`
4. 构建输出目录：`build`

### 其他平台

- **Vercel**：导入GitHub仓库，自动部署
- **Netlify**：连接GitHub仓库，设置构建命令为 `npm run build`

## 🔮 集成真实AI API

替换 `simulateAIResponse` 函数中的模拟逻辑：

```javascript
const handleSendMessage = async () => {
  // ... 现有代码 ...
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputMessage }),
    });
    
    const data = await response.json();
    
    const aiResponse = {
      id: Date.now() + 1,
      content: data.reply,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };
    
    setMessages(prev => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error:', error);
  }
  
  setIsLoading(false);
};
```

## 🤝 贡献

欢迎提交Pull Request和Issue！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过GitHub Issues联系。

---

⭐ 如果这个项目对你有帮助，请给个star支持一下！