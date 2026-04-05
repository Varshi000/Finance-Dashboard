import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

const InsightCards = ({ transactions }) => {
  // Calculate insights
  const getHighestSpendingCategory = () => {
    const categoryMap = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      });
    
    let highest = { name: 'None', amount: 0 };
    Object.entries(categoryMap).forEach(([name, amount]) => {
      if (amount > highest.amount) {
        highest = { name, amount };
      }
    });
    
    return highest;
  };
  
  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let currentMonthTotal = 0;
    let previousMonthTotal = 0;
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      if (year === currentYear) {
        if (month === currentMonth) {
          currentMonthTotal += t.type === 'expense' ? t.amount : 0;
        } else if (month === currentMonth - 1) {
          previousMonthTotal += t.type === 'expense' ? t.amount : 0;
        }
      }
    });
    
    const change = previousMonthTotal === 0 
      ? 100 
      : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100);
    
    return {
      current: currentMonthTotal,
      previous: previousMonthTotal,
      change: parseFloat(change.toFixed(1)),
      increased: change > 0
    };
  };
  
  const getAverageTransaction = () => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avg = transactions.length === 0 ? 0 : total / transactions.length;
    return parseFloat(avg.toFixed(2));
  };
  
  const getSavingRate = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome === 0) return 0;
    const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    return parseFloat(rate.toFixed(1));
  };
  
  const highestCategory = getHighestSpendingCategory();
  const monthlyComp = getMonthlyComparison();
  const avgTransaction = getAverageTransaction();
  const savingRate = getSavingRate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Highest Spending Category */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Highest Spending</h3>
          <TrendingDown size={20} />
        </div>
        <p className="text-2xl font-bold">{highestCategory.name}</p>
        <p className="text-sm opacity-90">${highestCategory.amount.toFixed(2)} total</p>
      </div>
      
      {/* Monthly Comparison */}
      <div className={`bg-gradient-to-br rounded-lg shadow p-4 text-white ${
        monthlyComp.increased ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">vs Last Month</h3>
          {monthlyComp.increased ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <p className="text-2xl font-bold">{Math.abs(monthlyComp.change)}%</p>
        <p className="text-sm opacity-90">
          {monthlyComp.increased ? 'Higher' : 'Lower'} spending than last month
        </p>
      </div>
      
      {/* Average Transaction */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Avg Transaction</h3>
          <DollarSign size={20} />
        </div>
        <p className="text-2xl font-bold">${avgTransaction}</p>
        <p className="text-sm opacity-90">per transaction</p>
      </div>
      
      {/* Saving Rate */}
      <div className={`bg-gradient-to-br rounded-lg shadow p-4 text-white ${
        savingRate >= 20 ? 'from-green-500 to-green-600' : 
        savingRate >= 0 ? 'from-yellow-500 to-yellow-600' : 
        'from-red-500 to-red-600'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Saving Rate</h3>
          <AlertCircle size={20} />
        </div>
        <p className="text-2xl font-bold">{savingRate}%</p>
        <p className="text-sm opacity-90">
          {savingRate >= 20 ? 'Excellent!' : 
           savingRate >= 0 ? 'Good, could improve' : 
           'Spending more than earning'}
        </p>
      </div>
    </div>
  );
};

export default InsightCards;