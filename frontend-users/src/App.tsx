import { AppRouter } from './AppRouter'
import useTokenInApp from './useTokenInApp'
import './App.scss'

function App() {
  useTokenInApp()
  return (
    <div className='app'>
      <AppRouter />
    </div>
  )
}

export default App
