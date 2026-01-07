# Medical Dashboard

A modern medical dashboard built with React, TypeScript, and Tailwind CSS. Perfect for healthcare professionals who need a clean interface for patient management and analytics.

## Features

- Dashboard with key medical metrics
- Patient management system
- Interactive charts and analytics
- Responsive design with collapsible sidebar
- Clean, professional UI

## Tech Stack

- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── data/          # Mock data
└── types/         # TypeScript definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## Pages

- **Dashboard** - Overview and metrics
- **Patients** - Patient management
- **Analytics** - Charts and reports
- **Settings** - App configuration

## Deployment to GitHub Pages

### Prerequisites
1. Your backend API must be deployed to a cloud service (Azure, AWS, Heroku, etc.)
2. Your GitHub repository name (for base path configuration)

### Steps

1. **Deploy your backend API** to a cloud service and get the production URL (e.g., `https://your-api.azurewebsites.net`)

2. **Set the production API URL** when building:
   ```bash
   VITE_PROD_API_URL=https://your-api.azurewebsites.net/api npm run deploy
   ```
   
   Or set it as an environment variable:
   ```bash
   export VITE_PROD_API_URL=https://your-api.azurewebsites.net/api
   npm run deploy
   ```

3. **Update the base path** in `package.json` if your repository name is different:
   - Edit the `build:gh-pages` script
   - Change `/Medical-Dashboard/` to match your repository name
   - Example: If your repo is `medical-dashboard`, use `/medical-dashboard/`

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### Important Notes

- **Base Path**: The base path in `package.json` must match your GitHub repository name exactly
- **API URL**: The production API URL must be set during build time
- **CORS**: Ensure your backend API allows requests from your GitHub Pages domain
- **HTTPS**: Production API should use HTTPS for security

### Troubleshooting

- **404 errors for CSS/JS files**: Check that the base path matches your repository name
- **API connection errors**: Verify the `VITE_PROD_API_URL` is set correctly and your backend is deployed
- **CORS errors**: Update your backend CORS configuration to allow your GitHub Pages domain

---

**Note**: This is a demo project with mock data. For production use in healthcare, ensure compliance with relevant regulations.
