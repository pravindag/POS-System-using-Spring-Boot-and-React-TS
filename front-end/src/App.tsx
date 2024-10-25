
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { AuthProvider } from './context/AuthContext'
import DefaultRoutes from './routes/DefaultRoutes'
import UserRoutes from './routes/UserRoutes'
import NotFound from './pages/error/NotFound'
import Login from './pages/auth/Login'


const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/auth/*" element={<DefaultRoutes />} />
            <Route path="/user/*" element={<UserRoutes />} />

            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
