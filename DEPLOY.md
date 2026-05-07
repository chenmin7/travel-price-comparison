# 🚀 部署指南

## 目录

- [本地开发](#本地开发)
- [生产部署](#生产部署)
- [Docker部署](#docker部署)
- [云平台部署](#云平台部署)
- [常见问题](#常见问题)

---

## 本地开发

### 环境准备

1. **安装 Node.js**
```bash
# 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 验证安装
node -v  # v18.x.x
npm -v   # 9.x.x
```

2. **克隆项目**
```bash
git clone https://github.com/yourusername/travel-price-comparison.git
cd travel-price-comparison
```

### 启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env

# 启动开发服务器
npm run dev

# 或使用生产模式
npm start
```

后端服务将在 `http://localhost:3000` 启动

### 启动前端

**方式一：直接打开**
直接用浏览器打开 `frontend/index.html` 文件

**方式二：使用 Live Server（推荐）**
```bash
# 安装 Live Server
npm install -g live-server

# 进入前端目录
cd frontend

# 启动服务
live-server --port=8080
```

前端将在 `http://localhost:8080` 启动

---

## 生产部署

### 1. 服务器准备

**系统要求：**
- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- 2核CPU / 4GB内存 / 20GB磁盘
- Node.js 18+
- Nginx
- PM2（进程管理）

### 2. 部署后端

```bash
# 登录服务器
ssh user@your-server-ip

# 创建应用目录
mkdir -p /var/www/travel-app
cd /var/www/travel-app

# 克隆代码
git clone https://github.com/yourusername/travel-price-comparison.git .

# 安装依赖
cd backend
npm install --production

# 配置环境变量
nano .env
```

**环境变量配置：**
```env
PORT=3000
NODE_ENV=production
API_RATE_LIMIT=1000
CACHE_TTL=1800
CORS_ORIGIN=https://your-domain.com
```

```bash
# 使用 PM2 启动
npm install -g pm2
pm2 start server.js --name "travel-api"
pm2 save
pm2 startup

# 查看状态
pm2 status
pm2 logs travel-api
```

### 3. 部署前端

```bash
# 复制前端文件到 Nginx 目录
sudo cp -r frontend/* /var/www/html/

# 或者使用 Nginx 反向代理到前端开发服务器
```

### 4. Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/travel-app
```

**配置文件：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API 反向代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/travel-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. HTTPS 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## Docker部署

### 1. 创建 Dockerfile

**后端 Dockerfile：**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
```

**前端 Dockerfile：**
```dockerfile
FROM nginx:alpine

COPY frontend/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose 配置

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: travel-api
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - travel-network

  frontend:
    build: ./frontend
    container_name: travel-web
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - travel-network

  nginx:
    image: nginx:alpine
    container_name: travel-nginx
    restart: always
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - travel-network

networks:
  travel-network:
    driver: bridge
```

### 3. 启动服务

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 云平台部署

### Vercel（前端）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
cd frontend
vercel --prod
```

### Railway/Render（后端）

1. 在 Railway/Render 创建新项目
2. 连接 GitHub 仓库
3. 设置环境变量
4. 自动部署

### 阿里云/腾讯云

**使用云服务器 ECS：**

1. 购买云服务器（推荐 2核4G配置）
2. 配置安全组，开放 80/443/3000 端口
3. 按照【生产部署】步骤操作

**使用容器服务 Kubernetes：**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: travel-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: travel-app
  template:
    metadata:
      labels:
        app: travel-app
    spec:
      containers:
      - name: backend
        image: your-registry/travel-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: travel-service
spec:
  selector:
    app: travel-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## 监控与日志

### PM2 监控

```bash
# 监控面板
pm2 monit

# 查看日志
pm2 logs

# 重启应用
pm2 restart travel-api

# 查看性能
pm2 show travel-api
```

### 日志轮转

```bash
# 安装 logrotate
sudo apt install logrotate

# 配置
sudo nano /etc/logrotate.d/travel-app
```

```
/var/www/travel-app/backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

---

## 备份与恢复

### 数据库备份（如使用数据库）

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/travel-app"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /var/www/travel-app

# 保留最近30天备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

```bash
# 添加定时任务
crontab -e

# 每天凌晨3点备份
0 3 * * * /var/www/travel-app/backup.sh
```

---

## 常见问题

### Q1: 前端无法连接后端 API

**解决方案：**
1. 检查后端服务是否运行：`pm2 status`
2. 检查防火墙设置：`sudo ufw status`
3. 检查 CORS 配置是否正确
4. 确认 API 地址配置正确

### Q2: 内存占用过高

**优化方案：**
```bash
# 限制 Node.js 内存
node --max-old-space-size=512 server.js

# PM2 配置
pm2 start server.js --name "travel-api" --node-args="--max-old-space-size=512"
```

### Q3: 请求响应慢

**优化方案：**
1. 启用 Redis 缓存
2. 使用 CDN 加速静态资源
3. 开启 Gzip 压缩
4. 优化数据库查询

### Q4: 如何更新应用

```bash
# 拉取最新代码
cd /var/www/travel-app
git pull

# 更新依赖
cd backend
npm install

# 重启服务
pm2 restart travel-api

# 刷新 Nginx
sudo nginx -s reload
```

---

## 性能优化建议

### 1. 启用缓存

```javascript
// 使用 Redis 或内存缓存
const cache = require('memory-cache');

// 缓存中间件
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        cache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

app.use('/api/trains', cacheMiddleware(300));
```

### 2. 使用 CDN

将静态资源上传到 CDN：
- 阿里云 OSS + CDN
- 腾讯云 COS + CDN
- Cloudflare

### 3. 数据库优化（如使用）

- 添加索引
- 使用连接池
- 查询优化
- 读写分离

---

## 安全建议

### 1. 启用 HTTPS
- 使用 Let's Encrypt 免费证书
- 强制 HTTPS 重定向
- HSTS 头部

### 2. 安全配置
```javascript
// Helmet 安全头部
const helmet = require('helmet');
app.use(helmet());

// 限流
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

### 3. 环境变量保护
- 不要将 .env 文件提交到 Git
- 使用密钥管理服务
- 定期轮换密钥

---

## 联系支持

遇到问题？

- 📧 邮箱：support@travel-app.com
- 💬 Discord：[加入社区](https://discord.gg/travel-app)
- 🐛 Issue：[提交问题](https://github.com/yourusername/travel-price-comparison/issues)

---

**祝你部署顺利！** 🚀
