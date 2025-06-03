# 🚀 LearnSnap Deployment Guide

LearnSnap can be deployed on multiple platforms using GitHub Actions. This guide covers troubleshooting common issues and setting up deployments.

## 🔧 **GitHub Actions Status**

Your repository includes several deployment workflows:

- ✅ **Basic Check & Validation**: Always runs, validates project structure
- ⚙️ **CI - Test & Build**: Runs tests and validates the build
- 🚀 **Deploy to Vercel**: Requires secrets setup
- 🚂 **Deploy to Railway**: Requires secrets setup  
- 🎨 **Deploy to Render**: Requires secrets setup
- 🐳 **Docker Build**: Should work without additional setup

## 🐛 **Troubleshooting GitHub Actions Errors**

### **Common Issues & Solutions:**

#### 1. **Missing Secrets Error**
```
Error: Required secret is not set
```
**Solution**: The deployment workflows are designed to skip deployment if secrets aren't configured. This is normal behavior.

#### 2. **npm ci fails**
```
Error: npm ci can only install packages when your package.json and package-lock.json are consistent
```
**Solution**: Delete `package-lock.json` and let the workflow use `npm install` instead.

#### 3. **Permission Errors**
```
Error: Process completed with exit code 1
```
**Solution**: Check if all required files are committed and accessible.

## 🌟 **Recommended Platforms**

### 1. **Vercel** (Easiest Setup)
- ✅ **Free tier available**
- ✅ **Automatic HTTPS** 
- ✅ **Global CDN**
- ✅ **Zero-config deployment**

**Quick Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add `GEMINI_API_KEY` environment variable
4. Deploy automatically

**For GitHub Actions (Optional):**
1. Get Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add to repository secrets:
   - `VERCEL_TOKEN`: Your personal access token
   - `ORG_ID`: Your team/org ID 
   - `PROJECT_ID`: Your project ID

### 2. **Railway** (Great for Full-Stack)
- ✅ **Free tier with databases**
- ✅ **Simple environment setup**
- ✅ **Automatic scaling**

**Quick Setup:**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add `GEMINI_API_KEY` environment variable
4. Deploy automatically

**For GitHub Actions (Optional):**
1. Get Railway token from your dashboard
2. Add `RAILWAY_TOKEN` to repository secrets

### 3. **Render** (Reliable Alternative)
- ✅ **Free tier available**
- ✅ **Built-in SSL**
- ✅ **Custom domains**

**Quick Setup:**
1. Go to [render.com](https://render.com)
2. Create new Web Service from GitHub
3. Add `GEMINI_API_KEY` environment variable
4. Deploy automatically

**For GitHub Actions (Optional):**
1. Get deploy hook URL from service settings
2. Add `RENDER_DEPLOY_HOOK_URL` to repository secrets

### 4. **Docker** (Self-Hosted)
- ✅ **Complete control**
- ✅ **Works anywhere**
- ✅ **No external dependencies**

**Quick Setup:**
```bash
# Build the image
docker build -t learnsnap .

# Run with environment variable
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key_here learnsnap
```

## 🔑 **Environment Variables Setup**

All platforms need one environment variable:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google AI API key | [aistudio.google.com](https://aistudio.google.com) |

## 🛠️ **Manual Deployment (No GitHub Actions)**

If you prefer not to use GitHub Actions:

### **Option 1: Direct Platform Deployment**
Most platforms can deploy directly from your GitHub repository without Actions.

### **Option 2: Local Deployment**
```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/LearnSnap.git
cd LearnSnap
npm install

# Set environment variable
export GEMINI_API_KEY=your_key_here

# Start the application
npm start
```

## 📋 **Repository Secrets Setup**

To enable GitHub Actions deployments, add these secrets in **Settings > Secrets and variables > Actions**:

### **Vercel Secrets:**
- `VERCEL_TOKEN`: Personal access token
- `ORG_ID`: Organization ID  
- `PROJECT_ID`: Project ID

### **Railway Secrets:**
- `RAILWAY_TOKEN`: API token

### **Render Secrets:**
- `RENDER_DEPLOY_HOOK_URL`: Deploy hook URL

## 🎯 **Quick Start Recommendations**

1. **For beginners**: Use Vercel's web interface (no secrets needed)
2. **For full-stack apps**: Use Railway's web interface
3. **For production**: Set up GitHub Actions with proper secrets
4. **For self-hosting**: Use the Docker container

## 🆘 **Still Having Issues?**

1. Check the **Actions** tab in your GitHub repository
2. Look at the **Basic Check & Validation** workflow (should always pass)
3. Other workflows may show "skipped" if secrets aren't configured (this is normal)
4. For platform-specific issues, check their documentation

Remember: The deployment workflows are designed to fail gracefully when secrets aren't configured. This isn't a bug - it's intentional! 🎉

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