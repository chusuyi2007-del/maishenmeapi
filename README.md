# MaiShenme API

留学生食材匹配助手 - 后端 API 服务

## 当前配置

- `/api/gemini` - Gemini 2.0 Flash API（需要 `GEMINI_API_KEY`）
- `/api/places` - Google Places API（需要 `GOOGLE_API_KEY`）
- `/api/location` - IP 定位服务

## 本地测试

```bash
npm install
npx vercel dev
```

## 部署到 Vercel

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量：
   - `GEMINI_API_KEY` - Google AI Studio 获取
   - `GOOGLE_API_KEY` - Google Cloud Console 获取（可选）
3. 部署

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `GEMINI_API_KEY` | 是 | Gemini API 密钥 |
| `GOOGLE_API_KEY` | 否 | Google Places API 密钥 |

## 获取 API Key

- **Gemini**: https://aistudio.google.com/apikey
- **Google Places**: https://console.cloud.google.com/apis/credentials
