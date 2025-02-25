import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banking App</h1>
        <nav className="space-x-4">
          <Link href="/deposit">Deposit</Link>
          <Link href="/withdraw">Withdraw</Link>
          <Link href="/transfer">Transfer</Link>
          <Link href="/statement">Account Statement</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
