import AccountForm from '@/components/AccountForm'
import '@/app/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DepositPage() {
    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Deposit Money</h2>
                <AccountForm type="deposit" />
            </div>
            <Footer />
        </>
    )
}
