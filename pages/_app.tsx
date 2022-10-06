import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../components/WalletButton/index.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
