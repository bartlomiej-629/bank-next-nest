import AccountForm from '@/components/AccountForm'
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/app/globals.css'

const WithdrawPage = () => (
  <>
    <Header />
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">WithdrawPage Money</h2>
      <AccountForm type='withdraw' />
    </div>
    <Footer />
  </>
);

export default WithdrawPage;
