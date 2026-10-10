
// Acuan Label Gizi (ALG) BPOM untuk kebutuhan harian
const BATAS_HARIAN = {
  kalori: 2150,      // kkal
  protein: 60,       // g
  lemak: 67,         // g
  karbohidrat: 325   // g
};

// Zat gizi yang ada di food.json
const ZAT_GIZI = ["kalori", "protein", "lemak", "karbohidrat"];

// 1. Mencari menu berdasarkan id
function cariMenu(id) {
  for (let i = 0; i < foods.length; i++) {
    if (foods[i].id === id) {
      return foods[i];
    }
  }
  return null;
}

// 2. Mencari daftar bahan berdasarkan id menu (dari ingredients.json)
function cariBahan(id) {
  for (let i = 0; i < ingredients.length; i++) {
    if (ingredients[i].menuId === id) {
      return ingredients[i].bahan;
    }
  }
  return [];
}

// 3. Mengambil nutrisi 1 menu (object nutrisi di food.json)
function hitungNutrisi(food) {
  const hasil = {};
  ZAT_GIZI.forEach((zat) => {
    hasil[zat] = food.nutrisi[zat];
  });
  return hasil;
}

// 4. Label kalori per porsi (if / else if / else)
//    Acuan: 1 kali makan ≈ 1/3 kebutuhan harian ≈ 700 kkal
function labelKalori(kalori, kategori = "Makanan") {
  let batasRendah = 300;
  let batasTinggi = 600;

  if (kategori === "Minuman") {
    batasRendah = 150;
    batasTinggi = 300;
  }

  if (kalori < batasRendah) {
    return { teks: "Rendah kalori", kelas: "nutri-rendah" };
  } else if (kalori <= batasTinggi) {
    return { teks: "Kalori sedang", kelas: "nutri-sedang" };
  } else {
    return { teks: "Tinggi kalori", kelas: "nutri-tinggi" };
  }
}

// 5. Total nutrisi isi keranjang
//    cart = [{ id: 1, qty: 1 }, { id: 6, qty: 2 }]
function hitungNutrisiCart(cart) {
  const total = {};
  ZAT_GIZI.forEach((zat) => (total[zat] = 0));

  cart.forEach((item) => {
    const food = cariMenu(item.id);
    if (food) {
      const n = hitungNutrisi(food);
      for (let zat in total) {
        total[zat] += n[zat] * item.qty;
      }
    }
  });

  for (let zat in total) {
    total[zat] = Math.round(total[zat] * 10) / 10; // 1 angka di belakang koma
  }
  return total;
}

// 6. Persen terhadap kebutuhan harian
function persenHarian(total) {
  const persen = {};
  for (let zat in BATAS_HARIAN) {
    persen[zat] = Math.round((total[zat] / BATAS_HARIAN[zat]) * 100);
  }
  return persen;
}

// =====================================================
// TAHAP 6 — ringkasan gizi di halaman keranjang
// Butuh di HTML: <div id="nutri-summary"></div>
//                <canvas id="nutri-chart"></canvas> (opsional)
// =====================================================
let nutriChart = null;

function renderNutrisiCart(cart) {
  const box = document.getElementById("nutri-summary");
  if (!box) return; // bukan halaman keranjang

  const total = hitungNutrisiCart(cart);
  const persen = persenHarian(total);
  const nama = { kalori: "Kalori", protein: "Protein", lemak: "Lemak", karbohidrat: "Karbohidrat" };
  const satuan = { kalori: " kkal", protein: " g", lemak: " g", karbohidrat: " g" };

  const htmlKotak = [];
  const htmlBar = [];
  ZAT_GIZI.forEach((zat) => {
    htmlKotak.push(`<div class="nutri-item"><span>${total[zat]}${satuan[zat]}</span>${nama[zat]}</div>`);

    const kelas = persen[zat] > 100 ? "nutri-tinggi" : persen[zat] >= 50 ? "nutri-sedang" : "nutri-rendah";
    htmlBar.push(`
      <div class="nutri-bar-baris">
        <span class="nutri-bar-label">${nama[zat]} ${persen[zat]}%</span>
        <div class="nutri-bar"><div class="nutri-bar-isi ${kelas}" style="width:${Math.min(persen[zat], 100)}%"></div></div>
      </div>`);
  });

  box.innerHTML = `
    <h3>Ringkasan Gizi Pesanan</h3>
    <div class="nutri-grid">${htmlKotak.join("")}</div>
    <h4>Persen dari kebutuhan harian</h4>
    ${htmlBar.join("")}
  `;

  renderChart(persen);
}

// Grafik Chart.js (butuh internet). Kalau gagal dimuat, kotaknya disembunyikan.
function renderChart(persen) {
  const canvas = document.getElementById("nutri-chart");
  if (!canvas) return;
  if (typeof Chart === "undefined") {
    canvas.parentElement.style.display = "none";
    return;
  }
  if (nutriChart) nutriChart.destroy();
  nutriChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Kalori", "Protein", "Lemak", "Karbohidrat"],
      datasets: [{
        label: "% kebutuhan harian",
        data: [persen.kalori, persen.protein, persen.lemak, persen.karbohidrat],
        backgroundColor: "#2f9e44"
      }]
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, title: { display: true, text: "% kebutuhan harian" } } }
    }
  });
}