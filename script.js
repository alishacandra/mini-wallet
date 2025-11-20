// =========================
//    INITIAL LOCAL DATA
// =========================
let walletData = JSON.parse(localStorage.getItem("miniWallet")) || {
  balance: 0,
  dailyLimit: 50000,          // batas harian default
  spentToday: 0,
  lastDate: new Date().toDateString(),
  history: [],
  pin: "1234"                 // PIN default
};

// Reset harian otomatis
function checkDailyReset() {
  const today = new Date().toDateString();
  if (walletData.lastDate !== today) {
    walletData.spentToday = 0;
    walletData.lastDate = today;
    saveData();
  }
}
checkDailyReset();

// =========================
//     SAVE TO LOCAL STORAGE
// =========================
function saveData() {
  localStorage.setItem("miniWallet", JSON.stringify(walletData));
  updateUI();
}

// =========================
//       LOGIN SYSTEM
// =========================
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const pinInput = document.getElementById("pinInput");
const loginBtn = document.getElementById("loginBtn");
const notif = document.getElementById("notif");

loginBtn.addEventListener("click", () => {
  if (pinInput.value === walletData.pin) {
    loginPage.style.display = "none";
    appPage.style.display = "block";
  } else {
    pinInput.classList.add("shake");
    setTimeout(() => pinInput.classList.remove("shake"), 600);
  }
});

// =========================
//          UI ELEMENTS
// =========================
const balanceText = document.getElementById("balance");
const progressBar = document.getElementById("progressBar");
const progressPct = document.getElementById("progressPct");
const historyList = document.getElementById("historyList");

// =========================
//       UPDATE UI
// =========================
function updateUI() {
  balanceText.textContent = "Rp " + walletData.balance.toLocaleString();

  // progress bar %
  let percent = (walletData.spentToday / walletData.dailyLimit) * 100;
  if (percent > 100) percent = 100;
  progressBar.style.width = percent + "%";
  progressPct.textContent = Math.floor(percent) + "% digunakan";

  // Update riwayat
  historyList.innerHTML = "";
  walletData.history.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.type} Rp ${item.amount.toLocaleString()} (${item.date})`;
    historyList.appendChild(li);
  });
}
updateUI();

// =========================
//      NOTIF FUNCTION
// =========================
function showNotif(text) {
  notif.textContent = text;
  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 1500);
}

// =========================
//    BUTTON ACTIONS
// =========================
const addBtn = document.getElementById("addBtn");
const noteBtn = document.getElementById("noteBtn");
const historyBtn = document.getElementById("historyBtn");
const editSaldoBtn = document.getElementById("editSaldoBtn");

// Tambah saldo
addBtn.addEventListener("click", () => {
  const amount = prompt("Masukkan jumlah saldo yang ingin ditambahkan (Rp):");
  const val = parseInt(amount);
  if (!val || val <= 0) return;

  walletData.balance += val;
  walletData.history.push({ type: "Tambah Saldo", amount: val, date: new Date().toLocaleDateString() });
  saveData();
  showNotif("Saldo bertambah ✔");
});

// Catat pengeluaran
noteBtn.addEventListener("click", () => {
  const amount = prompt("Masukkan jumlah pengeluaran hari ini (Rp):");
  const val = parseInt(amount);
  if (!val || val <= 0) return;

  if (val > walletData.balance) {
    showNotif("Saldo tidak cukup ❌");
    return;
  }

  if (walletData.spentToday + val > walletData.dailyLimit) {
    showNotif("Melewati limit harian ❗");
    return;
  }

  walletData.balance -= val;
  walletData.spentToday += val;
  walletData.history.push({ type: "Pengeluaran", amount: val, date: new Date().toLocaleDateString() });
  saveData();
  showNotif("Pengeluaran tercatat ✔");
});

// Tampilkan riwayat
historyBtn.addEventListener("click", () => {
  if (historyList.style.display === "block") {
    historyList.style.display = "none";
  } else {
    historyList.style.display = "block";
  }
});

// Ubah saldo awal
editSaldoBtn.addEventListener("click", () => {
  const amount = prompt("Masukkan saldo baru (Rp):");
  const val = parseInt(amount);
  if (!val || val < 0) return;

  walletData.balance = val;
  walletData.history.push({ type: "Saldo diubah", amount: val, date: new Date().toLocaleDateString() });
  saveData();
  showNotif("Saldo diubah ✔");
});
