// =========================================================
// Este arquivo contém o componente de Relatórios.
// 
// Funções principais:
// - Buscar relatórios reais do backend (/relatorios/)
// - Exibir relatório de movimentações filtradas
// - Exibir relatório de estoque atual com lista de materiais
// - Exportar relatório de estoque em Excel
// - Permitir filtros por período e categoria
// - Exibir mensagens de carregamento e erro
// =========================================================

import { useState, useEffect } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const API_URL = "http://127.0.0.1:8000";

// -----------------------------------------------------
// Tipos de dados para relatórios
// -----------------------------------------------------
type MovimentacoesMes = {
  titulo: string;
  descricao: string;
  data: string;
};

type EstoqueAtual = {
  titulo: string;
  descricao: string;
  data: string;
  materiais: {
    codigo: string;
    nome: string;
    estoque_atual: number;
    minimo: number;
    status: string;
  }[];
};

export function Reports() {
  // -----------------------------------------------------
  // Estados locais para relatórios, filtros, loading e erro
  // -----------------------------------------------------
  const [movMes, setMovMes] = useState<MovimentacoesMes | null>(null);
  const [estoque, setEstoque] = useState<EstoqueAtual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  // -----------------------------------------------------
  // Função para carregar relatórios do backend com filtros
  // -----------------------------------------------------
  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (dataInicio) params.append("data_inicio", dataInicio);
      if (dataFim) params.append("data_fim", dataFim);
      if (categoriaId) params.append("categoria_id", categoriaId);

      const resMov = await fetch(`${API_URL}/relatorios/movimentacoes?${params}`);
      if (!resMov.ok) throw new Error("Erro ao carregar movimentações");
      const dataMov: MovimentacoesMes = await resMov.json();
      setMovMes(dataMov);

      let resEst;
        if (dataFim) {
          // se o usuário escolheu uma data final, usa o estoque em data
          resEst = await fetch(`${API_URL}/relatorios/estoque-em-data?data_fim=${dataFim}`);
        } else {
          // caso contrário, usa o estoque atual
          resEst = await fetch(`${API_URL}/relatorios/estoque-atual?${params}`);
        }

        if (!resEst.ok) throw new Error("Erro ao carregar estoque");
        const dataEst = await resEst.json();
          setEstoque(dataEst);

    } catch {
      setError("Não foi possível carregar os relatórios.");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------------------
  // useEffect para carregar relatórios ao abrir a página
  // -----------------------------------------------------
  useEffect(() => {
    loadReports();
  }, []);

  // -----------------------------------------------------
  // Renderização dos relatórios
  // -----------------------------------------------------
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Relatórios</h2>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border px-2 py-1"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border px-2 py-1"
          />
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Todas categorias</option>
            <option value="1">Papelaria</option>
            <option value="2">Ferramentas</option>
            {/* pode carregar dinamicamente do backend */}
          </select>
          <Button onClick={loadReports}>Aplicar Filtros</Button>
        </div>

        {error && (
          <div className="rounded-md bg-red-100 text-red-700 p-3">{error}</div>
        )}

        {loading ? (
          <Card>
            <p>Carregando relatórios...</p>
          </Card>
        ) : (
          <>
            {/* Relatório de movimentações filtradas */}
            {movMes && (
              <Card>
                <h3 className="text-lg font-semibold">{movMes.titulo}</h3>
                <p className="text-sm text-gray-600">{movMes.descricao}</p>
                <Badge variant="outline" className="mt-1">
                  {new Date(movMes.data).toLocaleDateString("pt-BR")}
                </Badge>
              </Card>
            )}

            {/* Relatório de estoque atual */}
            {estoque && (
              <Card>
                <h3 className="text-lg font-semibold">{estoque.titulo}</h3>
                <p className="text-sm text-gray-600">{estoque.descricao}</p>
                <Badge variant="outline" className="mt-1">
                  {new Date(estoque.data).toLocaleDateString("pt-BR")}
                </Badge>

                <table className="mt-4 w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">Código</th>
                      <th className="border px-2 py-1 text-left">Nome</th>
                      <th className="border px-2 py-1 text-left">Estoque</th>
                      <th className="border px-2 py-1 text-left">Mínimo</th>
                      <th className="border px-2 py-1 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoque.materiais.map((m) => (
                      <tr key={m.codigo}>
                        <td className="border px-2 py-1">{m.codigo}</td>
                        <td className="border px-2 py-1">{m.nome}</td>
                        <td className="border px-2 py-1">{m.estoque_atual}</td>
                        <td className="border px-2 py-1">{m.minimo}</td>
                        <td className="border px-2 py-1">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Botão para exportar em Excel */}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    window.open(`${API_URL}/relatorios/estoque-excel`, "_blank")
                  }
                >
                  Exportar Estoque em Excel
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
