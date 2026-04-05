export const transactions = [
  {
    id: 1,
    date: '2024-03-15',
    description: 'Grocery Shopping',
    amount: 125.50,
    category: 'Food',
    type: 'expense'
  },
  {
    id: 2,
    date: '2024-03-14',
    description: 'Salary Deposit',
    amount: 3500.00,
    category: 'Income',
    type: 'income'
  },
  {
    id: 3,
    date: '2024-03-13',
    description: 'Uber Ride',
    amount: 15.75,
    category: 'Transport',
    type: 'expense'
  },
  {
    id: 4,
    date: '2024-03-12',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: 5,
    date: '2024-03-11',
    description: 'Restaurant Dinner',
    amount: 45.20,
    category: 'Food',
    type: 'expense'
  },
  {
    id: 6,
    date: '2024-03-10',
    description: 'Freelance Payment',
    amount: 500.00,
    category: 'Income',
    type: 'income'
  },
  {
    id: 7,
    date: '2024-03-09',
    description: 'Electric Bill',
    amount: 85.30,
    category: 'Bills',
    type: 'expense'
  },
  {
    id: 8,
    date: '2024-03-08',
    description: 'Amazon Shopping',
    amount: 89.99,
    category: 'Shopping',
    type: 'expense'
  },
  {
    id: 9,
    date: '2024-03-07',
    description: 'Gym Membership',
    amount: 50.00,
    category: 'Health',
    type: 'expense'
  },
  {
    id: 10,
    date: '2024-03-06',
    description: 'Dividend Payment',
    amount: 75.00,
    category: 'Income',
    type: 'income'
  }
];

export const calculateSummary = (transactions) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  return { totalIncome, totalExpenses, balance };
};

export const getCategorySpending = (transactions) => {
  const categoryMap = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    });
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};