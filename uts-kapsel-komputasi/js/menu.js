console.log("=================================");
console.log("NutriCafe - menu.js");
console.log("=================================");

console.log("menu.js berhasil dijalankan!");

console.log("Jumlah menu:", foods.length);
console.log("Data foods:", foods);
console.log("Data ingredients:", ingredients);


const menuList = document.getElementById("menu-list");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuEmpty = document.getElementById("menu-empty");



function cariBahan(menuId) {
    const dataBahan = ingredients.find(
        item => item.menuId === menuId
    );
    if (!dataBahan) {
        return [];
    }
    return dataBahan.bahan;
}


function formatNutrisi(food) {
    return `
        <div class="nutrition-item">
            <span class="nutrition-icon calories">🔥</span>
            <div>
                <strong>${food.nutrisi.kalori}</strong>
                <small>kkal</small>
            </div>
        </div>

        <div class="nutrition-item">
            <span class="nutrition-icon protein">💪</span>
            <div>
                <strong>${food.nutrisi.protein} g</strong>
                <small>protein</small>
            </div>
        </div>

        <div class="nutrition-item">
            <span class="nutrition-icon fat">🥑</span>
            <div>
                <strong>${food.nutrisi.lemak} g</strong>
                <small>lemak</small>
            </div>
        </div>

        <div class="nutrition-item">
            <span class="nutrition-icon carbs">⚡</span>
            <div>
                <strong>${food.nutrisi.karbohidrat} g</strong>
                <small>karbo</small>
            </div>
        </div>
    `;
}


function tampilHarga(angka) {
    if (typeof formatRupiah === "function") {
        return formatRupiah(angka);
    }
    return "Rp" + angka.toLocaleString("id-ID");
}


function renderMenu(list) {
    console.log("Render menu:", list);
    if (list.length === 0) {
        menuList.innerHTML = "";
        menuEmpty.classList.add("show");
        return;
    }
    menuEmpty.classList.remove("show");
    menuList.innerHTML = list.map(food => {
        const bahan = cariBahan(food.id);
        const daftarBahan = bahan.length > 0
            ? bahan.map(item => `
                <li>${item}</li>
            `).join("")
            : "<li>Informasi bahan belum tersedia</li>";
        return `
            <article class="menu-card">
                <!-- Category -->
                <div class="card-top">
                    <span class="category-badge">
                        ${food.kategori}
                    </span>
                </div>
                <!-- Menu Information -->
                <div class="menu-card-body">
                    <h2 class="menu-name">
                        ${food.nama}
                    </h2>
                    <p class="menu-description">
                        ${food.deskripsi}
                    </p>
                    <!-- Nutrition -->
                    <div class="nutrition-grid">
                        ${formatNutrisi(food)}
                    </div>
                    <!-- Ingredients -->
                    <details class="ingredients">
                        <summary>
                            Lihat bahan
                        </summary>
                        <ul>
                            ${daftarBahan}
                        </ul>
                    </details>
                    <!-- Bottom -->
                    <div class="card-bottom">
                        <div class="price-info">
                            <span class="price">
                                ${tampilHarga(food.harga)}
                            </span>
                            <span class="serving">
                                / ${food.porsi} porsi
                            </span>
                        </div>
                        <button
                            class="btn-add"
                            onclick="handleTambah(${food.id})"
                        >
                            + Tambah
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}



function handleTambah(id) {
    const food = foods.find(
        item => item.id === id
    );
    if (!food) {
        console.error("Menu tidak ditemukan:", id);
        return;
    }
    console.log("Mengirim menu ke cart.js:", food.nama);
    if (typeof tambahKeCart === "function") {
        tambahKeCart(id);
    } else {
        console.error("tambahKeCart() belum tersedia.");
    }
}


filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        this.classList.add("active");
        const kategori =
            this.dataset.kategori;
        console.log(
            "Filter kategori:",
            kategori
        );
        if (kategori === "Semua") {
            renderMenu(foods);
            return;
        }
        const hasilFilter = foods.filter(
            food => food.kategori === kategori
        );
        renderMenu(hasilFilter);
    });
});


searchInput.addEventListener("input", function () {
    const keyword =
        this.value.toLowerCase().trim();
    console.log(
        "Pencarian:",
        keyword
    );
    const hasilSearch = foods.filter(food => {
        const nama =
            food.nama.toLowerCase();
        const deskripsi =
            food.deskripsi.toLowerCase();
        return (
            nama.includes(keyword) ||
            deskripsi.includes(keyword)
        );
    });
    renderMenu(hasilSearch);
});



renderMenu(foods);

console.log("Menu pertama:", foods[0]);
console.log(
    "Nutrisi menu pertama:",
    foods[0].nutrisi
);

console.log(
    "Bahan menu pertama:",
    cariBahan(foods[0].id)
);