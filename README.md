# Nestjs + Svelte Template

- ### Install Guide
1. `git clone https://github.com/Luxw098/nestjs-svelte-template ProjectName`
2. `cd ProjectName`
3. `bun run setup`
3. Do your personalisation
4. `bun run dev`
<br><br>

---
- ### Customization
1. Edit `backend/src/app.module.ts` to configure controllers and providers.
- Backend API
- Prisma ORM
- Socket.IO Server
2. Edit `backend/prisma/schema.prisma` to configure your database.
- Default database is SQLite
4. If applicable, edit `backend/.env` to configure your database URL.
5. Setup ports at these locations:
- `backend/src/main.ts` for Back-end ports
- `frontend/vite.config.ts` for Front-end ports
6. Run `bun run dev` to start the server in dev mode.
<br><br>

---
- ### Production
1. `bun run build` to generate the production build.
2. `bun run start` to start the production server.