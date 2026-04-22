# 使用官方Node.js运行时作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口（根据你的应用配置）
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]