# Deployment Instructions

This document provides step-by-step instructions for deploying the frontend and backend services of the AgriSmart application.

## Frontend Deployment (Vercel/Netlify)

The frontend is a standard Vite-based React application and can be deployed to any modern static hosting provider.

### Prerequisites

- A Vercel or Netlify account.
- The project's `frontend/` directory pushed to a GitHub, GitLab, or Bitbucket repository.

### Vercel Deployment Steps

1.  **Import Project**: Log in to your Vercel account and click "Add New..." > "Project".
2.  **Connect Git Repository**: Select your Git provider and choose the repository containing your project.
3.  **Configure Project**:
    - **Root Directory**: Set this to `frontend`.
    - **Build Command**: `npm run build` (or `vite build`).
    - **Output Directory**: `dist`.
    - **Install Command**: `npm install`.
4.  **Environment Variables**: Add your backend API URL as an environment variable. For example:
    - `VITE_API_URL=https://your-backend-service-url.onrender.com`
5.  **Deploy**: Click "Deploy". Vercel will automatically build and deploy your frontend.

### Netlify Deployment Steps

1.  **Add New Site**: Log in to Netlify and click "Add new site" > "Import an existing project".
2.  **Connect Git Provider**: Choose your Git provider and select the project repository.
3.  **Deployment Settings**:
    - **Base directory**: `frontend`.
    - **Build command**: `npm run build`.
    - **Publish directory**: `frontend/dist`.
4.  **Environment Variables**: Go to "Site settings" > "Build & deploy" > "Environment" and add your backend API URL:
    - `VITE_API_URL=https://your-backend-service-url.onrender.com`
5.  **Deploy Site**: Click "Deploy site". Netlify will handle the build and deployment process.

## Backend Deployment (Render/Railway)

The backend is a Python FastAPI application. Render and Railway are excellent platforms for deploying it.

### Prerequisites

- A Render or Railway account.
- The project's `backend/` directory pushed to a Git repository.

### Render Deployment Steps

1.  **Create a New Web Service**: In your Render dashboard, click "New +" > "Web Service".
2.  **Connect Repository**: Select your Git repository.
3.  **Configuration**:
    - **Name**: Give your service a name (e.g., `agrismart-backend`).
    - **Root Directory**: `backend`.
    - **Environment**: `Python 3`.
    - **Build Command**: `pip install -r requirements.txt`.
    - **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`.
4.  **Environment Variables**: Go to the "Environment" tab and add the contents of your `.env` file. **Do not commit your `.env` file to Git.**
    - `OPENWEATHERMAP_API_KEY=your_key`
    - `GEOAPIFY_API_KEY=your_key`
    - `SUPABASE_URL=your_supabase_url`
    - `SUPABASE_ANON_KEY=your_supabase_key`
    - etc.
5.  **Create Web Service**: Click "Create Web Service". Render will build and deploy your backend.

### Railway Deployment Steps

1.  **Create a New Project**: In your Railway dashboard, click "New Project" and select "Deploy from GitHub repo".
2.  **Select Repository**: Choose your project repository.
3.  **Configure Service**:
    - Railway will automatically detect the Python environment. If it doesn't, you may need to add a `railway.json` or `Procfile`.
    - **Root Directory**: In the service settings, set the "Root Directory" to `backend`.
4.  **Define Start Command**: Go to the "Deployments" tab and set the start command:
    - `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --host 0.0.0.0 --port $PORT`
5.  **Add Environment Variables**: Go to the "Variables" tab and add the contents of your `.env` file.
6.  **Deploy**: Railway will automatically deploy upon commit to your main branch.

## Final Steps

- **Update Frontend**: Once your backend is deployed, take its public URL and update the `VITE_API_URL` environment variable in your frontend deployment settings.
- **CORS**: Ensure your backend's `CORS_ORIGINS` in your `.env` file includes your deployed frontend's URL.
