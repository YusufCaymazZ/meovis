# 🤝 Contributing to Meovis

Thank you for your interest in contributing to **Meovis**! 🐾

This document provides guidelines and information for contributors who want to help improve Meovis.

---

## 🎯 How to Contribute

There are many ways to contribute to Meovis:

### 🐛 **Report Bugs**
- Use the [GitHub Issues](https://github.com/yourname/meovis/issues) page
- Include detailed steps to reproduce the bug
- Add screenshots or error messages if applicable
- Specify your environment (OS, browser, etc.)

### 🧠 **Suggest Features**
- Open a new issue with the "Feature Request" label
- Describe the feature and its benefits
- Include mockups or examples if possible
- Explain how it fits into Meovis's vision

### 👩‍💻 **Code Contributions**
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

### ✍️ **Documentation**
- Improve README.md
- Add code comments
- Write tutorials or guides
- Translate documentation

### 🧪 **Testing**
- Write unit tests
- Test on different browsers/devices
- Report performance issues
- Help with CI/CD improvements

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- Basic knowledge of FastAPI, React, and TypeScript

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/meovis.git
   cd meovis
   ```

2. **Backend Setup**
   ```bash
   cd apps/backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Database Setup** (for development)
   ```bash
   # SQLite is used by default for development
   # No additional setup required
   ```

---

## 📝 Development Guidelines

### Code Style

#### Python (Backend)
- Use **Black** for code formatting
- Use **isort** for import sorting
- Use **Ruff** for linting
- Follow **PEP 8** conventions
- Use type hints where possible

```bash
# Format code
black .
isort .
ruff check .
```

#### TypeScript/JavaScript (Frontend)
- Use **Prettier** for formatting
- Use **ESLint** for linting
- Follow **TypeScript** best practices
- Use **React Hooks** patterns

```bash
# Format code
npm run format
npm run lint
```

### Git Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   # Use conventional commits
   git commit -m "feat: add new model comparison feature"
   git commit -m "fix: resolve file upload issue"
   git commit -m "docs: update API documentation"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat: add SHAP dependence plots
fix(backend): resolve model loading error
docs: update installation guide
test: add unit tests for model validation
```

---

## 🏗️ Project Structure

### Backend Structure
```
apps/backend/
├── app/
│   ├── api/              # API routes
│   │   ├── models.py     # Model upload/analysis endpoints
│   │   ├── datasets.py   # Dataset upload endpoints
│   │   └── auth.py       # Authentication endpoints
│   ├── core/             # Core configurations
│   │   ├── config.py     # Settings and environment
│   │   └── security.py   # Security utilities
│   ├── models/           # Database models
│   │   ├── ml_model.py   # ML model entity
│   │   └── dataset.py    # Dataset entity
│   ├── services/         # Business logic
│   │   ├── ml_service.py # ML analysis service
│   │   └── viz_service.py # Visualization service
│   └── utils/            # Utility functions
├── tests/                # Test files
└── requirements.txt      # Python dependencies
```

### Frontend Structure
```
apps/frontend/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── charts/      # Chart components
│   │   └── forms/       # Form components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configs
│   ├── pages/           # Next.js pages
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json         # Node.js dependencies
```

---

## 🧪 Testing Guidelines

### Backend Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_ml_service.py

# Run with verbose output
pytest -v
```

### Frontend Testing
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Test Requirements
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and data flow
- **E2E Tests**: Test complete user workflows
- **Coverage**: Aim for >80% code coverage

---

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Create a Clear Title**
   - Use conventional commit format
   - Be descriptive but concise

2. **Write a Detailed Description**
   - Explain what the PR does
   - Include screenshots for UI changes
   - Link related issues

3. **Checklist**
   - [ ] Code follows style guidelines
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No console errors
   - [ ] Responsive design tested

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review the code
3. **Approval**: At least one maintainer must approve
4. **Merge**: PR is merged to main branch

---

## 🐛 Bug Reports

### Template for Bug Reports
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. Windows 10, macOS, Ubuntu]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

---

## 💡 Feature Requests

### Template for Feature Requests
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternative Solutions**
Any alternative solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

---

## 📚 Documentation

### Writing Documentation
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date

### Documentation Structure
```
docs/
├── api/              # API documentation
├── guides/           # User guides
├── development/      # Developer guides
└── deployment/       # Deployment guides
```

---

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity**: Clean, uncluttered interface
- **Accessibility**: Follow WCAG guidelines
- **Responsive**: Work on all screen sizes
- **Performance**: Fast loading and smooth interactions

### Component Guidelines
- Use **Shadcn/ui** components when possible
- Follow **Tailwind CSS** conventions
- Maintain consistent spacing and typography
- Use **Framer Motion** for smooth animations

---

## 🔒 Security

### Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security issues privately

### Reporting Security Issues
If you find a security vulnerability, please:
1. **Don't** open a public issue
2. Email us at: security@meovis.com
3. We'll respond within 48 hours
4. We'll coordinate the fix and disclosure

---

## 🏆 Recognition

### Contributors
- All contributors will be listed in the README
- Significant contributions get special recognition
- Contributors can add their name to the contributors list

### Types of Contributions
- **Bug Fixes**: Fixing reported issues
- **Features**: Adding new functionality
- **Documentation**: Improving docs and guides
- **Testing**: Adding or improving tests
- **Design**: UI/UX improvements

---

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Discord**: For real-time chat (coming soon)

### Before Asking for Help
1. Check existing issues and discussions
2. Read the documentation
3. Try to reproduce the issue
4. Provide detailed information

---

## 📄 License

By contributing to Meovis, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Thank you for contributing to Meovis! Your help makes this project better for everyone.

**Happy coding!** 🐱📊
