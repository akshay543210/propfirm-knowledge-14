import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MarketProvider } from './contexts/MarketContext.tsx'
import { AppReadyProvider } from './contexts/AppReadyContext.tsx'

createRoot(document.getElementById("root")!).render(
  <MarketProvider>
    <AppReadyProvider>
      <App />
    </AppReadyProvider>
  </MarketProvider>
);