# AGENTS.md

Interactive Warhammer 40k galaxy map for a roleplay community: planets, legions and events on a custom map, with an admin panel for editing them.

## Layout

```
client/   Next.js 15 (App Router) + React 19, Redux Toolkit, better-auth, shadcn/radix, Tailwind 4 + SCSS modules
server/   NestJS 11 + Mongoose, REST API for planets / legions / events, stores uploaded images on disk
docker-compose.dev.yml   local MongoDB + PostgreSQL
```

Two databases, on purpose (for now):

- **PostgreSQL** holds auth only (better-auth tables via Prisma, `client/prisma/schema.prisma`). The Next app talks to it directly, auth lives at `client/app/api/auth/[...all]/route.ts`.
- **MongoDB** holds the domain data (planets, legions, events), accessed only by `server/`.

The browser calls the Nest API directly at `NEXT_PUBLIC_ORIGIN_SERVER` through axios thunks in `client/lib/slices/*`. Images are served by Nest at `/static/<category>/<name>/<uuid>`, and the client appends the extension itself (`.png` for pics/icons, `.jpg` for event shots).

## Local setup

```bash
docker compose -f docker-compose.dev.yml up -d

cd server && npm install && npm run build && npm run start:prod   # :5000
cd client && npm ci && npx prisma generate && npx prisma db push && npx next dev   # :3000
```

`npm run dev` in `client/` does not run `prisma generate` (it is chained after `next dev`), so run it by hand after `npm ci` or any schema change. `server/package-lock.json` is out of sync with `package.json`: use `npm install`, not `npm ci`.

Sign-up requires email verification through Resend. Without a real key, verify the user manually:

```bash
docker exec warhammermap-postgres-1 psql -U warhammer -d warhammer_auth \
  -c "UPDATE \"user\" SET \"emailVerified\"=true WHERE email='admin@local.test';"
```

Emails listed in `ADMIN_EMAILS` get the `ADMIN` role at sign-up. Admin controls in the UI are only shown when `session.user.role === "ADMIN"`.

## Environment

`server/.env`

| var | value |
|---|---|
| `PORT` | default `5000` |
| `MONGO_URL` | `mongodb://localhost:27017/warhammer` |
| `FRONT_URL` | exact client origin for CORS, `http://localhost:3000`. If unset, CORS falls back to `*` |

`client/.env`

| var | value |
|---|---|
| `NEXT_PUBLIC_ORIGIN_SERVER` | Nest URL without trailing slash. Inlined at build time |
| `NEON_URL` | Postgres URL, `postgresql://warhammer:warhammer@localhost:5432/warhammer_auth` locally |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | public URL of the Next app; verification links are built from it |
| `ADMIN_EMAILS` | `;`-separated |
| `RESEND_API_KEY`, `EMAIL_SENDER_NAME`, `EMAIL_SENDER_ADDRESS` | Resend sender; needs a verified domain outside of testing |

`.env*` is gitignored in both packages. Never commit env files: the old ones are already in the public git history (see "Delete server/.env" commit), so treat those secrets as leaked.

## API (server)

| method | path | notes |
|---|---|---|
| GET/POST | `/planets` | multipart, file field `pic`; `legion1`, `legion2` link legions |
| GET/PUT/DELETE | `/planets/:id` | |
| GET/POST | `/legions` | file field `icon` |
| GET/PUT/DELETE | `/legions/:id` | `GET /legions/:id` currently 500s, see below |
| GET/POST | `/events` | file field `shots` (≤4), `place` = planet id |
| GET/DELETE | `/events/:id` | no PUT |
| DELETE | `/planets`, `/legions`, `/events` | wipes the whole collection |
| GET | `/static/*` | uploaded images |

Writes are admin-only: the global `AdminGuard` (`server/src/auth/admin.guard.ts`) passes GET/HEAD/OPTIONS and otherwise forwards the request cookie to `{FRONT_URL}/api/auth/get-session`, answering 401 without a session and 403 without the `ADMIN` role. The client must send cookies, so every API call goes through `client/lib/api.ts` (`withCredentials`), never bare `axios`. In production the cookie only reaches Nest if both sit on one site (shared parent domain or a Next rewrite proxy).

Uploads are written to `server/dist/static/`. That is why `nest-cli.json` has `deleteOutDir: false`. Running `rm -rf dist` deletes all uploaded images.

## Checks

There are no tests yet. Before claiming a change works:

```bash
cd server && npm run build && npm run lint
cd client && npx tsc --noEmit && npm run lint
```

`client/next.config.ts` sets `ignoreBuildErrors` and `ignoreDuringBuilds`, so `next build` succeeding proves nothing about types. Run `tsc` explicitly.

API changes: run the `smoke-api` skill (`.claude/skills/smoke-api`). Inspect Mongo data through the read-only `mongodb` MCP server (`.mcp.json`) instead of ad-hoc scripts.

## Known problems

Fix these before building features on top of them:

- **Upload path traversal.** The folder name comes from `dto.name` (`server/src/files/file.service.ts`), and delete removes the whole folder recursively. No size limit or mime filter on uploads either.
- **No DTO validation.** class-validator and ValidationPipe are not set up.
- `legion.service.ts` populates a non-existent `objects` path, so `GET /legions/:id` fails.
- The extension is hardcoded on the client, so a `.jpg` uploaded as a pic shows as broken.
- `main.ts` uses a `fs-extra` default import that resolves to undefined, and the `returnStatic` hack logs an error on every start. Harmless, but delete it.
- `client/components/sidebar/upperInfo.tsx` hardcodes `http://localhost:5000`.
- Bad filenames: `ScrollableBlockColumn.tsx.tsx`, `RunningMarquee .tsx` (contains a space), and an empty `inputFileCustom.tsx`.
- `middleware.ts` only matches `/dashboard`, a route that does not exist.
- Both Dockerfiles are broken (no `WORKDIR`, no `.dockerignore`, no multi-stage).
- Dead deps: mongoose/mongodb/`@auth/mongodb-adapter` in client, redux toolkit and auth adapter in server.

## Conventions

- TypeScript everywhere. Client components live in `client/components/<area>/`, domain types in `client/app/types/`, server state in Redux slices.
- Styling: SCSS modules in `client/app/styles/` for the map and custom UI, shadcn components in `client/components/ui/`.
- Server modules follow Nest layout: `<entity>.controller.ts`, `<entity>.service.ts`, `<entity>.schema.ts`, DTOs in `server/src/dto/`.
- Keep changes surgical, and no narration comments. Comments in the codebase are in Russian or English, and both are fine.
- Do not commit, push or open PRs unless asked.

## Deploy target (planned, $0)

Vercel (client, root `client/`) + Render free web service (server, root `server/`) + MongoDB Atlas M0 + Neon Postgres + Cloudflare R2 for images (Render disk is ephemeral) + Resend for email. Before the first deploy: move uploads to R2, add API auth, and fix the client build order (`prisma generate && next build`).
