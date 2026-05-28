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

const renderTransactions = () => {
  console.log(transactions);
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