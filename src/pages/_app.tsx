import Layout from '@/components/dom/Layout'
import '@/styles/index.css'

export default function App({ Component }: { Component: React.FC }) {
  return (
    <>
      <Layout>
        <Component />
      </Layout>
    </>
  )
}
