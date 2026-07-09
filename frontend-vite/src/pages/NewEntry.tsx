// =========================================================
// Este arquivo contém o componente de Nova Entrada.
// 
// Funções principais:
// - Exibir formulário para registrar entrada de material
// - Enviar requisição autenticada para /movimentacoes/
// - Usar token JWT salvo no localStorage
// - Exibir mensagens de sucesso ou erro
// =========================================================

import { useState } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

export function NewEntry() {

  // -----------------------------------------------------
  // Tipo para representar um material vindo da API
  // -----------------------------------------------------
  type Material = {
    id: number;
    codigo: string;
    nome: string;
  };

  // -----------------------------------------------------
  // Estados locais para material, quantidade e mensagens
  // -----------------------------------------------------
  const [materialId, setMaterialId] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Material[]>([]);
  const [quantidade, setQuantidade] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------------------
  // Função para buscar materiais conforme digita
  // -----------------------------------------------------
  async function handleSearch(text: string) {
    setQuery(text);
    if (text.length > 1) {
      try {
        const res = await fetch(`${API_URL}/materiais/search?q=${text}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch {
        setError("Erro ao buscar materiais.");
      }
    } else {
      setSuggestions([]);
    }
  }

  // -----------------------------------------------------
  // Função de envio: chama /movimentacoes/ com token JWT
  // -----------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // Recupera token salvo no login
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/movimentacoes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          material_id: Number(materialId),
          tipo: "entrada",
          quantidade: Number(quantidade),
          area: "Estoque Central"
          // usuario_id e responsavel são preenchidos pelo backend via JWT
        }),
      });

      if (!response.ok) throw new Error("Erro ao registrar entrada");
      setSuccess("Entrada registrada com sucesso!");
    } catch (err) {
      console.error(err);
      setError("Não foi possível registrar a entrada.");
    }
  }

  // -----------------------------------------------------
  // Renderização do formulário de nova entrada
  // -----------------------------------------------------
  return (
    <Layout>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Nova Entrada</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* campo de autocomplete para material */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Digite o material..."
              className="border rounded px-3 py-2 w-full"
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-10">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => {
                      setMaterialId(String(s.id));
                      setQuery(`${s.codigo} - ${s.nome}`);
                      setSuggestions([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.codigo} - {s.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* campo de quantidade */}
          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <Button type="submit" variant="success">
            Registrar Entrada
          </Button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </Card>
    </Layout>
  );
}
