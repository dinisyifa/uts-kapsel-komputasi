
let daftarMenu = [];
let kategoriAktif = "Semua";

const menuList = document.getElementById("menu-list");
const menuEmpty = document.getElementById("menu-empty");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");

// Memuat data menu dari food.json

async function muatMenu() {
    try {
        const response = await fetch("data/food.json");

        if (!response.ok) {
            throw new Error(
                `File food.json gagal dimuat: ${response.status}`
            );
        }

        // Membaca isi file tanpa mengubah database
        const isiFile = await response.text();

        try {
            // Mencoba membaca sebagai JSON biasa
            daftarMenu = JSON.parse(isiFile);
        } catch (error) {
            // Jika berisi array JavaScript, ambil bagian array-nya
            const awalArray = isiFile.indexOf("[");
            const akhirArray = isiFile.lastIndexOf("]");

            if (awalArray === -1 || akhirArray === -1) {
                throw new Error("Array data makanan tidak ditemukan.");
            }

            const teksArray = isiFile.slice(
                awalArray,
                akhirArray + 1
            );

            // Membaca sintaks array JavaScript yang sudah ada
            daftarMenu = new Function(
                `"use strict"; return (${teksArray});`
            )();
        }

        if (!Array.isArray(daftarMenu)) {
            throw new Error("Data makanan bukan berbentuk array.");
        }

        console.log("Data menu berhasil dibaca:", daftarMenu);

        tampilkanMenu();

    } catch (error) {
        console.error("Gagal memuat menu:", error);

        menuList.innerHTML = `
            <p class="empty-message">
                Data menu gagal dimuat. Periksa Console untuk detail error.
            </p>
        `;

        menuEmpty.style.display = "none";
    }
}


// Menampilkan menu berdasarkan pencarian dan kategori
function tampilkanMenu() {
    const kataKunci = searchInput.value
        .toLowerCase()
        .trim();

    const menuTerfilter = daftarMenu.filter((food) => {
        const nama = (food.nama || "").toLowerCase();

        const cocokNama = nama.includes(kataKunci);

        const cocokKategori =
            kategoriAktif === "Semua" ||
            food.kategori === kategoriAktif;

        return cocokNama && cocokKategori;
    });

    // Kosongkan daftar menu sebelum menampilkan hasil
    menuList.innerHTML = "";

    // Jika tidak ada menu yang cocok
    if (menuTerfilter.length === 0) {
        menuEmpty.style.display = "block";
        return;
    }

    menuEmpty.style.display = "none";

    // Membuat kartu untuk setiap menu
    menuList.innerHTML = menuTerfilter.map((food) => `
        <article class="menu-card">

            <span class="menu-category">
                ${food.kategori}
            </span>

            <h2>${food.nama}</h2>

            <p class="menu-description">
                ${food.deskripsi || ""}
            </p>

            <p class="menu-portion">
                <strong>Porsi:</strong> ${food.porsi || "-"}
            </p>

            <div class="nutrition">
                <h3>Informasi Nutrisi</h3>

                <p>Kalori: ${food.nutrisi?.kalori ?? "-"} kkal</p>
                <p>Protein: ${food.nutrisi?.protein ?? "-"} g</p>
                <p>Lemak: ${food.nutrisi?.lemak ?? "-"} g</p>
                <p>Karbohidrat: ${food.nutrisi?.karbohidrat ?? "-"} g</p>
            </div>

            <button
                class="add-button"
                type="button"
                disabled
            >
                + Tambah ke Keranjang
            </button>

        </article>
    `).join("");
}

// Pencarian menu
searchInput.addEventListener("input", tampilkanMenu);

// Filter kategori
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
menuEmpty.style.display = "none";
muatMenu();
