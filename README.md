# 🎒 穷游费用对比系统 Pro

> 智能规划 · 实时数据 · 全网比价 · 一键预订

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)

## 📖 项目简介

穷游费用对比系统是一款专为背包客和穷游爱好者打造的一站式旅行费用规划工具。系统整合了火车票、机票、酒店、景点门票等多维度数据，通过智能算法为用户推荐最省钱的旅行方案。

### ✨ 核心特性

- 🔍 **全网比价**：一键对比多个平台的交通、住宿价格
- 📊 **实时数据**：模拟真实API数据源，支持定时更新
- 💰 **费用汇总**：自动计算最低预算和舒适预算
- 🎁 **优惠活动**：聚合各平台优惠券和促销活动
- 🔗 **一键预订**：直达第三方平台，快速完成预订
- 📱 **响应式设计**：完美适配桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器（Chrome/Firefox/Safari/Edge）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/travel-price-comparison.git
cd travel-price-comparison
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **启动后端服务**
```bash
npm start
# 或开发模式
npm run dev
```

4. **打开前端页面**
直接用浏览器打开 `frontend/index.html` 文件

### 默认端口

- 后端API：`http://localhost:3000`
- 前端页面：`file://frontend/index.html` 或通过 Live Server

## 📁 项目结构

```
travel-price-comparison/
├── 📂 frontend/                 # 前端代码
│   ├── index.html              # 主页面
│   ├── css/
│   │   └── style.css           # 样式文件
│   └── js/
│       └── app.js              # 前端逻辑
├── 📂 backend/                  # 后端代码
│   ├── server.js               # Express服务器
│   ├── package.json            # 依赖配置
│   └── .env.example            # 环境变量示例
├── 📂 docs/                     # 文档
│   ├── API.md                  # API接口文档
│   └── DEPLOY.md               # 部署指南
├── 📂 assets/                   # 静态资源
│   └── screenshots/            # 项目截图
└── README.md                    # 项目说明
```

## 🛠️ 技术栈

### 前端
- **HTML5** + **CSS3** - 页面结构和样式
- **Vanilla JavaScript** - 原生JavaScript，无框架依赖
- **CSS Grid/Flexbox** - 响应式布局
- **CSS Variables** - 主题色彩管理
- **Fetch API** - 数据请求

### 后端
- **Node.js** - 运行环境
- **Express.js** - Web框架
- **CORS** - 跨域支持
- **node-cron** - 定时任务
- **express-rate-limit** - 限流保护

## 📡 API 接口

### 火车票查询
```http
GET /api/trains?from=北京&to=上海&date=2024-01-01
```

### 机票查询
```http
GET /api/flights?from=北京&to=上海&date=2024-01-01
```

### 酒店查询
```http
GET /api/hotels?city=上海&checkin=2024-01-01&checkout=2024-01-03
```

### 景点查询
```http
GET /api/attractions?city=上海
```

### 优惠活动
```http
GET /api/promotions
```

### 综合比价
```http
GET /api/compare?from=北京&to=上海&date=2024-01-01&travelers=2&days=3
```

## 🎯 功能模块

### 1. 行程规划
- 出发地/目的地选择
- 出行日期设定
- 人数和天数配置
- 餐饮预算设置

### 2. 交通比价
- 🚄 火车票：高铁/动车/普快/特快
- ✈️ 机票：多航司价格对比
- 🚌 大巴：短途出行方案
- 实时显示折扣信息

### 3. 住宿比价
- 🏨 酒店：经济型/快捷/舒适型
- 🏠 民宿：特色民宿推荐
- 🎒 青旅：背包客首选
- 价格/评分/位置综合排序

### 4. 景点推荐
- 🎫 门票价格查询
- 📍 热门景点推荐
- 💡 省钱攻略提示
- 🆓 免费景点标注

### 5. 费用汇总
- 💰 最低总预算
- 🌟 舒适总预算
- 📊 分项费用明细
- 📈 价格趋势分析

### 6. 优惠活动
- 🎁 优惠券聚合
- 💳 促销码展示
- ⏰ 有效期提醒
- 🔗 一键跳转领取

## 🌆 支持城市

目前支持以下热门旅游城市：

| 城市 | 交通 | 酒店 | 景点 |
|------|------|------|------|
| 北京 | ✅ | ✅ | ✅ |
| 上海 | ✅ | ✅ | ✅ |
| 广州 | ✅ | ✅ | ✅ |
| 深圳 | ✅ | ✅ | ✅ |
| 杭州 | ✅ | ✅ | ✅ |
| 成都 | ✅ | ✅ | ✅ |
| 西安 | ✅ | ✅ | ✅ |

## 🎨 界面预览

### 首页
![首页截图](assets/screenshots/home.png)

### 交通比价
![交通截图](assets/screenshots/transport.png)

### 酒店比价
![酒店截图](assets/screenshots/hotel.png)

### 费用汇总
![汇总截图](assets/screenshots/summary.png)

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
API_RATE_LIMIT=100
CACHE_TTL=1800
```

### 数据源配置

在 `backend/server.js` 中配置数据源：

```javascript
const trainDataSource = {
  '北京-上海': [
    { trainNo: 'G1', type: '高铁', price: { second: 553, first: 933 } }
  ]
};
```

## 📈 性能优化

- ✅ 数据缓存机制（30分钟更新）
- ✅ API请求限流保护
- ✅ 前端懒加载
- ✅ 图片懒加载
- ✅ CSS/JS压缩

## 🔒 安全特性

- ✅ CORS跨域配置
- ✅ 请求频率限制
- ✅ 输入参数验证
- ✅ XSS防护

## 📝 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- 🚄 火车票查询功能
- ✈️ 机票查询功能
- 🏨 酒店查询功能
- 🎫 景点查询功能
- 💰 费用汇总功能
- 🎁 优惠活动功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- 感谢各OTA平台提供的数据支持
- 感谢开源社区的贡献
- 感谢所有用户的反馈和建议

## 📮 联系我们

- 项目主页：[https://github.com/yourusername/travel-price-comparison](https://github.com/yourusername/travel-price-comparison)
- 问题反馈：[https://github.com/yourusername/travel-price-comparison/issues](https://github.com/yourusername/travel-price-comparison/issues)
- 邮箱：1287183332@qq.com

---

<p align="center">
  Made with ❤️ for backpackers
</p>
