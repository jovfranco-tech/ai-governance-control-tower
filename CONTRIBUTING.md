# Contributing to AI Governance Control Tower

Thank you for your interest in contributing! This is a portfolio project but contributions are welcome for improvements, bug fixes, and new features.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-governace-CT.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Start the dev server: `npm run dev`

## Code Standards

- **TypeScript**: All new files must be typed. Start with interfaces in `src/types/index.ts`.
- **Components**: Keep components focused. Reuse `KpiCard`, `PageHeader`, badge classes.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline styles.
- **Data**: Add mock data to `src/data/demoDataEn.ts` following existing patterns.
- **i18n**: All user-facing strings should have both EN and ES variants in `src/i18n.ts`.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add business value matrix page
fix: resolve dark mode badge contrast issue
docs: update README with new module list
refactor: extract StatusBadge into shared component
chore: bump dependencies
```

## Pull Request Process

1. Ensure `npx tsc --noEmit` passes with no errors
2. Ensure `npm run build` completes successfully
3. Add a clear PR description with what changed and why
4. Link to any related issues

## Adding a New Module

1. Create `src/pages/YourModule.tsx`
2. Add types to `src/types/index.ts`
3. Add mock data to `src/data/demoDataEn.ts`
4. Expose data via `DataContext.tsx`
5. Register the route in `src/App.tsx`
6. Add to sidebar in `src/components/layout/Sidebar.tsx`
7. Add i18n strings to `src/i18n.ts`

## Reporting Issues

Please use GitHub Issues with:
- Clear title describing the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
