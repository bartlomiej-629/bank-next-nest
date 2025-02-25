import { useState } from 'react';
import { useRouter } from 'next/router';

// Define types for the different types of transaction bodies
type DepositWithdrawBody = {
  iban: string;
  amount: number;
};

type TransferBody = {
  fromIban: string;
  toIban: string;
  amount: number;
};

const AccountForm = ({ type }: { type: 'deposit' | 'withdraw' | 'transfer' }) => {
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState(0);
  const [toIban, setToIban] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let url = '';
      let method = 'POST';
      let body: DepositWithdrawBody | TransferBody = { iban, amount };

      if (type === 'transfer') {
        url = 'http://localhost:3000/accounts/transfer';
        body = { fromIban: iban, toIban, amount };  // Now this is allowed
      } else if (type === 'deposit') {
        url = 'http://localhost:3000/accounts/deposit';
        body = { iban, amount };
      } else if (type === 'withdraw') {
        url = 'http://localhost:3000/accounts/withdraw';
        body = { iban, amount };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Transaction successful! New Balance: ${result.balance}`);
        router.push('/statement'); // Redirect to account statement
      } else {
        setError(result.message || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto mt-8">
      <div className="space-y-2">
        <label htmlFor="iban" className="text-sm text-gray-700">IBAN</label>
        <input
          id="iban"
          type="text"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {type === 'transfer' && (
        <div className="space-y-2">
          <label htmlFor="toIban" className="text-sm text-gray-700">Recipient IBAN</label>
          <input
            id="toIban"
            type="text"
            value={toIban}
            onChange={(e) => setToIban(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm text-gray-700">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdraw' : 'Transfer'}
      </button>
    </form>
  );
};

export default AccountForm;
