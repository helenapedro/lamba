import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ShoppingPreview from './dev/ShoppingPreview'
import './index.css'

const isPreview =
  import.meta.env.DEV && window.location.pathname.startsWith('/dev-preview')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isPreview ? <ShoppingPreview /> : <App />}</StrictMode>,
)
