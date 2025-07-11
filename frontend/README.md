# Meovis Frontend

Modern React TypeScript frontend for MLVisKit - Machine Learning Model Visualization Tool.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── ModelAnalysisPage.tsx  # Model upload & analysis
│   └── ComparisonPage.tsx     # Model comparison
├── services/           # API services
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Material-UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **React Dropzone** - File uploads
- **Plotly.js** - Interactive charts
- **Framer Motion** - Animations

## 🔧 Configuration

### Vite Config
- Development server on port 3000
- API proxy to backend (localhost:8000)
- Path aliases configured (@/ points to src/)

### TypeScript
- Strict mode enabled
- Path mapping configured
- Modern ES2020 target

## 🎨 Styling

- Material-UI theme system
- Custom CSS for global styles
- Responsive design
- Dark/light mode support

## 📱 Features

- ✅ Responsive design
- ✅ File upload (drag & drop)
- ✅ Interactive charts
- ✅ Modern UI/UX
- ✅ Type safety
- ✅ Error handling
- ✅ Loading states

## 🔗 Backend Integration

The frontend is configured to communicate with the FastAPI backend:
- API proxy: `/api/*` → `http://localhost:8000`
- File uploads for models (.pkl, .joblib) and data (.csv)
- Real-time data visualization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker
```bash
docker build -t meovis-frontend .
docker run -p 3000:3000 meovis-frontend
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Material-UI components
3. Add proper error handling
4. Write tests for new features
5. Follow the existing code style

## 📄 License

MIT License - see main project README for details. 