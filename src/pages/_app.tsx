import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import React from 'react'

export default function App({ Component }: { Component: React.FC }) {
  return (
    <>
      <Layout>
        <Component />
      </Layout>
    </>
  )
}
