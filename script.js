// =========================
//    INITIAL LOCAL DATA
// =========================
let walletData = JSON.parse(localStorage.getItem("miniWallet")) || {
    balance: 0,
    dailyLimit: 50000,       // batas harian default
    spentToday: 0,
    lastDate: new Date().toDateString(),
    pin: "1234",             // PIN default
    history: []
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
const walletPage = document.getElementById("walletPage");
const pinInput = document.getElementById("pinInput");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
    if (pinInput.value === walletData.pin) {
        loginPage.classList.add("hidden");
        walletPage.classList.remove("hidden");
        updateUI();
    } else {
        pinInput.classList.add("shake");
        setTimeout(() => pinInput.classList.remove("shake"), 600);
    }
});

// =========================
//       ELEMENTS
// =========================
const balanceDisplay = document.getElementById("balanceDisplay");
const dailyProgress = document.getElementById("dailyProgress");
const dailyProgressText = document.getElementById("dailyProgressText");
const historyList = document.getElementById("historyList");

const incomeInput = document.getElementById("incomeInput");
const addIncomeBtn = document.getElementById("addIncome");

const expenseInput = document.getElementById("expenseInput");
const addExpenseBtn = document.getElementById("addExpense");

// =========================
//       UPDATE UI
// =========================
function updateUI() {
    // Tampilkan saldo
    balanceDisplay.textContent = "Rp " + walletData.balance.toLocaleString();

    // Update progress bar harian
    let percent = (walletData.spentToday / walletData.dailyLimit) * 100;
    if (percent > 100) percent = 100;
    dailyProgress.style.width = percent + "%";
    dailyProgressText.textContent = Math.floor(percent) + "% digunakan";

    // Update riwayat transaksi
    historyList.innerHTML = "";
    walletData.history.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.type} Rp ${item.amount.toLocaleString()} (${item.date})`;
        historyList.appendChild(li);
    });

    // Simpan data
    localStorage.setItem("miniWallet", JSON.stringify(walletData));
}
updateUI();

// =========================
//       ADD INCOME
// =========================
addIncomeBtn.addEventListener("click", () => {
    let amount = parseInt(incomeInput.value);
    if (!amount || amount <= 0) return;

    walletData.balance += amount;

    walletData.history.push({
        type: "Tambah",
        amount: amount,
        date: new Date().toLocaleString()
    });

    incomeInput.value = "";
    saveData();
});

// =========================
//       ADD EXPENSE
// =========================
addExpenseBtn.addEventListener("click", () => {
    let amount = parseInt(expenseInput.value);
    if (!amount || amount <= 0) return;

    if (amount > walletData.balance) {
        alert("Saldo tidak cukup ❌");
        return;
    }

    if (walletData.spentToday + amount > walletData.dailyLimit) {
        alert("Melewati limit harian ❗");
        return;
    }

    walletData.balance -= amount;
    walletData.spentToday += amount;

    walletData.history.push({
        type: "Pengeluaran",
        amount: amount,
        date: new Date().toLocaleString()
    });

    expenseInput.value = "";
    saveData();
});
