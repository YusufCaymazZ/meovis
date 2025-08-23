# Meovis – Understand Your ML Models, Visually

**Meovis** is an open-source tool that helps you visualize, explain, and compare your machine learning models with clarity — wrapped in a sleek, mascot-powered interface.

Let your models speak. **Meovis** makes it understandable.

---

## What is Meovis?

Meovis is an interactive visual assistant for:

- Visualizing classification performance (Confusion Matrix, ROC-AUC, Precision-Recall)  
- Explaining model predictions with SHAP (feature importances, contributions, dependence plots)  
- Comparing multiple models side-by-side  
- Presenting your ML outputs to non-technical stakeholders in a meaningful way  
- Advanced model analytics and insights

All of this, with a dash of charm and the curiosity of our mascot — **Echo the cat.** 

---

## Features

| Feature                  | Description                                         |
|--------------------------|-----------------------------------------------------|
| Confusion Matrix       | Interactive heatmap with detailed class stats       |
| SHAP Visualizations    | Summary plots, dependence plots, force plots        |
| Model Comparison       | Side-by-side metrics and curves                     |
| Upload & Analyze       | Upload `.pkl`/`.joblib` model and `.csv` datasets   |
| Modern Web Interface   | Built with Next.js and Tailwind CSS                |
| Fast Backend           | FastAPI-powered backend with async support         |
| User Authentication    | JWT-based auth with user management                 |
| Advanced Analytics     | Model performance insights and recommendations      |
| Export Results         | PDF, PNG export with customizable reports          |
| Docker Deployment      | Containerized deployment with Docker Compose       |

---

## Technology Stack

### Backend Technologies

1. **FastAPI** (Python Web Framework)  
   RESTful API development, model loading, and prediction endpoints with automatic docs and async support.

2. **Core ML Libraries**  
   - `scikit-learn`: Model loading, metrics, feature importance  
   - `joblib`: Secure model file loading  
   - `pandas` & `numpy`: Data manipulation and numeric operations  

3. **Explainability Libraries**  
   - `SHAP`, `LIME`, `eli5` for model interpretation  

4. **Visualization & Metrics**  
   - `plotly`, `matplotlib`, `seaborn`, and `scikit-learn.metrics`  

5. **Data Management & Validation**  
   - `Tortoise ORM` + `PostgreSQL` for data storage  
   - `Pydantic v2` for data validation  
   - `Redis` for caching and session storage

6. **Security & Authentication**
   - `JWT` tokens with refresh mechanism
   - `bcrypt` for password hashing
   - `slowapi` for rate limiting
   - CORS protection and security headers

### Frontend Technologies

- **Next.js 14** + TypeScript for responsive UI  
- **Tailwind CSS** + **Shadcn/ui** for modern styling  
- **Recharts** + **D3.js** for rich visualizations  
- **React Dropzone** for file uploads  
- **Zustand** for state management  
- **React Query** for server state management
- **Framer Motion** for animations

### DevOps & Deployment

- **Docker** and **Docker Compose** for containerization
- **GitHub Actions** for CI/CD pipeline
- **Vercel** for frontend deployment
- **Railway/Render** for backend deployment
- **PostgreSQL** for production database
- **Redis** for caching and sessions
- **Sentry** for error tracking and monitoring

### Testing & Quality

- **Backend**: pytest, pytest-asyncio, httpx
- **Frontend**: Vitest, Playwright, Testing Library
- **Code Quality**: Black, isort, Ruff, ESLint, Prettier
- **Git Hooks**: Husky, lint-staged, conventional commits

---

## Preview

*Coming soon: UI screenshots and demo videos!*

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- PostgreSQL (for production)
- Redis (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/YusufCaymazZ/meovis.git
cd meovis

# Backend setup
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend setup (in a separate terminal)
cd ../frontend
npm install
npm run dev
```

### Docker Setup (Production)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Usage

1. **Upload Model**: Drag and drop your `.pkl` or `.joblib` model file
2. **Upload Dataset**: Upload your `.csv` dataset file  
3. **Analyze**: Click "Analyze" to generate insights
4. **Explore**: View confusion matrix, SHAP plots, and feature importance
5. **Compare**: Upload multiple models for side-by-side comparison
6. **Export**: Download results as PDF or PNG

---

## Meet the Mascot: Echo

Echo is a silent analyst.  
It watches, it visualizes, it explains — just like a curious little cat.  
Stay tuned for the mascot launch & theme support!

---

## Development Status

### MVP (Current - 2-3 weeks)
- [x] Basic model upload and analysis
- [x] Confusion matrix visualization
- [x] SHAP summary plots
- [x] Simple web interface
- [x] File validation and error handling
- [x] Basic API endpoints

### Phase 2 (2-3 weeks)
- [ ] User authentication and registration
- [ ] Model history and management
- [ ] Advanced SHAP visualizations
- [ ] Model comparison features
- [ ] Enhanced UI/UX improvements

### Phase 3 (2-3 weeks)
- [ ] Export functionality (PDF, PNG)
- [ ] Advanced analytics and insights
- [ ] Performance optimizations
- [ ] Comprehensive testing suite
- [ ] Docker deployment

### Phase 4 (1-2 weeks)
- [ ] CI/CD pipeline setup
- [ ] Production deployment
- [ ] Monitoring and logging
- [ ] Documentation completion
- [ ] Performance monitoring

---

## Project Structure

```
meovis/
├── apps/
│   ├── backend/              # FastAPI application
│   │   ├── app/
│   │   │   ├── api/          # API routes
│   │   │   ├── core/         # Core configurations
│   │   │   ├── models/       # Database models
│   │   │   ├── services/     # Business logic
│   │   │   └── utils/        # Utility functions
│   │   ├── tests/            # Backend tests
│   │   └── requirements.txt
│   └── frontend/             # Next.js application
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── hooks/        # Custom hooks
│       │   ├── lib/          # Utilities and configs
│       │   ├── pages/        # Next.js pages
│       │   └── types/        # TypeScript types
│       ├── public/           # Static assets
│       └── package.json
├── packages/
│   ├── shared-types/         # Shared TypeScript types
│   └── ui-components/        # Shared UI components
├── docker/
│   ├── docker-compose.yml
│   └── nginx/
├── .github/
│   └── workflows/            # CI/CD workflows
├── docs/                     # Documentation
├── tests/                    # E2E tests
└── README.md
```

---

## Contributing

We welcome all contributions, big or small!  
You can:

- Report issues
- Suggest features
- Improve docs
- Build components or explainers
- Write tests
- Help with deployment

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## Shoutout

Inspired by SHAP, scikit-learn, and every curious cat who asked:  
> _"Why did the model say that?"_

---

## ⭐ Give Meovis a Star!

If you like the project, **give it a ⭐** on GitHub — it helps others discover it too!

