# NutriCafe

Website menu kafe sehat yang menampilkan informasi gizi setiap menu dan menghitung total harga serta total gizi pesanan.
Proyek UTS mata kuliah Kapita Selekta Komputasi, Program Studi Matematika UNPAR.

## Fitur

- **Home**: pengenalan NutriCafe, promo dengan countdown, keunggulan, dan cara pesan.
- **Menu**: daftar makanan dan minuman lengkap dengan kalori, protein, lemak, karbohidrat, dan bahan; filter kategori dan pencarian.
- **Keranjang**: tambah/kurangi/hapus item, total harga, ringkasan gizi pesanan, dan form pemesanan.
- Isi keranjang tersimpan di `localStorage`, jadi tidak hilang saat pindah halaman.

Batasan: website ini simulasi front-end. Tidak ada login, server, atau pembayaran sungguhan.

## Teknologi

- HTML untuk struktur halaman
- CSS untuk tampilan (satu file `css/style.css`)
- JavaScript untuk interaksi dan perhitungan
- Data menu dan bahan disimpan sebagai variabel JavaScript di folder `data/` (pola `questions.json` dari materi kuliah)

## Struktur folder

```
uts-kapsel-komputasi/
├── index.html          Home
├── menu.html           Halaman menu
├── cart.html           Halaman keranjang
├── css/style.css       Seluruh tampilan
├── js/menu.js          Menampilkan menu, filter, pencarian
├── js/cart.js          Keranjang dan form pemesanan
├── js/nutrition.js     Perhitungan gizi
├── data/food.json      Data menu
└── data/ingredients.json  Data bahan tiap menu
```

## Cara menjalankan

1. Unduh atau clone repository ini.
2. Buka folder `uts-kapsel-komputasi`.
3. Klik dua kali `index.html`. Website langsung terbuka di browser, tidak perlu server.

## Anggota dan pembagian tugas

| Nama | Bagian |
|---|---|
| Ressy | `js/menu.js`, CSS menu |
| Agatha | `js/cart.js`, CSS keranjang |
| Dini | `js/nutrition.js`, CSS nutrisi |
| Lulu | `menu.html`, `cart.html` |
| Astrid | `index.html`, CSS global dan responsif, README, references |

Semua anggota ikut mengisi dan mengecek data menu.

Sumber data gizi: lihat [references.md](references.md).
