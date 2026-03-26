import { useState } from 'react'
import { CalculatorPage } from './pages/CalculatorPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  const [page, setPage] = useState<'calculator' | 'settings'>('calculator')

  return page === 'calculator'
    ? <CalculatorPage onOpenSettings={() => setPage('settings')} />
    : <SettingsPage onBack={() => setPage('calculator')} />
}

export default App
