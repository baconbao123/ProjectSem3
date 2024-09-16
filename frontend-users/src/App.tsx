import { AppRouter } from './AppRouter'
import useTokenInApp from './useTokenInApp'

function App() {
  useTokenInApp()
  return (
    <AppRouter />
  )
}

export default App
