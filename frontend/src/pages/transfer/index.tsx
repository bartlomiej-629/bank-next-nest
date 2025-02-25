import Header from '@/components/Header';
import AccountForm from '@/components/AccountForm';
import Footer from '@/components/Footer';
import '@/app/globals.css'

export default function TransferPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Transfer Money</h2>
        <AccountForm type="transfer" />
      </div>
      <Footer />
    </>
  )
}