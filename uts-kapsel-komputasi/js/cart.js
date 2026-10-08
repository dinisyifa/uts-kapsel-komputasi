function ambilCart() {
    const dataTersimpan = localStorage.getItem("nutricafe-cart");
    if (dataTersimpan) {
        return JSON.parse(dataTersimpan);
    } else {
        return [];
    }
}

// Simpan keranjang ke LocalStorage
function simpanCart(cart) {
    localStorage.setItem("nutricafe-cart", JSON.stringify(cart));
}

function tambahKeCart(id) {
    const cart = ambilCart();
    let sudahAda = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id){
            cart[i].qty++;
            sudahAda = true ;
        }
    }

    if (!sudahAda) {
        cart.push({id: id, qty: 1});
    }

    simpanCart(cart);
}

//Tombol + (perubahan=1) & tombol - (perubahan= -1)
function ubahQty(id,perubahan) {
    const cart = ambilCart();
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty = cart[i].qty + perubahan;
        }
    }
    // Buang item yang qty-nya sudah 0
    const cartBaru = cart.filter((item) => item.qty > 0);
    simpanCart(cartBaru);
    renderCart();
}


// Tombol Hapus
function hapusItem(id) {
    const cart = ambilCart();
    const cartBaru = cart.filter((item) => item.id !== id);
    simpanCart(cartBaru);
    renderCart();
}

//Tombol Kosongkan
function kosongkanCart() {
    simpanCart([]);
    renderCart();
}

// Format uang menjadi rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// TOTAL = jumlah (harga x qty) semua item
function hitungTotal(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const food = foods.find((f) => f.id === cart[i].id);
        total = total + food.harga * cart[i].qty;
    }
    return total;
}

// Tampilkan isi keranjang di tabel
function renderCart() {
    const cartBody = document.getElementById("cart-body");
    if (!cartBody) return; // halaman ini tidak mempunyai tabel keranjang

    const cart = ambilCart();
    const cartEmpty = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");

    // Keranjang kosong: tampilkan pesan, dan sembunyikan tabel
    if (cart.length === 0) {
        cartEmpty.style.display = "block";
        cartContent.style.display = "none";
        return;
    }
    cartEmpty.style.display = "none";
    cartContent.style.display = "block";

    // satu baris tabel untuk tiap item
    const output = [];
    cart.forEach((item)=> {
        const food = foods.find((f) => f.id === item.id);
        const subtotal = food.harga * item.qty;
        output.push(
            `<tr>
                <td>${food.nama}</td>
                <td>${formatRupiah(food.harga)}</td>
                <td>
                    <button class="qty-btn" onclick="ubahQty(${food.id}, -1)">-</button>
                    ${item.qty}
                    <button class="qty-btn" onclick="ubahQty(${food.id}, 1)">+</button>
                </td>
                <td>${formatRupiah(subtotal)}</td>
                <td><button class="hapus-btn" onclick="hapusItem(${food.id})">Hapus</button></td>
            </tr>`
        );
    });
    cartBody.innerHTML = output.join("");

    document.getElementById("total-harga").innerHTML = formatRupiah(hitungTotal(cart));

    //Ringkasan gizi
    if (typeof renderNutrisiCart === "function") {
        renderNutrisiCart(cart);
    }
 }
 //Memanggil saat form dikirim
 function submitOrder(event) {
    event.preventDefault(); //mencegah halaman ke-reload

    const nama = document.getElementById("nama").value;
    const meja = document.getElementById("meja").value;
    const bayar = document.getElementById("bayar").value;
    const catatan = document.getElementById("catatan").value;
    const cart = ambilCart();

    //Validasi
    if (nama === "" || meja === "" || bayar === "") {
        alert("Nama, nomor meja, dan metode bayar wajib diisi.");
        return;
    }

    //menyusun data pesanan
    const pesanan = {
        nama : nama,
        meja: meja,
        bayar: bayar,
        catatan: catatan,
        items: cart,
        total: hitungTotal(cart),
        waktu: new Date().toLocaleString("id-ID"),
    };

    //simpan ke riwayat pesanan
    const riwayatTersimpan = localStorage.getItem("nutricafe-riwayat");
    let riwayat = [];
    if (riwayatTersimpan) {
        riwayat = JSON.parse(riwayatTersimpan);
    }
    riwayat.push(pesanan);
    localStorage.setItem("nutricafe-riwayat", JSON.stringify(riwayat));

    //menampilkan pesan "sukses"
    document.getElementById("order-success").innerHTML =
    `<h3> Pesanan telah masuk!</h3>
    <p> Terima kasih, ${nama}. Pesanan untuk meja ${meja} sedang disiapkan.</p>
    <p>Total: ${formatRupiah(pesanan.total)} · Bayar: ${bayar}</p>`;

    //mengosongkan form dan keranjang setelahnya
    document.getElementById("order-form").reset();
    kosongkanCart();
    document.getElementById("cart-empty").style.display = "none";
 }
renderCart()