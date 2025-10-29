# Meal Monkey Backend

## Overview

This folder (`Meal-Monkey-Backend-main/`) contains the Meal Monkey backend server. It's a Node.js + Express application that exposes REST APIs used by Meal Monkey frontend and mobile apps. The backend handles authentication, orders, restaurants, payments, file uploads, and integrates with external services (Cloudinary, SMTP, Firebase, etc.).

## Repository layout (important files)

- `server.js` — application entrypoint.
- `config/` — configuration helpers (e.g., cloudinary config).
- `controllers/` — request handlers and business logic (auth, user, order, payment, etc.).
- `models/` — Mongoose models for MongoDB.
- `routes/` — route definitions mapping endpoints to controllers.
- `middlewares/` — authentication and authorization middleware.
- `services/` — helper services (cloudinary, event bus).
- `uploads/` — temporary upload storage.
- `utils/` — small utilities (OTP generator, SMTP functions).

## Environment

Create a local `.env` file in this folder with required environment variables. There is no `.env` checked into the repo for security. Example variables (these are the keys the app expects):

- `PORT` — server port (e.g., `6014`).
- `NODE_ENV` — `development` or `production`.
- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — secret used to sign JWT tokens.
- `JWT_EXPIRE` — token expiry (e.g., `21d`).
- `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP settings if email is used.
- `FIREBASE_*` — Firebase service account keys (if used).

If there is an `.env.example` in this folder, copy it to `.env` and edit values. If not, create `.env` from the variables above.

## Install & Run

From the `Meal-Monkey-Backend-main/` folder (macOS / zsh):

```zsh
cd "Meal-Monkey-Backend-main"
npm install
# create .env from example or manually
cp .env.example .env  # if example exists
# Start in development (if script exists)
npm run dev
# or
npm start
```

Check `package.json` for available scripts (`dev`, `start`, `test`, `lint`, etc.).

## Database

The app uses MongoDB via Mongoose. Ensure your `MONGODB_URI` includes the correct user, password, and database. For production, prefer using environment-specific DB users and IP/network rules.

## Testing & Linting

If tests exist, run them with:

```zsh
npm test
```

Add or run linters according to `package.json` scripts (e.g., `npm run lint`).

## Security and secrets

Important: never commit `.env` or secret files. If any secret has been accidentally committed, rotate the secret immediately (DB credentials, JWT secret, API keys, service account keys).

If secrets were committed and pushed, consider removing them from git history using `git-filter-repo` or BFG and then force-pushing (this is disruptive — collaborators must re-clone). I can help with that process if you want.

## Deploy

Deployment depends on your environment (Heroku, digital ocean, AWS, etc.). Common steps:

1. Build a production environment with environment variables set in the host/CI/CD.
2. Ensure MongoDB is reachable from the host and credentials are secure.
3. Use a process manager (PM2, systemd) or containerization (Docker).

## Common troubleshooting

- Connection errors: verify `MONGODB_URI`, network access, and database user permissions.
- Authentication issues: check `JWT_SECRET` and token expiry.
- Uploads: ensure Cloudinary/other storage credentials are correct and file size limits are set.

## Contribution

1. Create an issue for new features or bugs.
2. Create a feature branch from `main`.
3. Open a PR with clear description and tests where applicable.

## Contact / Next steps I can help with

- Purge sensitive files from the git history (git-filter-repo / BFG) and force-push.
- Add a `backend/README.md` to provide environment variable templates, deploy guides, or add CI checks to prevent committing `.env`.
- Add pre-commit hooks (husky) to block accidental commits of `.env` and private keys.

Last updated: October 30, 2025

