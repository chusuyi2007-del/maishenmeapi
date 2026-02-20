# MaiShenme 后端代理

## 本地测试

```bash
npm install
ANTHROPIC_API_KEY=sk-ant-xxx node server.js
```

访问 http://localhost:3000 确认返回 `{"status":"ok"}`

---

## 部署到 Railway（推荐，免费）

1. 去 https://railway.app 注册（用GitHub登录最快）

2. 点 **New Project → Deploy from GitHub repo**
   - 上传这个文件夹到GitHub，或者直接用 Railway 的 "Deploy from template"

3. 在 Railway 项目里，进 **Variables** 标签，添加：
   ```
   ANTHROPIC_API_KEY = sk-ant-你的key
   ```

4. 部署完成后，Railway 会给你一个域名，比如：
   ```
   https://maishenme-api-production.up.railway.app
   ```

5. 把这个域名填到前端 HTML 文件里的 `PROXY_URL` 变量

---

## 部署到 Render（也免费）

1. 去 https://render.com 注册

2. New → Web Service → 连接 GitHub 仓库

3. 设置：
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variable: `ANTHROPIC_API_KEY = sk-ant-你的key`

4. 部署后拿到域名填入前端

---

## 前端配置

打开 `maishenme_v9.html`，找到这一行：

```js
async function callClaude(messages, system, maxTokens = 1200) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
```

改成你的代理地址：

```js
async function callClaude(messages, system, maxTokens = 1200) {
  const res = await fetch('https://你的railway域名.up.railway.app/api/claude', {
```

然后删掉 headers 里的 `'x-api-key'` 那一行（key在服务器，前端不需要）。

---

## 费用估算

- Railway 免费额度：每月 $5 credits，够轻量使用
- Anthropic API：claude-sonnet 约 $3/百万输入token，日常使用几块钱/月
- 总计：轻量使用基本免费
