let pasienAntrean = 0;
let pasienSelesai = 0;
let totalPasienMasuk = 0;
let totalWaktuPelayanan = 0;
let waktuMulai = Date.now();
let intervalSimulasi;
let running = false;

// Fungsi integral numerik menggunakan metode trapezoidal
function integralTrapezoidal(f, a, b, n = 1000) {
    let h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));

    for (let i = 1; i < n; i++) {
        let x = a + i * h;
        sum += f(x);
    }
    
    return sum * h;
}

// Fungsi distribusi eksponensial untuk simulasi waktu pelayanan
function fungsiWaktuPelayanan(t) {
    let lambda = 1 / (totalWaktuPelayanan / (pasienSelesai || 1)); // λ = 1/rata-rata waktu pelayanan
    return lambda * Math.exp(-lambda * t);
}

function tambahPasien() {
    pasienAntrean++;
    totalPasienMasuk++;
    updateTampilan();
    
    // Mulai simulasi jika belum berjalan
    if (!running) {
        mulaiSimulasi();
    }
}

function batalPasien() {
    if (pasienAntrean > 0) {
        pasienAntrean--;
        totalPasienMasuk--; // Karena pasien batal masuk
    }
    updateTampilan();
}

function hapusAntrean() {
    if (pasienAntrean > 0) {
        pasienAntrean--;
        pasienSelesai++;

        // Simpan waktu pelayanan untuk menghitung integral
        let waktuSekarang = Date.now();
        let waktuPelayanan = (waktuSekarang - waktuMulai) / 60000; // Konversi ke menit
        totalWaktuPelayanan += waktuPelayanan;
        waktuMulai = waktuSekarang;
    }
    updateTampilan();
}

function mulaiSimulasi() {
    running = true;

    intervalSimulasi = setInterval(() => {
        // Hitung integral untuk waktu pelayanan ekspektasi
        let waktuPelayananRata2 = pasienSelesai > 0 ? integralTrapezoidal(fungsiWaktuPelayanan, 0, 10) : 0;

        // Perkirakan waktu hingga semua pasien selesai
        let estimasiSelesai = pasienAntrean * waktuPelayananRata2;

        // Update tampilan
        document.getElementById("waktuPelayanan").textContent = waktuPelayananRata2.toFixed(2);
        document.getElementById("estimasiSelesai").textContent = estimasiSelesai.toFixed(2);
    }, 1000); // Update setiap 1 detik
}

function updateTampilan() {
    document.getElementById("pasienAntrean").textContent = pasienAntrean;
    document.getElementById("pasienSelesai").textContent = pasienSelesai;
}