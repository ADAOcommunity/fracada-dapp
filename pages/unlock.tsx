import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import FracadaAction from '../components/FracadaAction'
import Layout from '../components/Layout'

const Comp = dynamic(() => import('../components/Unlock'), { ssr: false })

const Unlock: NextPage = () => {
  return (
   <Layout>
        <FracadaAction key="fractionalize" action="Fractionalize">
            <Comp/>
        </FracadaAction>
   </Layout>
  )
}

export default Unlock
