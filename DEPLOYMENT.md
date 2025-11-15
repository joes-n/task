# Deployment Guide

This guide covers deploying the Task Management System to various cloud platforms.

## Quick Start: Railway Deployment (Recommended)

Railway offers simple deployment with automatic MongoDB provisioning.

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Visit [Railway](https://railway.app) and sign up
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect Node.js and deploy

3. **Add MongoDB Database**
   - In your Railway project, click "New"
   - Select "Database" → "Add MongoDB"
   - Railway will provision a MongoDB instance and set the `MONGODB_URI` automatically

4. **Set Environment Variables**
   - Go to your project's Variables tab
   - Add:
     ```
     SESSION_SECRET=your-very-secure-random-secret-key
     PORT=3000
     ```

5. **Deploy**
   - Railway will automatically deploy when you push to GitHub
   - Your app will be available at the provided Railway URL

## Alternative Platforms

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku

   # Ubuntu
   sudo snap install heroku --classic
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add MongoDB**
   - Option A: Use MongoDB Atlas (see MongoDB Atlas section below)
   - Option B: Use MongoDB Add-on
     ```bash
     heroku addons:create mongolab:sandbox
     ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SESSION_SECRET=your-secret-key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Render

1. **Create Render Account**
   - Visit [Render](https://render.com) and sign up

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   - In the dashboard, go to Environment tab
   - Add:
     ```
     MONGODB_URI=mongodb+srv://...
     SESSION_SECRET=your-secret-key
     PORT=3000
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Option 3: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables**
   - Visit Vercel dashboard
   - Go to your project → Settings → Environment Variables
   - Add all required variables

## MongoDB Atlas Setup (Required for Cloud Deployment)

### Steps

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select a cloud provider (AWS, Azure, or GCP)
   - Choose a region
   - Create cluster

3. **Configure Access**
   - Create a database user:
     - Username: Choose a username
     - Password: Generate a secure password
   - Add IP addresses:
     - Click "Add IP Address"
     - Select "Allow access from anywhere" (0.0.0.0/0) for testing
     - In production, add specific IP ranges

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with your database name (e.g., "taskmanager")

5. **Use in Application**
   - Add the connection string to your cloud platform's environment variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
     ```

## Environment Variables Reference

All platforms require these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster/mydb` |
| `SESSION_SECRET` | Secret for session encryption | `random-256-bit-string` |
| `PORT` | Port to run the server | `3000` |

### Generating a Secure SESSION_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## Post-Deployment Checklist

- [ ] Test login/registration functionality
- [ ] Test creating, editing, and deleting tasks
- [ ] Test API endpoints using curl or Postman
- [ ] Verify MongoDB connection is working
- [ ] Check all environment variables are set correctly
- [ ] Test from multiple devices/browsers
- [ ] Update CORS settings if needed
- [ ] Set up monitoring and alerts

## Troubleshooting

### Application Won't Start

1. **Check logs** on your cloud platform
2. **Verify environment variables** are set correctly
3. **Ensure MongoDB connection string** is valid
4. **Check PORT** - use the port provided by the platform

### Database Connection Errors

1. **Verify MongoDB Atlas IP whitelist** includes your cloud platform's IP
2. **Check connection string** format and credentials
3. **Ensure database user** has proper permissions

### Session Issues

1. **Verify SESSION_SECRET** is set to a strong, random value
2. **Check session configuration** in server.js

### API Not Working

1. Test with curl:
   ```bash
   curl https://your-app-url.railway.app/api/tasks
   ```
2. Check if the endpoint returns JSON
3. Verify route is not protected (APIs don't require authentication)
