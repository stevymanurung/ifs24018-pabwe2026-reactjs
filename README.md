# ifs24018-pabwe2026-reactjs — Lost & Founds (ReactJS + Redux)

Praktikum PABWE 2026 – Pertemuan 4 (Studi Kasus 2.1).

## Menjalankan di lokal
```bash
npm install        # atau: bun install
cp .env.example .env
npm run dev        # atau: bun run dev  → http://localhost:3000
npm run test:coverage   # unit test + coverage 100%
npm run build      # hasil build ada di folder dist
```

## Struktur
- `src/features/auth | users | lost-founds` → `api/`, `states/` (action + reducer), `pages/`, `layouts/`, `components/`, `modals/`
- `src/helpers`, `src/hooks/useInput.js`, `src/components/Avatar.jsx`
- `src/store.js`, `src/main.jsx`, `src/App.jsx`, `src/setupTests.js`, `src/test-utils.jsx`

## Deploy ke Netlify (agar tidak 404)
1. Buat **repositori GitHub khusus** untuk proyek ini, mis. `ifs24018-pabwe2026-reactjs`, lalu isi repo dengan **isi folder ini** sehingga `package.json` berada di **root repo** (bukan di dalam subfolder).
2. Di Netlify: **Add new site → Import an existing project → GitHub**, pilih repo itu.
3. Setelan otomatis terbaca dari `netlify.toml`: build `npm run build`, publish `dist`. **Base directory dikosongkan.**
4. `public/_redirects` membuat rute seperti `/auth/login` dan `/lost-founds/1` bisa dibuka langsung.
5. Buka `https://<nama-situs>.netlify.app/auth/login`.
