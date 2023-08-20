import type { NextPage } from 'next'
import { useEffect } from 'react'
import Landing from '../components/Landing'
import Layout from '../components/Layout'
import { testAll } from '../utils/test'

const Home: NextPage = () => {
  useEffect(() => {
    const logToConsole = async () => {
      await testAll()
    }
    logToConsole();
  }, []);

  return (
    <>
      <Layout>
        <Landing />
      </Layout>
    </>
  )
}

export default Home
