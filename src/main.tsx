import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MarketProvider } from './contexts/MarketContext.tsx'

createRoot(document.getElementById("root")!).render(
  <MarketProvider>
    <App />
  </MarketProvider>
);