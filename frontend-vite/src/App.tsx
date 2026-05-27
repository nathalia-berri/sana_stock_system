import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Materials } from './pages/Materials'
import { Movements } from './pages/Movements'
import { NewEntry } from './pages/NewEntry'
import { NewExit } from './pages/NewExit'
import { NewMaterial } from './pages/NewMaterial'
import { Reports } from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/materials/new" element={<NewMaterial />} />
        <Route path="/movements" element={<Movements />} />
        <Route path="/movements/new-entry" element={<NewEntry />} />
        <Route path="/movements/new-exit" element={<NewExit />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  )
}
