import { useState } from 'react';
import { transactions as initialTransactions, calculateSummary } from './data/mockData';
import BalanceTrendChart from './components/Dashboard/BalanceTrendChart';
import SpendingBreakdownChart from './components/Dashboard/SpendingBreakdownChart';
import InsightCards from './components/Insights/InsightCards';
import TransactionForm from './components/Transactions/TransactionForm';

function App() {
  // State Management
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Calculate summary
  const { totalIncome, totalExpenses, balance } = calculateSummary(transactions);
  
  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Handlers
  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };
  
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };
  
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddForm(true);
  };
  
  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              💰 Finance Dashboard
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Admin Add Button */}
              {role === 'admin' && (
                <button
                  onClick={() => {
                    setEditingTransaction(null);
                    setShowAddForm(true);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                >
                  <span>+</span> Add Transaction
                </button>
              )}
              
              {/* Role Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Role:</span>
                <button
                  onClick={() => setRole('viewer')}
                  className={`px-4 py-2 rounded-lg transition ${
                    role === 'viewer' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  👁️ Viewer
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`px-4 py-2 rounded-lg transition ${
                    role === 'admin' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ✏️ Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <p className="text-gray-500 text-sm mb-1">Total Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Current net worth</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <p className="text-gray-500 text-sm mb-1">Total Income</p>
            <p className="text-3xl font-bold text-green-600">
              +${totalIncome.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-2">All time earnings</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">
              -${totalExpenses.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-2">All time spending</p>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Balance Trend</h2>
            <BalanceTrendChart transactions={transactions} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🥧 Spending Breakdown</h2>
            <SpendingBreakdownChart transactions={transactions} />
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">💡 Financial Insights</h2>
          <InsightCards transactions={transactions} />
        </div>
        
        {/* Transactions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">📋 Transaction History</h2>
          
          {/* Filters and Sorting */}
          <div className="bg-white rounded-lg shadow-md mb-4 p-4">
            <div className="flex flex-wrap gap-4">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'income' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Expenses
                </button>
              </div>
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="🔍 Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Sorting Controls */}
              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                          if (sortBy === 'date') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('date');
                            setSortOrder('desc');
                          }
                        }}>
                        Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-4">Description</th>
                    <th className="text-left p-4 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                          if (sortBy === 'category') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('category');
                            setSortOrder('asc');
                          }
                        }}>
                        Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right p-4 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                          if (sortBy === 'amount') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('amount');
                            setSortOrder('desc');
                          }
                        }}>
                        Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    {role === 'admin' && <th className="text-center p-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">{transaction.date}</td>
                      <td className="p-4 font-medium">{transaction.description}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`text-right p-4 font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                      {role === 'admin' && (
                        <td className="text-center p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="text-blue-500 hover:text-blue-700 font-medium transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-red-500 hover:text-red-700 font-medium transition"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sortedTransactions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  📭 No transactions found
                  {searchTerm && ' matching your search'}
                </div>
              )}
            </div>
          </div>
          
          {/* Transaction Summary */}
          {sortedTransactions.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing {sortedTransactions.length} of {transactions.length} transactions
            </div>
          )}
        </div>
        
        {/* Role-based info message */}
        <div className="mt-6 text-center">
          {role === 'viewer' && (
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm">
              👁️ Viewer Mode - You can only view transactions. Switch to Admin to add, edit, or delete.
            </div>
          )}
          {role === 'admin' && (
            <div className="inline-block bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">
              ✏️ Admin Mode - You can add, edit, and delete transactions
            </div>
          )}
        </div>
      </main>
      
      {/* Add/Edit Transaction Modal */}
      {showAddForm && (
        <TransactionForm 
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onClose={() => {
            setShowAddForm(false);
            setEditingTransaction(null);
          }}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
}

export default App;