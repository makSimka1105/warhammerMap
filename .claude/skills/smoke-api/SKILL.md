---
name: smoke-api
description: Smoke-test the running Nest API as anonymous, user and admin. Use after changing server controllers, guards, uploads or CORS, or before claiming an API change works.
---

# Smoke-test the API

The stack must be up: `docker compose -f docker-compose.dev.yml up -d`, Nest on :5000, Next on :3000 (see AGENTS.md "Local setup"). Check with `curl -sf localhost:5000/planets`.

## 1. Get sessions

Sessions come from better-auth on Next, and the cookie jar is then replayed against Nest. Create a user once, verify it in Postgres, then sign in:

```bash
J=/tmp/wh-admin.jar
curl -s -H 'Content-Type: application/json' -H 'Origin: http://localhost:3000' \
  -d '{"name":"admin","email":"admin@local.test","password":"admin12345"}' \
  localhost:3000/api/auth/sign-up/email
docker exec warhammermap-postgres-1 psql -U warhammer -d warhammer_auth \
  -c "UPDATE \"user\" SET \"emailVerified\"=true WHERE email='admin@local.test';"
curl -s -c $J -H 'Content-Type: application/json' -H 'Origin: http://localhost:3000' \
  -d '{"email":"admin@local.test","password":"admin12345"}' \
  localhost:3000/api/auth/sign-in/email
```

Repeat with `user@local.test` into `/tmp/wh-user.jar` for a non-admin. Admin role comes from `ADMIN_EMAILS` at sign-up, so an existing user keeps the role it was created with.

## 2. Hit the endpoints

For each changed endpoint, record the status for anonymous, user (`-b /tmp/wh-user.jar`) and admin (`-b /tmp/wh-admin.jar`):

```bash
curl -s -o /dev/null -w '%{http_code}\n' -b $J -F name=Smoke -F description=x \
  -F icon=@client/public/assets_project_map_pngs/main/segments_all.png localhost:5000/legions
```

Reads stay public. Writes return 401 for anonymous, 403 for a user, 2xx for an admin.

## 3. Clean up

Delete everything you created by id. The `mongodb` MCP server is read-only: use its `find` on the `legions` / `planets` / `events` collections to confirm the rows are gone.

Done when every changed endpoint has the expected status for all three roles and the smoke rows are deleted.
