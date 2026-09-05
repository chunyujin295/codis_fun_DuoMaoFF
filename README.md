# 多毛记 (DuoMaoFF)

<p align="center">
  <img src="./doc/img/icon.png" alt="icon" width="200">
</p>

一个杂志风格的猫咪展示网站，用于展示多多和毛毛两只小猫的照片、视频和成长故事。

## 功能

- **猫咪介绍** - 展示每只猫的个人信息与性格特点
- **媒体相册** - 照片/视频的瀑布流展示，支持灯箱查看
- **时间线** - 根据 EXIF 日期自动组织的成长时间线
- **小猫日记** - 记录猫咪的日常趣事和成长点滴
- **管理后台** - 登录后上传和管理媒体内容

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **后端**: Next.js API Routes + NextAuth
- **数据库**: Prisma ORM + SQLite
- **部署**: Docker

## 环境要求

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose（可选）

## 快速开始

### 1. 克隆项目

```bash
git clone <仓库地址>
cd DuoMaoFF
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改以下配置：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库路径 | `file:./dev.db` |
| `NEXTAUTH_SECRET` | NextAuth 密钥（生产环境务必修改） | `your-secret-key-here` |
| `NEXTAUTH_URL` | 应用访问地址 | `http://localhost:3000` |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码（生产环境务必修改） | `admin123` |
| `UPLOAD_DIR` | 上传文件目录 | `./uploads` |
| `MAX_FILE_SIZE` | 最大上传文件大小（字节） | `52428800` (50MB) |

### 4. 初始化数据库

```bash
npm run setup
```

此命令会依次执行：生成 Prisma Client → 推送数据库结构 → 导入种子数据。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 即可查看网站。

## Docker 部署

```bash
docker compose up -d
```

容器启动后访问 http://localhost:3000。

停止服务：

```bash
docker compose down
```

## 管理后台

访问 http://localhost:3000/admin/login 进行登录。

默认账号：`admin` / `admin123`

> 生产环境部署前请务必修改管理员密码和 `NEXTAUTH_SECRET`。

## 项目结构

```
DuoMaoFF/
├── prisma/            # 数据库模型与种子数据
├── src/
│   ├── app/           # Next.js App Router 路由
│   │   ├── cats/      # 猫咪详情页
│   │   ├── gallery/   # 相册页
│   │   ├── timeline/  # 时间线页
│   │   ├── diary/     # 日记页
│   │   ├── admin/     # 管理后台
│   │   └── api/       # API 路由
│   ├── components/    # React 组件
│   ├── lib/           # 工具函数（Prisma 客户端、认证、EXIF 提取等）
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
├── uploads/           # 上传的媒体文件（不入库）
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npm run db:studio` | 打开 Prisma 数据库管理界面 |
| `npm run db:seed` | 重新导入种子数据 |
