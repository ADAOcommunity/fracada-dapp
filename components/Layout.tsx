import { ReactNode } from 'react'
import { Header } from '../components/Header'
import WalletButton from '../components/WalletButton/fab'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={'min-h-screen'}>
            <div className="w-full lg:max-w-lg lg:w-1/2 rounded-xl">
                <div>
                    <div className="relative w-full max-w-lg">
                        <div className={`animate-[ping_4s_ease-in-out] absolute top-[15rem] rounded-full bg-violet-300 -left-4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob`}></div>
                        <div className={`animate-[bounce_7s_ease-out] absolute top-[25rem] rounded-full bg-fuchsia-300 -bottom-24 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000`}></div>
                    </div>
                </div>
            </div>
            <Header />
            <section>
                <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 md:py-32 md:px-12 lg:px-24 lg:py-48">
                    <div className="flex flex-col items-start mt-12 mb-16 text-left lg:flex-grow lg:pl-6 xl:pl-24 md:mb-0 xl:mt-0">
                        {children}
                    </div>
                </div>
            </section>
            <WalletButton />
            
        </div>
    )
}

export default Layout
