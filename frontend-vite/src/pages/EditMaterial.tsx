import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

export function EditMaterial() {
  // pega o id da URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");

  // estados para lista de categorias vindas da API
  const [categorias, setCategorias] = useState<string[]>([]);

  // estados para feedback ao usuário
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // USEEFFECT - CARREGAR MATERIAL EXISTENTE
  // =========================================================
  useEffect(() => {
    async function fetchMaterial() {
      try {
        const res = await fetch(`${API_URL}/materiais/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar material");
        const data = await res.json();
        setNome(data.nome);
        setCategoria(data.categoria);
      } catch {
        setError("Não foi possível carregar o material.");
      }
    }

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

    fetchMaterial();
    fetchCategorias();
  }, [id]);

  // =========================================================
  // FUNÇÃO DE SUBMIT - ATUALIZAR MATERIAL
  // =========================================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/materiais/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          categoria,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar material");

      setSuccess("Material atualizado com sucesso!");
      // redireciona de volta para lista
      setTimeout(() => navigate("/materials"), 1500);
    } catch {
      setError("Não foi possível atualizar o material.");
    }
  }

  return (
    <Layout>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Editar Material</h2>

        {/* formulário de edição */}
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
            Salvar Alterações
          </Button>
        </form>

        {/* mensagens de feedback */}
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </Card>
    </Layout>
  );
}
