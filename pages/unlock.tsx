import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import FracadaAction from '../components/FracadaAction'
import Layout from '../components/Layout'

const Comp = dynamic(() => import('../components/Unlock'), { ssr: false })

const Unlock: NextPage = () => {
  return (
   <Layout>
        <FracadaAction key="unlock" action="Unlock">
            <Comp/>
        </FracadaAction>
   </Layout>
  )
}

export default Unlock
