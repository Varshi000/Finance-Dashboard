import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BalanceTrendChart = ({ transactions }) => {
  // Group transactions by date and calculate daily balance
  const getDailyBalance = () => {
    const dailyData = {};
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    let runningBalance = 0;
    
    sortedTransactions.forEach(t => {
      if (t.type === 'income') {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      
      const date = t.date;
      if (!dailyData[date]) {
        dailyData[date] = { date, balance: runningBalance };
      } else {
        dailyData[date].balance = runningBalance;
      }
    });
    
    return Object.values(dailyData);
  };
  
  const data = getDailyBalance();
  
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available for chart
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceTrendChart;