const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc-input');
const amountInput = document.getElementById('amount-input');
const typeInput = document.getElementById('type-input');
const transactionList = document.getElementById('transaction-list');
const balanceText = document.getElementById('total-balance');
const incomeText = document.getElementById('total-income');
const expenseText = document.getElementById('total-expense');

let transactions = JSON.parse(localStorage.getItem('cashflow_data')) || [];
let editId = null;

const updateLocalStorage = () => {
  localStorage.setItem('cashflow_data', JSON.stringify(transactions))
};
const updateBalances = () => {
  const incomes = transactions.filter(transaction => transaction.type === 'income');
  const expenses = transactions.filter(transaction => transaction.type === 'expense');
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  balanceText.innerHTML = `Rp${totalBalance.toLocaleString('id-ID')},00`;
  incomeText.innerHTML = `Rp${totalIncome.toLocaleString('id-ID')},00`;
  expenseText.innerHTML = `Rp${totalExpense.toLocaleString('id-ID')},00`;
};
const renderTransactions = () => {
  const template = transactions.map(transaction => `
    <li class="transaction-item ${transaction.type}">
      <span class="desc">${transaction.desc}</span>
      <span class="amount">${transaction.type === 'income' ? '+' : '-'}Rp${transaction.amount.toLocaleString('id-ID')},00</span>
      <button class="btn-delete" data-id="${transaction.id}">&#x2715;</button>
    </li>
  `).join('');
  transactionList.innerHTML = template || '<p class="empty-msg">No transactions yet.</p>';

  updateBalances();
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const descValue = descInput.value;
  const amountValue = parseInt(amountInput.value);
  const typeValue = typeInput.value;

  if (editId) {
    transactions = transactions.map(transaction => {
      if (transaction.id === editId) {
        return {
          id: transaction.id,
          desc: descValue,
          amount: amountValue,
          type: typeValue
        };
      }
      return transaction;
    });
    editId = null;
    document.getElementById('add-btn').textContent = 'Add Transaction';
  } else {
    const newTransaction = {
      id: Date.now().toString(),
      desc: descValue,
      amount: amountValue,
      type: typeValue
    };
    transactions.push(newTransaction);
  }

  updateLocalStorage();
  form.reset();
  renderTransactions();
});
transactionList.addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('btn-delete')) {
    if (!confirm('Delete this transaction?')) return;
    const transactionId = e.target.dataset.id;
    transactions = transactions.filter(transaction => transaction.id !== transactionId);
    updateLocalStorage();
    renderTransactions();
  }
});
transactionList.addEventListener('dblclick', e => {
  e.preventDefault();

  const item = e.target.closest('.transaction-item');

  if (item) {
    const btnDelete = item.querySelector('.btn-delete');
    const transactionId = btnDelete.dataset.id;
    const transaction = transactions.find(transaction => transaction.id === transactionId);

    if (transaction) {
      descInput.value = transaction.desc;
      amountInput.value = transaction.amount;
      typeInput.value = transaction.type;

      editId = transactionId;
      document.getElementById('add-btn').textContent = 'Update Transaction';

      descInput.focus();
    }
  }
});

renderTransactions();