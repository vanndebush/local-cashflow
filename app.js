const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc-input');
const amountInput = document.getElementById('amount-input');
const typeInput = document.getElementById('type-input');
const transactionList = document.getElementById('transaction-list');
const balanceText = document.getElementById('total-balance');
const incomeText = document.getElementById('total-income');
const expenseText = document.getElementById('total-expense');

let transactions = JSON.parse(localStorage.getItem('cashflow_data')) || [];

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

  const newTransaction = {
    id: Date.now().toString(),
    desc: descValue,
    amount: amountValue,
    type: typeValue
  };

  transactions.push(newTransaction);
  updateLocalStorage();
  form.reset();
  renderTransactions();
});

renderTransactions();