# Linux / Docker / frp 部署与媒体保存

## 文件究竟存在哪里

原文件与缩略图存放于 Linux 物理机上由 Docker 管理的 `uploads_data` 卷，挂载在容器 `/app/uploads`。SQLite 数据库保存文件路径、拍摄时间、猫咪关联、描述等索引，位于 `prisma_data` 卷中的数据库文件。两者必须配套保留。

访问链路：浏览器 → 公网 HTTPS 反向代理 → frp → Linux 上的 Next.js → 持久卷。frp 负责转发，不保存你的照片。公网访问速度取决于物理机上行、云服务器带宽和中间代理。

文件访问地址为 `/DuoMaoFF/uploads/文件名`。新图片自动生成 WebP 缩略图；原文件保留上传字节，不改写。视频通过 HTTP Range 按段读取，浏览器支持的编码才能播放；推荐 H.264/AAC 的 MP4。不支持的 MOV 编码可下载原文件。本轮不包含转码和断点续传。

## 升级已有部署：先核查，后改路径

**不要对现有站点直接重新初始化数据库。** 旧 compose 的 `file:./prisma/dev.db` 是相对路径，可能实际解析到 `/app/prisma/prisma/dev.db`。应先查看运行容器的 `DATABASE_URL`，并核实磁盘上哪个文件包含已有记录。

```sh
docker compose exec web printenv DATABASE_URL
docker compose exec web sh -c 'ls -lah /app/prisma /app/prisma/prisma /app/uploads 2>/dev/null'
docker inspect "$(docker compose ps -q web)" --format '{{json .Mounts}}'
```

确认后在 `.env` 写入现有数据库的**绝对路径**，例如 `DATABASE_URL=file:/app/prisma/prisma/dev.db`。本次未改变数据库表结构，可直接沿用原数据库。不要为统一名字去覆盖、移动或新建现有数据库；路径修改错误可能看起来像“数据全没了”。

先做下述备份，再更新镜像。旧卷如果由 root 创建，检查权限并仅对已确认的 `/app/prisma` 和 `/app/uploads` 设置 UID/GID 1001 的读写权限。新镜像中的目录已按此用户创建，现有卷的权限不会因重建镜像自动修正。

## 首次部署

复制 `.env.example` 为 `.env`，设置：

```dotenv
DATABASE_URL="file:/app/prisma/dev.db"
NEXTAUTH_URL="https://你的公网域名/DuoMaoFF/api/auth"
NEXTAUTH_SECRET="替换为足够长的随机字符串"
ADMIN_USERNAME="你的管理员名"
ADMIN_PASSWORD="首次初始化使用的强密码"
MAX_FILE_SIZE=52428800
```

生成密钥可使用 `openssl rand -base64 32`。生产环境不要保留示例密钥和密码。反向代理必须正确传递 Host、X-Forwarded-Proto，HTTPS 终止于公网代理时也应将外部协议传给服务。

```sh
# 仅全新、空数据库执行一次；setup 会写入示例猫咪与日记。
docker compose --profile setup run --rm init
docker compose up -d --build web
```

主页是 `https://你的公网域名/DuoMaoFF`，后台是 `/DuoMaoFF/admin`。生产容器用 standalone 的 `server.js` 启动。不要在已有数据上重复 `setup`（种子日记会重复写入）；日常更新只构建、重启 web。

## 上传限制与大文件

默认单文件上限 50 MiB，前后端读取同一个 `MAX_FILE_SIZE`。多文件按顺序上传并显示各自结果。100% 表示网络传输完成；只有服务器完成文件写入和数据库登记，才显示“原文件已保存，索引已登记”。失败会显示原因，正常失败路径清理本次临时文件。

Next.js 的 multipart 解析仍会占用与单次请求大小相关的内存。接口限制实际接收字节数，但多管理员并行上传会叠加内存。不要不加评估地把上限调到几个 GB。大量大视频建议后续增加分片上传/断点续传与转码任务。

如果公网前面有 Nginx，可在现有站点的对应 location 内参考下面的参数（将请求继续转发至你**现有的 frp 上游**，保留 `/DuoMaoFF` 路径）：

```nginx
client_max_body_size 52m;  # 50 MiB 文件 + multipart 开销
client_body_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
proxy_request_buffering off;
```

若应用上限提高，所有中间代理的限制也要同步调整。这里的超时是传输/读取间隔相关设置，不是任意文件都能在指定时长完成的保证。不要给上传 location 添加会修改 Range 的规则；上线后测试视频拖动。

## 备份与恢复

持久卷可以承受容器重建，但不防硬盘故障、误删卷、磁盘写满或管理员删除原文件。**不要使用 `docker compose down -v`，也不要清理这两个数据卷。** 改变 compose 项目名称/工作目录可能创建另一组空卷，上线前核对实际挂载。

个人站点可以短暂停写，备份整份数据库目录及 uploads。以下示例需要在当前 compose 项目目录运行，并确保没有其他进程写同一数据库：

```sh
backup_dir="./backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
docker compose stop web
docker compose cp web:/app/prisma "$backup_dir/prisma"
docker compose cp web:/app/uploads "$backup_dir/uploads"
docker compose start web
```

逐项确认复制成功，再将备份复制到另一块硬盘或另一台机器。数据库目录包含可能存在的 SQLite journal/WAL 文件，停写后整目录备份避免只复制活动数据库导致不一致。备份不是公开静态资源，不要放入 `public` 或 `uploads`。记录当时的 `DATABASE_URL`、卷名和部署版本。

恢复时先停止 web，把选定快照的数据库和 uploads **一起**恢复至已确认的数据卷/空目录，核对路径与 UID 1001 权限，再启动。不要在运行中的数据库上直接覆盖文件。上线前在隔离目录验证恢复，确认媒体总数、打开数张原图、播放一个视频。

## 验收清单

1. 公网登录后台，分别上传 JPG/PNG 与 MP4，等待逐文件成功提示。
2. 从相册打开原图和视频，刷新浏览器仍能查看；拖动视频进度条，网络响应应支持 206。
3. `docker compose restart web` 后重新查看相同原图和视频。
4. 核查 uploads 卷里确有原文件，数据库有对应索引；定期检查磁盘可用空间。
5. 验证备份可恢复。遇到网络中断、响应丢失时先刷新列表核对，再决定是否重传，避免重复收藏。

文件系统与数据库不能构成一个跨系统原子事务。进程被强杀可能留下未登记的 `.part` 或孤立文件；它们不会通过文件读取接口公开。排查时先备份并核对索引，不要盲目清理。当前实现保证正常成功响应之前先写原文件再写数据库，但不能承诺任何故障下永不丢失。

## 本地验证

使用独立 `.test-data/preview.db` 和 `.test-data/uploads`，不要使用生产数据库。测试账号为 `preview-admin` / `preview-local-only`，仅用于本地隔离实例。启动构建版本于 localhost:3100 后，运行 `node scripts/smoke-media.mjs` 可验证登录、上传原文件 SHA-256、缩略图、Range、非法图片和分页。脚本保留测试上传文件供重启验证。

参考：[SQLite 适用场景](https://www.sqlite.org/whentouse.html)、[Next.js 基础路径](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath)。
