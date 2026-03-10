import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Materials } from './pages/Materials'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/materials" element={<Materials />} />
      </Routes>
    </BrowserRouter>
  )
}
