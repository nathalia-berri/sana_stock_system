import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Layout } from "../components/sana/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

type ApiMovement = {
  id: number;
  material_nome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  usuario_id: number;
  area: string | null;
  responsavel: string | null;
  data: string;
};

type Movement = {
  id: number;
  date: string;
  material: string;
  type: "Entrada" | "Saída";
  quantity: number;
  user: string;
  area: string;
  responsible: string;
};

type User = {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
};

const API_URL = "http://127.0.0.1:8000";

export function Movements() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  async function loadMovements() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/movimentacoes/`);
      if (!response.ok) throw new Error("Erro ao carregar movimentações");

      const data: ApiMovement[] = await response.json();
      const mapped: Movement[] = data.map((mov) => ({
        id: mov.id,
        date: new Date(mov.data).toLocaleString("pt-BR"),
        material: `${mov.material_nome}`,
        type: mov.tipo.toLowerCase() === "entrada" ? "Entrada" : "Saída",
        quantity: Number(mov.quantidade),
        user: `Usuário ${mov.usuario_id}`,
        area: mov.area || "-",
        responsible: mov.responsavel || "-",
      }));

      setMovements(mapped);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as movimentações.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Erro ao carregar usuário", err);
    }
  }

  useEffect(() => {
    loadMovements();
    loadUser();
  }, []);

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch = movement.material
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "entradas" && movement.type === "Entrada") ||
      (activeTab === "saidas" && movement.type === "Saída");
    return matchesSearch && matchesTab;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">
              Movimentações
            </h2>
            <p className="text-sm text-[#64748B]">
              Histórico de entradas e saídas de materiais
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === "admin" && (
              <Button
                variant="success"
                onClick={() => navigate("/movements/new-entry")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Nova Entrada
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                variant="danger"
                onClick={() => navigate("/movements/new-exit")}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Nova Saída
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                placeholder="Buscar por material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Input type="date" className="flex-1" />
              <Input type="date" className="flex-1" />
            </div>
          </div>
        </Card>

        {/* Mensagem de erro */}
        {error && (
          <div className="rounded-md bg-red-100 text-red-700 p-3">
            {error}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" activeTab={activeTab} setActiveTab={setActiveTab}>
              Todas
            </TabsTrigger>
            <TabsTrigger value="entradas" activeTab={activeTab} setActiveTab={setActiveTab}>
              Entradas
            </TabsTrigger>
            <TabsTrigger value="saidas" activeTab={activeTab} setActiveTab={setActiveTab}>
              Saídas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" activeTab={activeTab}>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="py-4 px-6 text-left">Data/Hora</th>
                      <th className="py-4 px-6 text-left">Material</th>
                      <th className="py-4 px-6 text-left">Tipo</th>
                      <th className="py-4 px-6 text-left">Quantidade</th>
                      <th className="py-4 px-6 text-left">Funcionário</th>
                      <th className="py-4 px-6 text-left">Área</th>
                      <th className="py-4 px-6 text-left">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-[#64748B]">
                          Carregando movimentações...
                        </td>
                      </tr>
                    ) : (
                      filteredMovements.map((movement) => (
                        <tr
                          key={movement.id}
                          className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                        >
                          <td className="py-4 px-6">{movement.date}</td>
                          <td className="py-4 px-6">{movement.material}</td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                movement.type === "Entrada" ? "success" : "danger"
                              }
                            >
                              {movement.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            {movement.type === "Entrada" ? "+" : "-"}
                            {movement.quantity}
                          </td>
                          <td className="py-4 px-6">{movement.user}</td>
                          <td className="py-4 px-6">{movement.area}</td>
                          <td className="py-4 px-6">{movement.responsible}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {!loading && filteredMovements.length === 0 && (
              <div className="text-center py-12 text-[#64748B]">
                Nenhuma movimentação encontrada
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}