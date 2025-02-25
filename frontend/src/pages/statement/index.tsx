import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransactionList from '@/components/TransactionList';
import '@/app/globals.css'
import { useEffect, useState } from 'react';

const StatementPage = () => {
  const [ibans, setIbans] = useState<any[]>([]);
  const [ibanValue, setIbanValue] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchIbans = async () => {
        try {
          const response = await fetch(`http://localhost:3000/accounts/all`);
          const data = await response.json();
          if (response.ok) {
            setIbans(data.data);
            if (data.data.length > 0) {
                // Set the first IBAN value by default
                setIbanValue(data.data[0].iban);
            }
          } else {
            console.error('Error fetching transactions:', data.message);
          }
        } catch (error) {
            console.error('Error:', error);
        }
    };
      
    fetchIbans();
  }, []);

  useEffect(() => {
    if (!ibanValue) return;
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/accounts/statement/${ibanValue}`);
        const data = await response.json();
        if (response.ok) {
            setTransactions(data.statement);
        } else {
          console.error('Error fetching transactions:', data.message);
        }
      } catch (error) {
          console.error('Error:', error);
        }
    };
    
    fetchTransactions();
  }, [ibanValue]);
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIbanValue(e.target.value);
  }
  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="max-w-xs mb-8">
            <label className="text-2xl font-bold mb-4">IBAN :</label>
            <select id="dropdown" className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onChange={handleSelectChange}>
                {ibans.map((iban) => (
                    <option key={iban.iban} value={iban.iban}>{iban.iban}</option>
                ))}
            </select>
        </div>
        <h2 className="text-2xl font-bold mb-4">Account Statement</h2>
        <TransactionList transactions={transactions} />
      </div>
      <Footer />
    </>
  );
};

export default StatementPage;
