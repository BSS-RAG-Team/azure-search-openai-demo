# Frontend Debugging Guide

This guide helps you debug the React frontend application effectively.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
# Standard mode
npm run dev

# Debug mode (with verbose logging)
npm run dev:debug
```

## Debugging Options

### Option 1: Browser DevTools (Simplest)
1. Start the dev server: `npm run dev`
2. Open http://127.0.0.1:5173 in your browser
3. Press `F12` or `Cmd+Option+I` (Mac) to open DevTools
4. Set breakpoints in the Sources tab
5. Source maps are enabled - you'll see the original TypeScript files

### Option 2: VS Code Debugger
1. Install the "JavaScript Debugger" extension (built-in to VS Code)
2. Start the backend first (Python server on port 50505)
3. Use the Debug panel in VS Code (⇧⌘D)
4. Select one of these configurations:
   - **"Frontend"** - Just start the dev server
   - **"Frontend: Chrome"** - Launch Chrome with debugger attached
   - **"Frontend: Edge"** - Launch Edge with debugger attached
   - **"Full Stack Debug (Chrome)"** - Backend + Frontend + Browser debugging

### Option 3: Console Logging
The enhanced Vite config logs all proxy requests:
- `[Proxy Request]` - Outgoing API calls to backend
- `[Proxy Response]` - Backend responses
- `[Proxy Error]` - Connection errors

## Enhanced Features

### Vite Configuration (`vite.config.ts`)
- ✅ Source maps enabled for debugging
- ✅ CSS source maps for style debugging
- ✅ Detailed proxy logging for API calls
- ✅ Hot Module Replacement (HMR) for instant updates
- ✅ Optimized dependency pre-bundling

### Available Scripts
- `npm run dev` - Start dev server (normal mode)
- `npm run dev:debug` - Start with verbose debugging
- `npm run build` - Production build
- `npm run build:debug` - Development build (with source maps)
- `npm run type-check` - Check TypeScript types without building

## Debugging Common Issues

### 1. API Calls Failing (Backend Not Running)
**Symptom:** Console shows proxy errors like "ECONNREFUSED"
**Solution:** 
```bash
# Start the backend first
cd ../backend
source ../../.venv/bin/activate
python -m quart run --reload -p 50505
```

### 2. Port Already in Use
**Symptom:** "Port 5173 is already in use"
**Solution:**
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

### 3. TypeScript Errors
**Symptom:** Red squiggly lines in VS Code
**Solution:**
```bash
npm run type-check
```

### 4. Breakpoints Not Hitting
**Solutions:**
- Ensure source maps are enabled (already configured)
- Reload the browser after setting breakpoints
- Check that the file path in VS Code matches the browser's Sources tab
- Try using `debugger;` statement directly in code

### 5. Hot Reload Not Working
**Solution:**
```bash
# Clear Vite cache and restart
rm -rf node_modules/.vite
npm run dev
```

## VS Code Extensions Recommended

- **ESLint** - Code quality
- **Prettier** - Code formatting
- **JavaScript Debugger** (built-in)
- **Error Lens** - Inline error display

## Browser DevTools Tips

### React DevTools
Install the React Developer Tools extension for your browser:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

### Network Tab
Monitor API calls:
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click on requests to see headers, payload, and response
4. Right-click → "Copy as fetch" to reproduce in console

### Console Commands
```javascript
// Get all React fiber nodes
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers

// Access the Vite module registry
import.meta.hot

// Check environment
console.log(import.meta.env)
```

## Performance Profiling

### Using React Profiler
```bash
# Build with profiling enabled
npm run dev
```
Then in React DevTools:
1. Go to the Profiler tab
2. Click record
3. Interact with the app
4. Stop recording and analyze

### Using Chrome DevTools Performance Tab
1. Open DevTools → Performance tab
2. Click Record
3. Interact with the app
4. Stop recording
5. Analyze the flame chart

## Environment Variables

Create `.env.local` for local overrides:
```bash
# Example
VITE_API_URL=http://localhost:50505
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Troubleshooting Checklist

- [ ] Node version >= 20.0.0 (`node --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running on port 50505
- [ ] No port conflicts (`lsof -i:5173`)
- [ ] Source maps enabled (check browser DevTools → Sources)
- [ ] CORS not blocking requests (check Network tab)
- [ ] TypeScript compiling (`npm run type-check`)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React DevTools Guide](https://react.dev/learn/react-developer-tools)
- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
