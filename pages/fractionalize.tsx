import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

const Comp = dynamic(() => import('../components/Fractionalize'), { ssr: false })

const Fractionalize: NextPage = () => {
  return (
   <Layout>
    <Comp/>
   </Layout>
  )
}

export default Fractionalize
