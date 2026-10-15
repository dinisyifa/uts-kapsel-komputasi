// =====================================================
// menu.js — menampilkan daftar menu, pencarian, dan filter
// Data "foods" sudah tersedia dari <script src="data/food.json">
// (pola questions.json di Quiz App minggu 2)
// =====================================================

let kategoriAktif = "Semua";

const menuList = document.getElementById("menu-list");
const menuEmpty = document.getElementById("menu-empty");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");


// Membuat HTML satu kartu menu (template literal)
function buatKartuMenu(food) {
    const label = labelKalori(food.nutrisi.kalori, food.kategori); // dari nutrition.js
    const bahan = cariBahan(food.id);                              // dari nutrition.js

    return `
        <article class="menu-card">

            <span class="menu-category">${food.kategori}</span>
            <span class="nutri-label ${label.kelas}">${label.teks}</span>

            <h2>${food.nama}</h2>

            <p class="menu-price">${formatRupiah(food.harga)}</p>

            <p class="menu-description">${food.deskripsi}</p>

            <p class="menu-portion"><strong>Porsi:</strong> ${food.porsi}</p>

            <div class="nutrition">
                <h3>Informasi Nutrisi</h3>
                <p>Kalori: ${food.nutrisi.kalori} kkal</p>
                <p>Protein: ${food.nutrisi.protein} g</p>
                <p>Lemak: ${food.nutrisi.lemak} g</p>
                <p>Karbohidrat: ${food.nutrisi.karbohidrat} g</p>
            </div>

            <p class="menu-bahan"><strong>Bahan:</strong> ${bahan.join(", ")}</p>

            <button class="add-button" type="button" onclick="tambahKeCart(${food.id})">
                + Tambah ke Keranjang
            </button>

        </article>
    `;
}


// Menampilkan menu sesuai kata kunci pencarian dan kategori
function tampilkanMenu() {
    const kataKunci = searchInput.value.toLowerCase().trim();

    // filter: ambil menu yang cocok nama DAN kategorinya
    const menuTerfilter = foods.filter((food) => {
        const cocokNama = food.nama.toLowerCase().includes(kataKunci);
        const cocokKategori = kategoriAktif === "Semua" || food.kategori === kategoriAktif;
        return cocokNama && cocokKategori;
    });

    // Tidak ada menu yang cocok
    if (menuTerfilter.length === 0) {
        menuList.innerHTML = "";
        menuEmpty.style.display = "block";
        return;
    }

    menuEmpty.style.display = "none";

    // map: ubah tiap menu menjadi HTML kartu, lalu gabung dengan join
    menuList.innerHTML = menuTerfilter.map(buatKartuMenu).join("");
}


// Pencarian: jalan setiap kali pengguna mengetik
searchInput.addEventListener("input", tampilkanMenu);

// Filter kategori: tombol Semua / Makanan / Minuman
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        kategoriAktif = button.dataset.kategori;

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });
        button.classList.add("active");

        tampilkanMenu();
    });
});

// Jalankan saat halaman dibuka
tampilkanMenu();