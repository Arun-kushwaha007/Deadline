# Contributing to CollabNest

Thank you for your interest in contributing to **CollabNest**! We welcome bug reports, feature requests, documentation improvements, and code contributions from the community.

## 🚀 Quick Start for Contributors

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Deadline.git
   cd Deadline
   ```
3. **Install dependencies**:
   ```bash
   npm run install:all
   ```
4. **Setup environment files**:
   ```bash
   cp my-app/.env.example my-app/.env
   cp server/.env.example server/.env
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🌲 Branch Strategy

- `main` or `master`: Production-ready releases.
- `dev`: Active development branch.
- Feature branches: `feature/short-description` or `fix/issue-description`.

## 📝 Commit Guidelines

We recommend using clear, descriptive commit messages following the Conventional Commits format:
- `feat: add real-time notification badge`
- `fix: resolve socket reconnect loop`
- `docs: update deployment instructions`
- `refactor: optimize task query aggregation`

## 🧪 Pull Request Checklist

Before submitting a Pull Request:
- [ ] Code builds without errors (`npm run build`).
- [ ] Linter passes (`npm run lint`).
- [ ] Environment variables are documented in `.env.example`.
- [ ] No personal keys or secrets are committed.

Thank you for helping build CollabNest! 💙
