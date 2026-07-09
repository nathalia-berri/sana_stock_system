import { useState, useEffect } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

export function NewMaterial() {
  // estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");

  // estados para lista de categorias vindas da API
  const [categorias, setCategorias] = useState<string[]>([]);

  // estados para feedback ao usuário
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // USEEFFECT - CARREGAR CATEGORIAS AO ABRIR A PÁGINA
  // =========================================================
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch(`${API_URL}/materiais/categorias`);
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        const data = await res.json();
        setCategorias(data);
      } catch {
        setError("Não foi possível carregar as categorias.");
      }
    }
    fetchCategorias();
  }, []);

  // =========================================================
  // FUNÇÃO DE SUBMIT - CADASTRAR MATERIAL
  // =========================================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // Recupera token salvo no login
      const token = localStorage.getItem("token");

      // envio dos dados para a API
      const response = await fetch(`${API_URL}/materiais/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome,
          categoria,
        }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar material");

      // se deu certo, mostra mensagem e limpa os campos
      setSuccess("Material cadastrado com sucesso!");
      setNome("");
      setCategoria("");
    } catch {
      setError("Não foi possível cadastrar o material.");
    }
  }

  return (
    <Layout>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Novo Material</h2>

        {/* formulário de cadastro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* campo de nome */}
          <Input
            placeholder="Nome do material"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          {/* campo de categoria como dropdown */}
          <select
            className="border rounded px-3 py-2 w-full"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button type="submit" variant="success">
            Cadastrar Material
          </Button>
        </form>

        {/* mensagens de feedback */}
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </Card>
    </Layout>
  );
}