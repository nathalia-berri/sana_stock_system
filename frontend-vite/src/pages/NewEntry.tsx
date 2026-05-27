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
  // Estados locais para material, quantidade e mensagens
  // -----------------------------------------------------
  const [materialId, setMaterialId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------------------
  // Função de envio: chama /movimentacoes/ com token JWT
  // -----------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // Recupera token salvo no login
      const token = localStorage.getItem("sana_token");

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
