// =========================================================
// Este arquivo contém o componente de Login.
// 
// Funções principais:
// - Exibir formulário de login
// - Autenticar usuário via /token
// - Salvar token JWT no localStorage
// - Redirecionar para a página principal após login
// =========================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/sana/Logo'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // -----------------------------------------------------
  // Função de login: chama /token e salva JWT
  // -----------------------------------------------------
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
        alert('Senha incorreta ou usuário não encontrado')
        return
      }

      const data = await response.json()

      // Salva token JWT no localStorage
      localStorage.setItem("token", data.access_token);

      // Redireciona para a página principal
      navigate('/materials')
    } catch (err) {
      console.error(err)
      alert('Erro no servidor. Tente novamente mais tarde.')
    }
  }

  // -----------------------------------------------------
  // Renderização da tela de login
  // -----------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-8 text-gray-900">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <Logo size="lg" />
            {/* <span className="text-5xl font-medium">Stock System</span> */}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">Bem-vindo ao SANA Stock System</h1>
          <p className="text-sm text-gray-600">
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
              className="w-full h-12 rounded-lg border border-gray-300 bg-gray-100 px-4 text-gray-900 placeholder:text-gray-500 outline-none"
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
              className="w-full h-12 rounded-lg border border-gray-300 bg-gray-100 px-4 text-gray-900 placeholder:text-gray-500 outline-none"
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
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Novo usuário? Entre em contato com o administrador.
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-xs text-blue-100">
            © 2026 SANA Stock System
          </p>
        </div>
      </div>
    </div>
  )
}
