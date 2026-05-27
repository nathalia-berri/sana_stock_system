import { useState, useEffect } from "react";
import { Layout } from "../components/sana/Layout";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

type Report = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
};

const API_URL = "http://127.0.0.1:8000";

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/relatorios/`);
      if (!response.ok) throw new Error("Erro ao carregar relatórios");
      const data: Report[] = await response.json();
      setReports(data);
    } catch {
      setError("Não foi possível carregar os relatórios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Relatórios</h2>

        {error && (
          <div className="rounded-md bg-red-100 text-red-700 p-3">{error}</div>
        )}

        <Card>
          {loading ? (
            <p>Carregando relatórios...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">Nenhum relatório disponível</p>
          ) : (
            <ul className="space-y-4">
              {reports.map((r) => (
                <li key={r.id} className="border-b pb-2">
                  <h3 className="text-lg font-semibold">{r.titulo}</h3>
                  <p className="text-sm text-gray-600">{r.descricao}</p>
                  <Badge variant="outline" className="mt-1">
                    {new Date(r.data).toLocaleDateString("pt-BR")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Layout>
  );
}
