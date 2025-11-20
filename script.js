// =========================
//    INITIAL LOCAL DATA
// =========================
let walletData = JSON.parse(localStorage.getItem("miniWallet")) || {
  balance: 0,
  dailyLimit: 50000,            // batas harian default
  spentToday: 0,
  lastDate: new Date().toDateString(),
  pin: "1234"                   // PIN default
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

// Simpan ke localStorage
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
//          UI
// =========================
const balanceText = document.getElementById("balance");
const limitText = document.getElementById("limitText");
const spentText = document.getElementById("spentToday");
const progressBar = document.getElementById("progressBar");

// Update tampilan
function updateUI() {
  balanceText.textContent = "Rp " + walletData.balance.toLocaleString();
  limitText.textContent = "Rp " + walletData.dailyLimit.toLocaleString();
  spentText.textContent = "Rp " + walletData.spentToday.toLocaleString();

  // progress bar %
  let percent = (walletData.spentToday / walletData.dailyLimit) * 100;
  if (percent > 100) percent = 100;

  progressBar.style.width = percent + "%";
}
updateUI();

// =========================
//      ADD & SPEND
// =========================
const addAmount = document.getElementById("addAmount");
const spendAmount = document.getElementById("spendAmount");
const addBtn = document.getElementById("addBtn");
const spendBtn = document.getElementById("spendBtn");
const notif = document.getElementById("notif");

// Notifikasi kecil aesthetic
function showNotif(text) {
  notif.textContent = text;
  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 1500);
}

// Tambah saldo
addBtn.addEventListener("click", () => {
  let amount = parseInt(addAmount.value);
  if (!amount || amount <= 0) return;

  walletData.balance += amount;
  saveData();
  showNotif("Saldo bertambah ✔");
  addAmount.value = "";
});

// Pengeluaran
spendBtn.addEventListener("click", () => {
  let amount = parseInt(spendAmount.value);
  if (!amount || amount <= 0) return;

  if (amount > walletData.balance) {
    showNotif("Saldo tidak cukup ❌");
    return;
  }

  // cek batas harian
  if (walletData.spentToday + amount > walletData.dailyLimit) {
    showNotif("Melewati limit harian ❗");
    return;
  }

  walletData.balance -= amount;
  walletData.spentToday += amount;
  saveData();

  showNotif("Pengeluaran tercatat ✔");
  spendAmount.value = "";
});

// =========================
//   UPDATE DAILY LIMIT
// =========================
const newLimitInput = document.getElementById("newLimitInput");
const setLimitBtn = document.getElementById("setLimitBtn");

setLimitBtn.addEventListener("click", () => {
  let newLimit = parseInt(newLimitInput.value);
  if (!newLimit || newLimit <= 0) return;

  walletData.dailyLimit = newLimit;
  saveData();
  showNotif("Limit harian diperbarui ✔");
  newLimitInput.value = "";
});
