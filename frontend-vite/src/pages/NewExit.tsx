import { useState } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

export function NewExit() {
  const [materialId, setMaterialId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${API_URL}/movimentacoes/saida/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: materialId, quantidade }),
      });
      if (!response.ok) throw new Error("Erro ao registrar saída");
      setSuccess("Saída registrada com sucesso!");
    } catch (err) {
        console.error(err);
        setError("Não foi possível registrar a saída.");
      }
    }
    
  return (
    <Layout>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Nova Saída</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="ID do material"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
          <Button type="submit" variant="danger">
            Registrar Saída
          </Button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </Card>
    </Layout>
  );
}
