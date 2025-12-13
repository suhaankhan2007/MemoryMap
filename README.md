# MemoryMap

This app was created to help users learn more about memory management in C++. Many college students, highschool students and others alike struggle with understanding memory errors in their code as they can often by ambigious. Using MemoryMap will help you map out your thought process and see what's actually happening in the heap and the stack! 

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

The app is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

**Manual Deployment:**
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Ensure your hosting provider is configured for SPA routing (all routes redirect to `index.html`)

**Vercel Configuration:**
- The `vercel.json` file is already configured for SPA routing
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Launch MemoryMap now to get started. 