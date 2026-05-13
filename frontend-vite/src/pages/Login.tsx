import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/sana/Logo'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          username: email,
          password: password,
          scope: '',
          client_id: 'sana-frontend',
          client_secret: '',
        }),
      })

      if (!response.ok) {
        alert('Senha incorreta! Use: admin / 123456')
        return
      }

      const data = await response.json()
      localStorage.setItem('sana_token', data.access_token)
      navigate('/materials')
    } catch (err) {
      console.error(err)
      alert('Erro no servidor. Backend rodando?')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-8 text-white">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <Logo size="lg" />
            <span className="text-5xl font-medium">SANA</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold mb-2">Bem-vindo ao SANA</h1>
          <p className="text-sm text-blue-100">
            Sistema de Gestão de Almoxarifado
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="text"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 rounded-lg border border-white/50 bg-transparent px-4 text-white placeholder:text-blue-100 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 rounded-lg border border-white/50 bg-transparent px-4 text-white placeholder:text-blue-100 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium text-white border-none cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="#"
            className="text-sm text-blue-100 hover:text-white transition"
          >
            Novo usuário? Entre em contato com o administrador
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-xs text-blue-100">
            © 2026 SANA Stock System. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
