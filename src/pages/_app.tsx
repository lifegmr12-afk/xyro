import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </Layout>
    </AuthProvider>
  )
}
