import React from 'react';
import moment from 'moment';

type Transaction = {
  id: number;
  amount: number;
  balance: number;
  type: string;
  date: string;
};

type TransactionListProps = {
  transactions: Transaction[];
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const date = new Date();

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
            {transactions.map((transaction, index) => {
            // Determine whether to prefix with '+' or '-'
            const isFirstRow = index === 0;
            const isLastRow = index === transactions.length - 1;
            
            // If it's not the last row, compare with the next row's balance
            const nextTransactionBalance = !isLastRow ? transactions[index + 1].balance : transaction.balance;

            // Prefix logic
            const amountPrefix = transaction.balance > nextTransactionBalance ? '+' : transaction.balance < nextTransactionBalance ? '-' : '+';
            
            return (
                <tr key={transaction.id}>
                <td className="px-4 py-2">{moment(new Date(transaction.date)).format("DD.MM.YYYY")}</td>
                <td className="px-4 py-2 text-right">{amountPrefix}{transaction.amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{transaction.balance.toFixed(2)}</td>
                </tr>
            );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
