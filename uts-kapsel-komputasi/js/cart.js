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
}


// Tombol Hapus
function hapusItem(id) {
    const cart = ambilCart();
    const cartBaru = cart.filter((item) => item.id !== id);
    simpanCart(cartBaru);
}

//Tombol Kosongkan
function kosongkanCart() {
    simpanCart([]);
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