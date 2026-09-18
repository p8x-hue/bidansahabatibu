# Bidan Sahabat Ibu

Situs profil untuk Praktik Mandiri Bidan "Bidan Sahabat Ibu" — satu halaman
statis berisi profil, layanan, jadwal praktik, dan formulir janji temu yang
langsung terhubung ke WhatsApp.

> **Catatan asal-usul.** Situs ini **tidak** dibuat dari ekspor Claude Design.
> Seluruh tata letak, warna, tipografi, dan naskah di sini adalah rancangan
> baru — perlakukan sebagai rancangan sementara yang masih perlu diselaraskan
> dengan desain aslinya.
>
> Sudah dua kali upaya impor gagal karena berkas ekspor tidak pernah tersedia
> di lingkungan kerja; yang terakhir 18 September 2026. Pada sesi Claude Code
> di peramban, `DesignSync` menolak dengan alasan perlu `/design-login` yang
> tidak bisa dijalankan di sesi non-interaktif, dan permintaan langsung ke
> `https://api.anthropic.com/v1/design/mcp` menghasilkan `401`. Lihat
> [Menyelaraskan dengan ekspor Claude Design](#menyelaraskan-dengan-ekspor-claude-design).

## Menyelaraskan dengan ekspor Claude Design

Proyek desainnya ada di
<https://claude.ai/design/p/78503694-ba8c-472a-bfda-0506ecd028e6>.

Cara menurunkan berkasnya: buka proyek tersebut, lalu pakai tombol
**"Send to Claude Code Web"**. Tombol itu menyalin ekspor langsung ke ruang
kerja sesi baru. Jangan mengandalkan `DesignSync` dari sesi peramban — tanpa
`/design-login` yang interaktif, pemanggilannya selalu ditolak.

Berkas yang ditunggu:

| Berkas | Peran |
|---|---|
| `Bidan Sahabat Ibu - Website.dc.html` | halaman yang harus diimplementasikan |
| `_ds/…/_ds_bundle.js`, `_ds/…/styles.css` | runtime dan gaya sistem desain |
| `_ds/…/tokens/{base,colors,fonts,shape,spacing,typography}.css` | enam lapis token |
| `assets/logo-bidan-sahabat-ibu.png` | logo asli |
| `support.js` | skrip pendukung ekspor |

Setelah ekspor tersedia:

- Ganti `css/tokens.css` dengan keenam berkas token dari `_ds/`, jangan
  digabung — token yang ada sekarang hasil rekaan, bukan turunan desain.
- Ganti `assets/logo-bidan-sahabat-ibu.svg` dengan logo PNG dari ekspor.
- Pertahankan perilaku yang dibuat tangan dan mungkin tidak ikut terekam di
  ekspor: `lang="id"`, formulir janji temu berbasis tautan `wa.me` yang tidak
  butuh server, penanganan `prefers-reduced-motion`, serta FAQ
  `<details>`/`<summary>` yang tetap berfungsi tanpa JavaScript.
- Jangan biarkan impor desain mengubah teks contoh pada bagian testimoni
  menjadi tampak seperti ulasan pasien sungguhan.
- Perbarui catatan asal-usul di atas setelah selesai.

## Menjalankan secara lokal

Tidak ada proses build dan tidak ada dependensi. Cukup layani folder ini
sebagai berkas statis:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Membuka `index.html` langsung lewat `file://` juga berfungsi.

## Struktur berkas

```
index.html                      Seluruh isi halaman + sprite ikon SVG
css/tokens.css                  Token desain: warna, tipografi, spasi, bentuk
css/styles.css                  Tata letak dan komponen
js/main.js                      Menu, animasi, akordeon FAQ, formulir WhatsApp
assets/logo-bidan-sahabat-ibu.svg   Logo utama
assets/favicon.svg              Ikon tab peramban
```

Ubah nilai di `css/tokens.css` untuk menyesuaikan tampilan secara menyeluruh —
warna dan ukuran huruf di `styles.css` semuanya merujuk ke token tersebut.

---

## ⚠️ Yang WAJIB diganti sebelum dipublikasikan

Seluruh data praktik pada halaman ini masih berupa **placeholder**. Cari
komentar `<!-- GANTI -->` di `index.html`, lalu perbarui hal berikut:

| Bagian | Isi saat ini | Perlu diganti dengan |
|---|---|---|
| Nomor WhatsApp & telepon | `6281200000000` | Nomor praktik yang sebenarnya |
| Nama bidan | `Bidan [Nama Lengkap], S.Tr.Keb.` | Nama dan gelar sebenarnya |
| Nomor STR & SIPB | `[isi nomor …]` | Nomor izin yang berlaku |
| Alamat praktik | `[Jalan dan nomor], …` | Alamat lengkap |
| Surel | `halo@bidansahabatibu.id` | Alamat surel aktif |
| Instagram | `@bidansahabatibu` | Akun sebenarnya |
| Jam praktik | Senin–Minggu (contoh) | Jam praktik sebenarnya |
| Riwayat bidan | `[Tuliskan latar belakang …]` | Profil sebenarnya |
| FAQ BPJS & pembayaran | `[Jelaskan …]` | Kebijakan sebenarnya |
| **Testimoni** | Teks contoh | Testimoni nyata, **setelah mendapat izin pasien** |

Mengganti nomor WhatsApp di seluruh berkas sekaligus:

```bash
sed -i 's/6281200000000/62NOMOR_ANDA/g' index.html
sed -i 's/+62 812-0000-0000/+62 NOMOR ANDA/g' index.html
```

Nomor pada atribut `data-wa-number` di tag `<body>` dipakai oleh formulir
janji temu, jadi pastikan ikut terganti.

### Tentang testimoni

Bagian testimoni sengaja diisi teks contoh dalam tanda kurung siku, **bukan**
ulasan karangan. Menampilkan testimoni fiktif sebagai ulasan asli menyesatkan
calon pasien. Isi dengan testimoni nyata yang sudah diizinkan, atau hapus
seluruh `<section id="testimoni">` beserta tautannya di navigasi dan footer.

### Klaim layanan

Kalimat seperti "Siaga persalinan 24 jam" dan "Anggota Ikatan Bidan Indonesia
(IBI)" ikut disertakan sebagai contoh. Pastikan setiap klaim benar-benar sesuai
kenyataan sebelum tayang.

## Foto

Bagian hero dan profil saat ini memakai panel gradien berisi logo sebagai
pengganti foto. Ganti isi `.hero__figure` dan `.about__figure` dengan tag
`<img>` — lihat komentar `GANTI` di `index.html`. Ukuran yang disarankan:
hero 4:5 potret, profil 1:1 persegi.

## Catatan teknis

- Bahasa halaman disetel `lang="id"`.
- Formulir janji temu tidak memerlukan server: isian dirangkai menjadi tautan
  `wa.me` dan dibuka di WhatsApp agar pengguna dapat memeriksanya lebih dulu.
- Menghormati `prefers-reduced-motion`; animasi dinonaktifkan bila diminta.
- Navigasi dapat diakses lewat papan ketik, dilengkapi tautan lompat ke konten.
- FAQ memakai `<details>`/`<summary>` sehingga tetap berfungsi tanpa JavaScript.
- Huruf Fraunces dan Plus Jakarta Sans dimuat dari Google Fonts. Untuk situs
  tanpa akses internet, unduh dan layani secara mandiri.
