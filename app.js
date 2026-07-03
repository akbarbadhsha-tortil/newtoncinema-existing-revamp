const STORAGE_KEY = "finance-tracker:v1";

const defaultCategories = [
  "Salary",
  "Freelance",
  "Groceries",
  "Rent",
  "Utilities",
  "Transport",
  "Dining",
  "Health",
  "Shopping",
  "Entertainment",
  "Savings",
];

const state = loadState();

const els = {
  totalIncome: document.getElementById("totalIncome"),
  totalExpense: document.getElementById("totalExpense"),
  net: document.getElementById("net"),
  txnForm: document.getElementById("txnForm"),
  type: document.getElementById("type"),
  amount: document.getElementById("amount"),
  category: document.getElementById("category"),
  date: document.getElementById("date"),
  note: document.getElementById("note"),
  txnList: document.getElementById("txnList"),
  filterType: document.getElementById("filterType"),
  filterCategory: document.getElementById("filterCategory"),
  budgets: document.getElementById("budgets"),
  addBudget: document.getElementById("addBudget"),
  budgetDialog: document.getElementById("budgetDialog"),
  budgetForm: document.getElementById("budgetForm"),
  budgetCategory: document.getElementById("budgetCategory"),
  budgetAmount: document.getElementById("budgetAmount"),
  budgetCancel: document.getElementById("budgetCancel"),
};

init();

function init() {
  seedDefaults();
  hydrateCategorySelects();
  setToday();
  render();

  els.txnForm.addEventListener("submit", onAddTxn);
  els.filterType.addEventListener("change", renderTransactions);
  els.filterCategory.addEventListener("change", renderTransactions);
  els.addBudget.addEventListener("click", () => els.budgetDialog.showModal());
  els.budgetCancel.addEventListener("click", () => els.budgetDialog.close());
  els.budgetForm.addEventListener("submit", onSaveBudget);
}

function seedDefaults() {
  if (!state.categories || state.categories.length === 0) {
    state.categories = defaultCategories.slice();
  }
  if (!state.budgets) state.budgets = {};
  if (!state.transactions) state.transactions = [];
  persist();
}

function setToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  els.date.value = `${yyyy}-${mm}-${dd}`;
}

function hydrateCategorySelects() {
  fillSelect(els.category, state.categories);
  fillSelect(els.filterCategory, ["all", ...state.categories], true);
  fillSelect(els.budgetCategory, state.categories);
}

function fillSelect(select, values, keepValue = false) {
  const current = select.value;
  select.innerHTML = "";
  values.forEach((val) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val === "all" ? "All Categories" : val;
    select.appendChild(opt);
  });
  if (keepValue && values.includes(current)) select.value = current;
}

function onAddTxn(e) {
  e.preventDefault();
  const txn = {
    id: crypto.randomUUID(),
    type: els.type.value,
    amount: Number(els.amount.value),
    category: els.category.value,
    date: els.date.value,
    note: els.note.value.trim(),
  };

  if (!txn.amount || txn.amount <= 0) return;

  state.transactions.unshift(txn);
  persist();
  els.txnForm.reset();
  setToday();
  render();
}

function onSaveBudget(e) {
  e.preventDefault();
  const category = els.budgetCategory.value;
  const amount = Number(els.budgetAmount.value);
  if (!category || amount < 0) return;
  state.budgets[category] = amount;
  persist();
  els.budgetDialog.close();
  els.budgetForm.reset();
  renderBudgets();
}

function render() {
  renderSummary();
  renderBudgets();
  renderTransactions();
}

function renderSummary() {
  const income = sumByType("income");
  const expense = sumByType("expense");
  const net = income - expense;

  els.totalIncome.textContent = money(income);
  els.totalExpense.textContent = money(expense);
  els.net.textContent = money(net);
  els.net.style.color = net >= 0 ? "#86efac" : "#fca5a5";
}

function renderBudgets() {
  els.budgets.innerHTML = "";
  const categories = state.categories.slice();
  categories.forEach((cat) => {
    const limit = state.budgets[cat];
    if (limit === undefined) return;

    const spent = sumByCategory(cat, "expense");
    const percent = limit === 0 ? 0 : Math.min(100, (spent / limit) * 100);
    const bar = document.createElement("div");
    bar.className = "bar";
    if (percent >= 90) bar.classList.add("danger");
    else if (percent >= 75) bar.classList.add("warn");
    bar.style.width = `${percent}%`;

    const wrapper = document.createElement("div");
    wrapper.className = "budget";
    wrapper.innerHTML = `
      <div class="row" style="grid-template-columns: 1fr 110px; padding: 0; border: none; background: transparent;">
        <div>
          <strong>${cat}</strong>
          <div class="muted" style="color: var(--muted); font-size: 12px;">Spent ${money(spent)} of ${money(limit)}</div>
        </div>
        <div class="right">${percent.toFixed(0)}%</div>
      </div>
      <div class="progress"></div>
    `;
    wrapper.querySelector(".progress").appendChild(bar);

    const remove = document.createElement("button");
    remove.className = "ghost";
    remove.style.marginTop = "10px";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      delete state.budgets[cat];
      persist();
      renderBudgets();
    });
    wrapper.appendChild(remove);

    els.budgets.appendChild(wrapper);
  });

  if (els.budgets.children.length === 0) {
    els.budgets.innerHTML = "<p class='sub'>No budgets yet. Add one to track limits.</p>";
  }
}

function renderTransactions() {
  const type = els.filterType.value;
  const category = els.filterCategory.value;
  const list = state.transactions.filter((t) => {
    const typeMatch = type === "all" || t.type === type;
    const catMatch = category === "all" || t.category === category;
    return typeMatch && catMatch;
  });

  els.txnList.innerHTML = "";
  list.forEach((t) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <span>${t.date}</span>
      <span class="badge ${t.type}">${t.type}</span>
      <span>${t.category}</span>
      <span>${t.note || "-"}</span>
      <span class="right">${money(t.amount)}</span>
      <button class="ghost" aria-label="Delete">✕</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.transactions = state.transactions.filter((x) => x.id !== t.id);
      persist();
      render();
    });
    els.txnList.appendChild(row);
  });

  if (list.length === 0) {
    els.txnList.innerHTML = "<p class='sub'>No transactions yet.</p>";
  }
}

function sumByType(type) {
  return state.transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0);
}

function sumByCategory(category, type) {
  return state.transactions
    .filter((t) => t.category === category && (!type || t.type === type))
    .reduce((acc, t) => acc + t.amount, 0);
}

function money(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
