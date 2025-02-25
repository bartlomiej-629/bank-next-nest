import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountForm from './index'; // Adjust the import path if necessary
import { useRouter } from 'next/router';

// Mock the router push to prevent actual navigation during testing
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the global fetch method to avoid making real network requests
global.fetch = jest.fn();

describe('AccountForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders form for deposit type', () => {
    render(<AccountForm type="deposit" />);

    expect(screen.getByLabelText(/iban/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deposit/i })).toBeInTheDocument();
  });

  test('renders form for withdraw type', () => {
    render(<AccountForm type="withdraw" />);

    expect(screen.getByLabelText(/iban/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /withdraw/i })).toBeInTheDocument();
  });

  test('renders form for transfer type', () => {
    render(<AccountForm type="transfer" />);

    expect(screen.getByLabelText(/iban/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient iban/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument();
  });

  test('submit form with deposit type successfully', async () => {
    const mockRouterPush = jest.fn();
    
    // Manually mock useRouter to return the push method
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    render(<AccountForm type="deposit" />);

    // Mock successful fetch response
    const fakeResponse = {
      ok: true,
      json: async () => ({ balance: 100 }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

    // Fill the form
    userEvent.type(screen.getByLabelText(/iban/i), 'DE1234567890');
    userEvent.type(screen.getByLabelText(/amount/i), '50');

    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /deposit/i }));

    // Wait for the transaction success message
    await waitFor(() => expect(screen.queryByText(/transaction successful/i)).toBeInTheDocument());
    expect(mockRouterPush).toHaveBeenCalledWith('/statement');
  });

  test('submit form with withdraw type and handle error', async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    render(<AccountForm type="withdraw" />);

    // Mock failed fetch response
    const fakeResponse = {
      ok: false,
      json: async () => ({ message: 'Insufficient funds' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

    // Fill the form
    userEvent.type(screen.getByLabelText(/iban/i), 'DE9876543210');
    userEvent.type(screen.getByLabelText(/amount/i), '200');

    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /withdraw/i }));

    // Wait for the error message
    await waitFor(() => expect(screen.queryByText(/insufficient funds/i)).toBeInTheDocument());
  });

  test('submit form with transfer type successfully', async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    render(<AccountForm type="transfer" />);

    // Mock successful fetch response
    const fakeResponse = {
      ok: true,
      json: async () => ({ balance: 200 }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

    // Fill the form
    userEvent.type(screen.getByLabelText(/iban/i), 'DE1234567890');
    userEvent.type(screen.getByLabelText(/recipient iban/i), 'DE0987654321');
    userEvent.type(screen.getByLabelText(/amount/i), '100');

    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /transfer/i }));

    // Wait for the transaction success message
    await waitFor(() => expect(screen.queryByText(/transaction successful/i)).toBeInTheDocument());
    expect(mockRouterPush).toHaveBeenCalledWith('/statement');
  });

  test('shows error message when an error occurs during submit', async () => {
    render(<AccountForm type="deposit" />);

    // Mock failed fetch response
    const fakeResponse = {
      ok: false,
      json: async () => ({ message: 'Network error' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);

    // Fill the form
    userEvent.type(screen.getByLabelText(/iban/i), 'DE1234567890');
    userEvent.type(screen.getByLabelText(/amount/i), '50');

    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /deposit/i }));

    // Wait for the error message
    await waitFor(() => expect(screen.queryByText(/network error/i)).toBeInTheDocument());
  });

  test('handles form submission when input values are empty', async () => {
    render(<AccountForm type="deposit" />);

    // Submit without filling the form
    userEvent.click(screen.getByRole('button', { name: /deposit/i }));

    // Check if error is displayed for missing input
    await waitFor(() => expect(screen.queryByText(/iban/i)).toBeInTheDocument());
  });
});
