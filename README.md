# SimuTrade

![SimuTrade Logo](public/images/logo/logo.png)

> **SimuTrade** adalah platform simulasi perdagangan ekspor-impor berbasis web yang memanfaatkan AI untuk memberikan insight peluang ekspor global, analisis kebutuhan impor negara, dan simulasi rute perdagangan secara interaktif.

---

## Fitur Utama

- **Simulation Playground**: Eksplorasi peta dunia interaktif untuk melihat kebutuhan impor tiap negara.
- **Trade Route Simulation**: Simulasikan rute ekspor dari Indonesia ke negara tujuan dengan berbagai moda transportasi.
- **AI-powered Insights**: Rekomendasi peluang ekspor dan estimasi biaya/waktu pengiriman.
- **Konfigurasi Komoditas & Volume**: Pilih komoditas, volume, dan negara tujuan secara fleksibel.
- **UI Modern & Responsive**: Desain dashboard modern, mudah digunakan, dan mobile-friendly.

---

## Contoh Tampilan

![Contoh UI Simulation Playground](../screenshot-map-simulation.jpg)

---

## Struktur Folder

```
simutrade-frontend/
├── public/
│   └── images/
│       └── logo/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── playground/
│   │   ├── strategies/
│   │   └── ui/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── missions/
│   │   ├── playground/
│   │   └── strategies/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   └── utils/
├── package.json
└── README.md
```

---

## Teknologi Utama

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **Ant Design** (komponen UI)
- **react-markdown** (render konten markdown)

---

## Instalasi & Menjalankan Lokal

1. Masuk ke folder `simutrade-frontend`:
   ```bash
   cd simutrade-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
4. Buka di browser: [http://localhost:5173](http://localhost:5173)

---

## Catatan Pengembangan

- Pastikan Node.js versi terbaru.
- Untuk pengembangan UI, lihat folder `src/components` dan `src/pages`.
- Konfigurasi styling di `src/styles` dan `tailwind.config.js`.
- Logo dan aset gambar di `public/images/logo/`.

---

## Lisensi

Open Source - MIT License

---

> SimuTrade dikembangkan untuk membantu eksportir, analis perdagangan, dan pelaku bisnis memahami peluang ekspor global secara data-driven dan interaktif.
