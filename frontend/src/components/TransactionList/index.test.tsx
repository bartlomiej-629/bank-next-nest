import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionList from './index';

describe('TransactionList Component', () => {
  const transactions = [
    {
      id: 1,
      amount: 100,
      balance: 1000,
      type: 'credit',
      date: '2024-12-01',
    },
    {
      id: 2,
      amount: 50,
      balance: 950,
      type: 'debit',
      date: '2024-12-02',
    },
    {
      id: 3,
      amount: 200,
      balance: 1150,
      type: 'credit',
      date: '2024-12-03',
    },
  ];

  it('renders the transaction list correctly', () => {
    render(<TransactionList transactions={transactions} />);

    // Check if table headers are rendered correctly
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('renders transaction data correctly', () => {
    render(<TransactionList transactions={transactions} />);

    // Check if transactions are rendered correctly in table rows
    expect(screen.getByText('01.12.2024')).toBeInTheDocument();
    expect(screen.getByText('+100.00')).toBeInTheDocument();
    expect(screen.getByText('1000.00')).toBeInTheDocument();

    expect(screen.getByText('02.12.2024')).toBeInTheDocument();
    expect(screen.getByText('-50.00')).toBeInTheDocument();
    expect(screen.getByText('950.00')).toBeInTheDocument();

    expect(screen.getByText('03.12.2024')).toBeInTheDocument();
    expect(screen.getByText('+200.00')).toBeInTheDocument();
    expect(screen.getByText('1150.00')).toBeInTheDocument();
  });

  it('correctly formats amount with prefix "+" or "-" based on balance change', () => {
    render(<TransactionList transactions={transactions} />);

    // Check the prefix for the first and second row
    expect(screen.getByText('+100.00')).toBeInTheDocument(); // First transaction, increase
    expect(screen.getByText('-50.00')).toBeInTheDocument(); // Second transaction, decrease
    expect(screen.getByText('+200.00')).toBeInTheDocument(); // Third transaction, increase
  });

  it('renders empty list when no transactions are passed', () => {
    render(<TransactionList transactions={[]} />);

    // Ensure no rows are rendered if transactions is an empty array
    expect(screen.queryByRole('row')).toBeNull();
  });

  it('renders date in correct format', () => {
    render(<TransactionList transactions={transactions} />);

    // Verify that the date is formatted correctly (DD.MM.YYYY)
    expect(screen.getByText('01.12.2024')).toBeInTheDocument();
    expect(screen.getByText('02.12.2024')).toBeInTheDocument();
    expect(screen.getByText('03.12.2024')).toBeInTheDocument();
  });

  it('renders transaction balance correctly', () => {
    render(<TransactionList transactions={transactions} />);

    // Check that balances are rendered with two decimal places
    expect(screen.getByText('1000.00')).toBeInTheDocument();
    expect(screen.getByText('950.00')).toBeInTheDocument();
    expect(screen.getByText('1150.00')).toBeInTheDocument();
  });
});
