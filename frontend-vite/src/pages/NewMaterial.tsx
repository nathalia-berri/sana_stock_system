import { useState } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

export function NewMaterial() {
  // estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");

  // estados para feedback ao usuário
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // envio dos dados para a API
      const response = await fetch(`${API_URL}/materiais/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          <Input
            placeholder="Nome do material"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

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
