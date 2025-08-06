import React, { useState } from 'react';
import { CreditCard, Wallet, History, Plus, Minus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [balance] = useState(2500.00);
  const [transactions] = useState([
    {
      id: 1,
      type: 'payment',
      amount: -1500.00,
      description: 'Оплата консультации врача',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'deposit',
      amount: 3000.00,
      description: 'Пополнение кошелька',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 3,
      type: 'payment',
      amount: -800.00,
      description: 'Экстренный вызов',
      date: '2024-01-08',
      status: 'completed'
    }
  ]);

  const [paymentMethods] = useState([
    {
      id: 1,
      name: 'ЮKassa',
      icon: '💳',
      description: 'Банковские карты'
    },
    {
      id: 2,
      name: 'СБП',
      icon: '📱',
      description: 'Система быстрых платежей'
    },
    {
      id: 3,
      name: 'Кошелек',
      icon: '💰',
      description: 'Внутренний баланс'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Платежи
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управляйте платежами и балансом
        </p>
      </div>

      {/* Balance Card */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Баланс кошелька</h2>
            <p className="text-3xl font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button className="btn btn-white flex items-center space-x-2">
            <Plus size={16} />
            <span>Пополнить</span>
          </button>
          <button className="btn btn-white flex items-center space-x-2">
            <ArrowUpRight size={16} />
            <span>Вывести</span>
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Способы оплаты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Последние транзакции
        </h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowDownLeft size={20} className="text-green-600" />
                  ) : (
                    <ArrowUpRight size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'deposit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {transaction.status === 'completed' ? 'Завершено' : 'В обработке'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="btn btn-secondary w-full mt-4">
          <History size={16} className="mr-2" />
          Показать все транзакции
        </button>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn btn-primary flex items-center space-x-2">
            <CreditCard size={16} />
            <span>Оплатить консультацию</span>
          </button>
          <button className="btn btn-secondary flex items-center space-x-2">
            <Wallet size={16} />
            <span>Пополнить кошелек</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 