let pasienAntrean = 0;
let pasienSelesai = 0;
let totalPasienMasuk = 0;
let totalWaktuPelayanan = 0;
let waktuMulai = Date.now();
let intervalSimulasi;
let running = false;
let riwayat = [];

function integralTrapezoidal(f, a, b, n = 1000) {
    let h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) sum += f(a + i * h);
    return sum * h;
}

function fungsiWaktuPelayanan(t) {
    let rata2 = totalWaktuPelayanan / (pasienSelesai || 1);
    let lambda = 1 / rata2;
    return lambda * Math.exp(-lambda * t);
}

function tambahPasien() {
    let nama = prompt("Masukkan nama pasien:");
    let waktuMasuk = prompt("Masukkan waktu masuk (HH:MM):");
    let waktuKeluar = prompt("Masukkan waktu selesai (HH:MM):");

    if (!nama || !waktuMasuk || !waktuKeluar) return alert("Data pasien tidak lengkap.");

    pasienAntrean++;
    totalPasienMasuk++;

    riwayat.push({ nama, waktuMasuk, waktuKeluar });
    updateRiwayat();
    updateTampilan();

    if (!running) mulaiSimulasi();
}

function batalPasien() {
    if (pasienAntrean > 0) {
        pasienAntrean--;
        updateTampilan();
    }
}

function hapusAntrean() {
    pasienSelesai += pasienAntrean;
    pasienAntrean = 0;
    updateTampilan();
}

function updateTampilan() {
    document.getElementById("pasienAntrean").textContent = pasienAntrean;
    document.getElementById("pasienSelesai").textContent = pasienSelesai;

    let waktuSekarang = (Date.now() - waktuMulai) / 60000;
    totalWaktuPelayanan = waktuSekarang;
    let rataRata = pasienSelesai > 0 ? (totalWaktuPelayanan / pasienSelesai).toFixed(2) : 0;
    let estimasi = (pasienAntrean * rataRata).toFixed(2);

    document.getElementById("waktuPelayanan").textContent = rataRata;
    document.getElementById("estimasiSelesai").textContent = estimasi;
}

function mulaiSimulasi() {
    running = true;
    intervalSimulasi = setInterval(() => {
        if (pasienAntrean > 0) {
            pasienAntrean--;
            pasienSelesai++;
        }
        updateTampilan();
    }, 10000);
}

function updateRiwayat() {
    const tbody = document.getElementById("riwayatPasien");
    tbody.innerHTML = "";
    riwayat.forEach(item => {
        let row = `<tr><td>${item.nama}</td><td>${item.waktuMasuk}</td><td>${item.waktuKeluar}</td></tr>`;
        tbody.innerHTML += row;
    });
}

function toggleDisclaimer() {
    const disc = document.getElementById("disclaimer");
    disc.style.display = disc.style.display === "block" ? "none" : "block";
}

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    clock.textContent = timeString;
    setTimeout(updateClock, 1000);
}

updateClock();