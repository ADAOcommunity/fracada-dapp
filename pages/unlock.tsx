import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

const Comp = dynamic(() => import('../components/Unlock'), { ssr: false })

const Unlock: NextPage = () => {
  return (
   <Layout>
    <Comp/>
   </Layout>
  )
}

export default Unlock
