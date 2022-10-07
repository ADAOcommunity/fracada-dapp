import type { NextPage } from 'next'
import Landing from '../components/Landing'
import Layout from '../components/Layout'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Landing />
      </Layout>
    </>
  )
}

export default Home
