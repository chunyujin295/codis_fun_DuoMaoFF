# 多毛记 (DuoMaoFF)

<p align="center">
  <img src="./doc/img/icon.png" alt="icon" width="200">
</p>

一个杂志风格的猫咪展示网站，用于展示多多和毛毛两只小猫的照片、视频和成长故事。

现采用“私人猫咪收藏册”视觉：奶油纸张、猫爪印章、荧光贴纸与照片收藏。媒体原文件保存在 Linux 硬盘持久卷，SQLite 保存索引。

**Linux / Docker / frp 部署、已有数据升级和备份：请先阅读 [部署与媒体保存说明](docs/deployment.md)。** 线上已有数据库不要重复执行 setup；更新前先核查数据库绝对路径并备份数据库与 uploads。

## 功能

- **猫咪介绍** - 展示每只猫的个人信息与性格特点
- **媒体相册** - 照片/视频的瀑布流展示，支持灯箱查看
- **视频缩略图** - 上传视频自动生成预览帧
- **时间线** - 根据 EXIF 日期自动组织的成长时间线
- **小猫日记** - 记录猫咪的日常趣事和成长点滴
- **管理后台** - 登录后上传和管理媒体内容、编辑猫咪资料

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **后端**: Next.js API Routes + NextAuth
- **数据库**: Prisma ORM + SQLite
- **部署**: Docker

## 环境要求

- Node.js >= 18
- npm >= 9
- ffmpeg（视频缩略图生成）
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

### 首次部署

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 NEXTAUTH_URL、NEXTAUTH_SECRET、ADMIN_PASSWORD 等

# 2. 初始化数据库（仅首次执行）
docker compose --profile setup run --rm init

# 3. 启动服务
docker compose up -d --build
```

### 日常更新

```bash
# 拉取最新代码后，重新构建并启动
docker compose up -d --build
```

### 重启服务（不重新构建）

```bash
docker compose restart web
```

### 查看日志

```bash
docker compose logs -f web
```

### 停止服务

```bash
docker compose down
```

> **注意**：`docker compose down -v` 会删除数据卷（数据库和上传文件），请勿使用。

## 管理后台

访问 `/admin/login` 进行登录。

功能模块：
- **仪表板** - 数据统计与快捷操作
- **媒体管理** - 上传、删除照片/视频，支持批量上传
- **日记管理** - 编写、编辑、删除猫咪日记
- **猫咪管理** - 编辑猫咪资料（名字、毛色、性格、介绍、头像等）

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

### 本地开发

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npm run setup` | 初始化数据库（仅首次） |
| `npm run db:studio` | 打开 Prisma 数据库管理界面 |

### Docker

| 命令 | 说明 |
|------|------|
| `docker compose up -d --build` | 构建并启动服务 |
| `docker compose restart web` | 重启服务（不重建） |
| `docker compose logs -f web` | 查看实时日志 |
| `docker compose down` | 停止服务 |
| `docker compose --profile setup run --rm init` | 初始化数据库（仅首次） |
