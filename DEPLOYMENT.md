# 🚀 LearnSnap Deployment Guide

LearnSnap can be deployed on multiple platforms using GitHub Actions. Choose the platform that best fits your needs.

## 🌟 **Recommended Platforms**

### 1. **Vercel** (Recommended for quick deployment)
- ✅ **Free tier available**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Easy domain setup**

**Setup:**
1. Connect your GitHub repo to Vercel
2. Add `GEMINI_API_KEY` to Vercel environment variables
3. Deploy automatically on push to main

### 2. **Railway** (Great for databases)
- ✅ **Free tier with databases**
- ✅ **Easy scaling**
- ✅ **Built-in monitoring**
- ✅ **Simple environment management**

### 3. **Render** (Reliable alternative)
- ✅ **Free tier available**
- ✅ **Automatic deploys**
- ✅ **Custom domains**
- ✅ **Built-in SSL**

### 4. **Docker** (Self-hosted)
- ✅ **Complete control**
- ✅ **Portable deployment**
- ✅ **Kubernetes ready**
- ✅ **Local development**

## 🔧 **Setup Instructions**

### **Vercel Deployment**

1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel --prod
   ```

2. **Environment Variables:**
   - `GEMINI_API_KEY`: Your Google AI API key
   - `NODE_ENV`: production

3. **Automatic Deployment:**
   - Push to `main` branch
   - GitHub Action will deploy automatically

### **Railway Deployment**

1. **Setup Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway deploy
   ```

2. **Required Secrets:**
   - `RAILWAY_TOKEN`: Get from Railway dashboard
   - `RAILWAY_SERVICE`: Your service ID

### **Render Deployment**

1. **Connect Repository:**
   - Go to Render dashboard
   - Connect your GitHub repo
   - Set up auto-deploy

2. **Required Secrets:**
   - `RENDER_DEPLOY_HOOK_URL`: Get from Render service settings

### **Docker Deployment**

1. **Build Image:**
   ```bash
   docker build -t learnsnap .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 \
     -e GEMINI_API_KEY=your_key_here \
     -e NODE_ENV=production \
     learnsnap
   ```

3. **Docker Compose:**
   ```yaml
   version: '3.8'
   services:
     learnsnap:
       build: .
       ports:
         - "3000:3000"
       environment:
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
       volumes:
         - ./uploads:/app/uploads
         - ./flashcards:/app/flashcards
   ```

## 🔐 **Environment Variables**

### **Required:**
- `GEMINI_API_KEY`: Your Google AI API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### **Optional:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (default: development)

## 🔒 **GitHub Secrets Setup**

For automatic deployment, add these secrets to your GitHub repository:

### **For Vercel:**
- `VERCEL_TOKEN`: Personal access token from Vercel
- `ORG_ID`: Organization ID from Vercel
- `PROJECT_ID`: Project ID from Vercel

### **For Railway:**
- `RAILWAY_TOKEN`: API token from Railway dashboard
- `RAILWAY_SERVICE`: Service ID from Railway

### **For Render:**
- `RENDER_DEPLOY_HOOK_URL`: Deploy hook URL from Render service

## 🚀 **Manual Deployment Steps**

### **1. Clone and Setup:**
```bash
git clone https://github.com/YOUR_USERNAME/learning.git
cd learning
npm install
```

### **2. Environment Setup:**
```bash
cp env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### **3. Start Application:**
```bash
npm start
# App runs on http://localhost:3000
```

## 🔍 **Health Checks**

All deployments include health checks:
- **Endpoint:** `GET /`
- **Expected:** HTTP 200 response
- **Docker:** Built-in health check every 30s

## 📊 **Monitoring**

### **Application Logs:**
- Check platform dashboards for logs
- Monitor API usage in Google AI Studio
- Track user uploads and deck creation

### **Performance:**
- Monitor response times
- Check memory usage
- Monitor file upload sizes

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **API Key Not Working:**
   - Verify key is correct
   - Check API quotas in Google AI Studio
   - Ensure key has proper permissions

2. **File Uploads Failing:**
   - Check file size limits (100MB max)
   - Verify disk space on deployment platform
   - Check network timeouts

3. **Build Failures:**
   - Verify Node.js version compatibility
   - Check npm dependencies
   - Review build logs

### **Platform-Specific Issues:**

**Vercel:**
- Function timeout (30s max)
- Memory limits (1GB max on free tier)
- File size limits

**Railway:**
- Free tier limitations
- Database connection issues
- Resource quotas

**Render:**
- Build time limits
- Free tier sleep mode
- Static file serving

## 📈 **Scaling Considerations**

### **For High Traffic:**
1. **Use CDN** for static assets
2. **Implement caching** for AI responses
3. **Add load balancing** for multiple instances
4. **Monitor API rate limits**
5. **Consider premium tiers** on hosting platforms

### **Database Considerations:**
- Current: File-based storage
- Future: PostgreSQL/MongoDB for persistence
- Backup strategies for user data

## 🔄 **CI/CD Pipeline**

The included GitHub Actions provide:
- ✅ **Automated testing** on pull requests
- ✅ **Security scanning** with npm audit
- ✅ **Multi-platform deployment**
- ✅ **Docker image building**
- ✅ **Automatic versioning** with git tags

## 🎯 **Production Checklist**

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Custom domain setup (optional)
- [ ] Monitoring and logging configured
- [ ] Backup strategy for user data
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] API key rotation plan

---

**Need help?** Check the [troubleshooting guide](./README.md#troubleshooting) or open an issue on GitHub. 