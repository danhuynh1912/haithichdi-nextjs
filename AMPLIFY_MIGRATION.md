# Frontend Migration To AWS Amplify

This guide is written for the current frontend repository:

- the Git repository root is `frontend/`
- this Next.js app is deployed directly from the `frontend/` repository
- the app uses SSR-related behavior for booking metadata in `app/tour-booking/[tourId]/page.tsx`

The goal is to move the frontend to AWS Amplify Hosting while keeping the current Next.js SSR-capable deployment model.

## 1. What is already prepared in this repo

The repository now includes:

- `amplify.yml` at the frontend repo root.
- `.env.example` with the environment variables you need in Amplify.
- a production-build fix for `/locations`, where `useSearchParams()` now runs under a `Suspense` boundary.
- a production-build fix for `eslint.config.mjs`.
- support in `next.config.ts` for adding production image hosts from environment variables such as `NEXT_PUBLIC_MEDIA_BASE_URL`.

## 2. Before creating the Amplify app

You need three public URLs decided up front:

1. `NEXT_PUBLIC_API_BASE_URL`
   Example: `https://api.haithichdi.com`
   Used by browser-side API calls.

2. `SERVER_API_BASE_URL`
   Example: `https://api.haithichdi.com`
   Used by server-side metadata generation in the booking route.

3. `NEXT_PUBLIC_SITE_URL`
   Example: `https://haithichdi.com`
   Used to generate canonical URLs and Open Graph metadata.

Optional but recommended:

4. `NEXT_PUBLIC_MEDIA_BASE_URL`
   Example: `https://media.haithichdi.com`
   Use this if images are served from S3, CloudFront, MinIO public endpoint, or another media domain.

Important:

- The backend endpoint used in `NEXT_PUBLIC_API_BASE_URL` must be reachable from browsers on the public internet.
- The backend endpoint used in `SERVER_API_BASE_URL` must also be reachable from Amplify SSR compute.
- If your backend stays private inside a VPC with no public entrypoint, SSR metadata calls from Amplify will fail.

## 3. Why `amplify.yml` looks the way it does

The build file is located at the frontend repo root because Amplify should connect directly to the `frontend/` Git repository.

Key parts:

- `nvm use 20`
  Forces Node.js 20 during build. This avoids relying on whatever default Node version the build image has.

- `npm ci`
  Installs dependencies using the lockfile for reproducible builds.

- writing variables into `.env.production`
  Amplify build environment variables are not automatically exposed to Next.js server-side runtime behavior.
  The build step copies `NEXT_PUBLIC_*` and `SERVER_API_BASE_URL` into `.env.production` before `next build`.

- `baseDirectory: .next`
  This is required for a Next.js SSR-capable deployment on Amplify.

## 4. Create the Amplify app

In AWS Amplify console:

1. Choose **Create new app**.
2. Choose your Git provider.
3. Select the **frontend repository** and the branch you want to deploy.
4. Continue to the build settings step.

## 5. Configure environment variables

In Amplify console, add these variables before the first deploy:

- `NEXT_PUBLIC_API_BASE_URL`
- `SERVER_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MEDIA_BASE_URL` (if your images are hosted on a separate domain)

Suggested example:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.haithichdi.com
SERVER_API_BASE_URL=https://api.haithichdi.com
NEXT_PUBLIC_SITE_URL=https://haithichdi.com
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.haithichdi.com
```

Optional for debugging first deployment:

- `AMPLIFY_ENABLE_DEBUG_OUTPUT=true`

## 6. Review the first deployment

During the first build, confirm these checkpoints in the logs:

1. Amplify uses the build settings from `amplify.yml`.
2. `npm ci` completes successfully.
3. `.env.production` is created before `npm run build`.
4. `next build` completes successfully.
5. The artifacts are uploaded from `.next`.

If the build fails on images, the most common cause is that your production media hostname is not allow-listed by `next.config.ts`.

## 7. Update DNS and domain settings

After the first successful deployment:

1. Add your custom domain in Amplify.
2. Validate HTTPS certificate issuance.
3. Decide whether the canonical domain is:
   - `https://haithichdi.com`
   - or `https://www.haithichdi.com`
4. Set `NEXT_PUBLIC_SITE_URL` to the final canonical domain.
5. Trigger a rebuild after changing the domain env var.

This matters because metadata in `lib/seo.ts` uses `NEXT_PUBLIC_SITE_URL` to generate canonical URLs and social tags.

## 8. Functional verification checklist after deployment

Run these checks on the deployed site:

1. Home page loads without console errors.
2. `/locations` opens and query-string modal behavior still works.
3. `/tours` search and filters work against the production API.
4. `/about` and hot tours sections load backend data.
5. `/tour-booking/<id>` loads correctly.
6. The booking page metadata changes correctly for a valid `tourId`.
7. Booking form submission reaches the production backend.
8. Remote images load correctly.
9. PDF quotation preview loads correctly from the production media source.

## 9. Known caveats for this app

### SSR dependency on the backend

The booking route generates metadata from the backend at build/runtime. That means:

- `SERVER_API_BASE_URL` must be correct
- CORS alone is not enough for this path because this is a server-side fetch
- any IP allowlist or private networking restriction must allow Amplify SSR access

### Remote image allowlist

This app uses `next/image`.
If your backend returns image URLs from a new hostname, you must allow that host.

This repo now supports passing a production media origin through:

- `NEXT_PUBLIC_MEDIA_BASE_URL`
- or the host inside `NEXT_PUBLIC_API_BASE_URL` if images come from the same domain

### Localhost values must not be reused in production

The current local `.env` uses:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
SERVER_API_BASE_URL=http://backend:8000
```

Those values only work in local Docker/dev flows and will break on Amplify.

## 10. Recommended rollout sequence

Use this order to reduce risk:

1. Deploy a non-production branch to Amplify first.
2. Point it to a staging backend URL.
3. Verify booking route, images, and PDFs.
4. Add the custom domain only after staging passes.
5. Promote the production branch.

## 11. Useful AWS references

- Deploying a Next.js SSR app: `https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html`
- SSR environment variables: `https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html`
- Environment variables in Amplify: `https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html`
