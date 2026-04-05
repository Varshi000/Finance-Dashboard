import { useState, useEffect } from 'react';

const TransactionForm = ({ onAddTransaction, onUpdateTransaction, onClose, editingTransaction }) => {
  const [formData, setFormData] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense'
  });
  
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Income'];
  
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        id: editingTransaction.id,
        date: editingTransaction.date,
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type
      });
    }
  }, [editingTransaction]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    if (editingTransaction) {
      onUpdateTransaction(transactionData);
    } else {
      transactionData.id = Date.now();
      onAddTransaction(transactionData);
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm mb-1 font-medium">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1 font-medium">Description</label>
            <input
              type="text"
              required
              placeholder="e.g., Grocery Shopping"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1 font-medium">Amount ($)</label>
            <input
              type="number"
              required
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className={formData.type === 'expense' ? 'text-red-600' : 'text-gray-600'}>
                  💸 Expense
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className={formData.type === 'income' ? 'text-green-600' : 'text-gray-600'}>
                  💰 Income
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;