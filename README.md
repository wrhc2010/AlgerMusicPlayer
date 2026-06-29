<h2 align="center">🎵 Alger Music Player</h2>
<div align="center">
<div align="center">
  <a href="https://github.com/algerkong/AlgerMusicPlayer/stargazers">
    <img src="https://img.shields.io/github/stars/algerkong/AlgerMusicPlayer?style=for-the-badge&logo=github&label=Stars&logoColor=white&color=22c55e" alt="GitHub stars">
  </a>
  <a href="https://github.com/algerkong/AlgerMusicPlayer/releases">
    <img src="https://img.shields.io/github/v/release/algerkong/AlgerMusicPlayer?style=for-the-badge&logo=github&label=Release&logoColor=white&color=1a67af" alt="GitHub release">
  </a>
  <a href="https://pd.qq.com/s/cs056n33q?b=5">
    <img src="https://img.shields.io/badge/QQ频道-algermusic-blue?style=for-the-badge&color=yellow" alt="加入频道">
  </a>
  <a href="https://t.me/+9efsKRuvKBk2NWVl">
    <img src="https://img.shields.io/badge/AlgerMusic-blue?style=for-the-badge&logo=telegram&logoColor=white&label=Telegram" alt="Telegram">
  </a>
</div>
</div>
<div align="center">
  <a href="https://hellogithub.com/repository/607b849c598d48e08fe38789d156ebdc" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=607b849c598d48e08fe38789d156ebdc&claim_uid=ObuMXUfeHBmk9TI&theme=neutral" alt="Featured｜HelloGitHub" width="160" height="32" /></a>
</div>

[项目下安装以及常用问题文档](https://www.yuque.com/alger-pfg5q/ip4f1a/bmgmfmghnhgwghkm?singleDoc#)

主要功能如下

- 🎵 音乐推荐
- 🔐 账号登录与同步
- 📝 功能
  - 播放历史记录
  - 歌曲收藏管理
  - 歌单 MV 排行榜 每日推荐
  - 自定义快捷键配置（全局或应用内）
- 🎨 界面与交互
  - 沉浸式歌词显示（点击左下角封面进入）
  - 独立桌面歌词窗口
  - 明暗主题切换
  - 迷你模式
  - 状态栏控制
  - 多语言支持
- 🎼 音乐功能
  - 支持歌单、MV、专辑等完整音乐服务
  - 音乐资源解析（基于 @unblockneteasemusic/server）
  - EQ均衡器
  - 定时播放 远程控制播放 倍速播放
  - 高品质音乐
  - 音乐文件下载
  - 搜索 MV 音乐 专辑 歌单 bilibili
  - 音乐单独选择音源解析
- 🚀 技术特性
  - 本地化服务，无需依赖在线API (基于 netease-cloud-music-api)
  - 全平台适配（Desktop & Web & Mobile Web & Android<测试> & ios<后续>）

## 项目简介

一个第三方音乐播放器、本地服务、桌面歌词、音乐下载、最高音质

## 预览地址

[http://music.alger.fun/](http://music.alger.fun/)

## 软件截图

![首页白](./docs/image.png)
![首页黑](./docs/image3.png)
![歌词](./docs/image6.png)
![桌面歌词](./docs/image2.png)
![设置页面](./docs/image4.png)
![音乐远程控制](./docs/image5.png)

## 项目启动

```bash
npm install
npm run dev
```

## Docker 部署

Docker 镜像会提供 AlgerMusicPlayer Web 页面，并在容器内启动内置的 Netease API 与音乐解析服务。默认只需要对外暴露 `4488` 端口，浏览器访问 `http://localhost:4488` 即可打开页面。

### 部署前准备

- 已安装 Docker Engine 或 Docker Desktop。
- Windows 用户需要启用 Docker Desktop 的 WSL2 后端，并确认 Docker Desktop 已启动。
- 服务器防火墙或安全组需要放行你映射的 Web 端口，默认是 `4488`。
- 容器需要能访问外网，否则登录、搜索和音乐解析可能不可用。

### 方式一：使用 GHCR 镜像启动（推荐）

这是最简单的部署方式，不需要下载源码。

```bash
docker pull ghcr.io/wrhc2010/alger-music-player:latest
```

```bash
docker run -d \
  --name alger-music-player \
  --restart unless-stopped \
  -p 4488:4488 \
  ghcr.io/wrhc2010/alger-music-player:latest
```

启动后访问：

```text
http://localhost:4488
```

如果部署在服务器上，把 `localhost` 换成服务器 IP 或域名。

### 方式二：使用 Docker Compose 启动

如果你只想使用 GHCR 镜像，可以新建一个 `docker-compose.yml`：

```bash
mkdir alger-music-player
cd alger-music-player
```

```yaml
services:
  alger-music-player:
    image: ghcr.io/wrhc2010/alger-music-player:latest
    container_name: alger-music-player
    restart: unless-stopped
    ports:
      - "4488:4488"
    environment:
      PORT: 4488
      NCM_API_PORT: 30488
      MUSIC_SOURCES: migu,kugou,kuwo,pyncmd
```

然后启动：

```bash
docker compose up -d
```

如果你已经下载了本项目源码，也可以在源码目录直接运行：

```bash
docker compose up -d --build
```

源码里的 `docker-compose.yml` 同时包含 `image` 和 `build`，适合本地构建或二次开发时使用。

### 方式三：从源码构建镜像

需要本地已经安装 Git 和 Docker。

```bash
git clone https://github.com/wrhc2010/AlgerMusicPlayer.git
cd AlgerMusicPlayer
docker build -t alger-music-player:local .
docker run -d --name alger-music-player --restart unless-stopped -p 4488:4488 alger-music-player:local
```

### 验证部署是否成功

查看容器是否在运行：

```bash
docker ps --filter name=alger-music-player
```

查看启动日志：

```bash
docker logs -f alger-music-player
```

检查健康状态：

```bash
curl http://localhost:4488/healthz
```

Windows PowerShell 也可以使用：

```powershell
Invoke-WebRequest http://localhost:4488/healthz
```

正常情况下会返回类似结果：

```json
{"status":"ok","ncmApi":"ok"}
```

然后在浏览器访问 `http://localhost:4488`。

### 常用管理命令

```bash
docker logs -f alger-music-player
docker restart alger-music-player
docker stop alger-music-player
docker start alger-music-player
docker rm -f alger-music-player
```

### 端口与环境变量

- `4488`: Web 服务对外端口，默认映射为 `4488:4488`。
- `PORT`: 容器内 Web 服务监听端口，默认 `4488`。一般不需要修改。
- `NCM_API_PORT`: 容器内部 Netease API 端口，默认 `30488`。通过同源 `/api` 访问，不需要映射到宿主机。
- `MUSIC_SOURCES`: 音乐解析音源，默认 `migu,kugou,kuwo,pyncmd`。可以按需调整后重启容器。
- `/healthz`: 健康检查接口，会确认 Web 服务和内部 Netease API 均可访问。

如果宿主机的 `4488` 已被占用，可以只修改宿主机端口：

```bash
docker run -d \
  --name alger-music-player \
  --restart unless-stopped \
  -p 8080:4488 \
  ghcr.io/wrhc2010/alger-music-player:latest
```

此时访问 `http://localhost:8080`。

### GHCR 镜像标签

镜像地址：

```bash
ghcr.io/wrhc2010/alger-music-player:latest
```

常用标签：

- `latest`: 最新构建镜像。
- 分支名标签：例如 `main` 或 `feat-docker-ghcr`。
- 提交 SHA 标签：例如 `sha-xxxxxxx`。

普通部署建议使用 `latest`。如果需要固定版本，可以改用具体的提交 SHA 标签。

### 更新镜像

使用 `docker run` 部署时：

```bash
docker pull ghcr.io/wrhc2010/alger-music-player:latest
docker rm -f alger-music-player
docker run -d \
  --name alger-music-player \
  --restart unless-stopped \
  -p 4488:4488 \
  ghcr.io/wrhc2010/alger-music-player:latest
```

使用 Docker Compose 部署时：

```bash
docker compose pull
docker compose up -d
```

### 常见问题

- Docker 命令无响应：确认 Docker Desktop 已启动。Windows 用户还需要安装并启用 WSL2。
- 端口被占用：把宿主机端口改为其他端口，例如 `-p 8080:4488`，然后访问 `http://localhost:8080`。
- 无法从外部访问：确认服务器防火墙、安全组或路由器已经放行宿主机端口。
- `/healthz` 不是 `ok`：先执行 `docker logs -f alger-music-player` 查看日志，并确认容器可以访问外网。
- 登录或搜索失败：确认浏览器访问的是容器 Web 页面，接口请求应走同源 `/api`，不需要单独访问 `30488`。
- 音乐解析失败：解析依赖上游音源可用性，可以调整 `MUSIC_SOURCES` 后重启容器。
- GHCR 拉取失败：确认镜像已发布；如果环境要求登录，先执行 `docker login ghcr.io` 后再拉取。

## 开发文档

点击这里[开发文档](./DEV.md)

## 项目统计

[![Stargazers over time](https://starchart.cc/algerkong/AlgerMusicPlayer.svg?variant=adaptive)](https://starchart.cc/algerkong/AlgerMusicPlayer)
![Alt](https://repobeats.axiom.co/api/embed/c4d01b3632e241c90cdec9508dfde86a7f54c9f5.svg 'Repobeats analytics image')

## 欢迎提Issues

## 声明

本软件仅用于学习交流，禁止用于商业用途，否则后果自负。
希望大家还是要多多支持官方正版，此软件仅用作开发教学。
