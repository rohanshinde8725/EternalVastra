import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import ScrollToTop from './components/scrollToTop/ScrollToTop'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App