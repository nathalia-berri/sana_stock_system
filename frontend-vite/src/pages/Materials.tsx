import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/sana/Layout';
import { StatusBadge } from '../components/sana/StatusBadge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

type ApiMaterial = {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  categoria_id: number;
  unidade: string;
  estoque_minimo: number;
  estoque_atual: number;
  localizacao: string | null;
  ativo: boolean;
  status: string;
};

type Material = {
  id: number;
  code: string;
  name: string;
  category: string;
  current: number;
  minimum: number;
  unit: string;
  status: 'critical' | 'warning' | 'ok';
};

const API_URL = 'http://127.0.0.1:8000';

export function Materials() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  function mapStatus(status: string): 'critical' | 'warning' | 'ok' {
    const normalized = status.toLowerCase();

    if (normalized.includes('crítico') || normalized.includes('critico')) {
      return 'critical';
    }

    if (normalized.includes('atenção') || normalized.includes('atencao') || normalized.includes('warning')) {
      return 'warning';
    }

    return 'ok';
  }

  function mapApiMaterialToUi(material: ApiMaterial): Material {
    return {
      id: material.id,
      code: material.codigo,
      name: material.nome,
      category: material.categoria,
      current: Number(material.estoque_atual),
      minimum: Number(material.estoque_minimo),
      unit: material.unidade,
      status: mapStatus(material.status),
    };
  }

  async function loadMaterials() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/materiais/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar materiais');
      }

      const data: ApiMaterial[] = await response.json();
      setMaterials(data.map(mapApiMaterialToUi));
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os materiais.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(materialId: number) {
    const confirmed = window.confirm('Deseja realmente excluir este material?');

    if (!confirmed) return;

    try {
      setDeletingId(materialId);

      const response = await fetch(`${API_URL}/materiais/${materialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir material');
      }

      setMaterials((prev) => prev.filter((item) => item.id !== materialId));
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir o material.');
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(materials.map((material) => material.category))];
    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || material.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, categoryFilter]);

  const getStatusLabel = (status: 'critical' | 'warning' | 'ok') => {
    if (status === 'critical') return 'CRÍTICO';
    if (status === 'warning') return 'ATENÇÃO';
    return 'OK';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-semibold text-slate-800">Materiais</h2>
            <p className="text-slate-500 mt-1">Gerencie o cadastro de materiais</p>
          </div>

          <button
            onClick={() => navigate('/materials/new')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 border-none font-medium cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Novo Material
          </button>
        </div>

        <div className="rounded-2xl bg-red-500 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/80" />
              <input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/70 bg-transparent pl-11 pr-4 text-white placeholder:text-white/80 outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 rounded-xl border border-white/70 bg-transparent px-4 text-white outline-none"
            >
              <option value="all" className="text-black">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-black">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Código</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Nome</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Categoria</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Estoque Atual</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Mínimo</th>
                  <th className="text-left py-5 px-6 text-sm font-semibold text-slate-800">Status</th>
                  <th className="text-center py-5 px-6 text-sm font-semibold text-slate-800">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      Carregando materiais...
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="py-5 px-6 text-sm text-slate-500 font-mono">
                        {material.code}
                      </td>
                      <td className="py-5 px-6 text-sm font-semibold text-slate-800">
                        {material.name}
                      </td>
                      <td className="py-5 px-6 text-sm text-slate-500">
                        {material.category}
                      </td>
                      <td className="py-5 px-6 text-sm font-semibold text-slate-800">
                        {material.current} {material.unit}
                      </td>
                      <td className="py-5 px-6 text-sm text-slate-500">
                        {material.minimum} {material.unit}
                      </td>
                      <td className="py-5 px-6">
                        <StatusBadge status={material.status}>
                          {getStatusLabel(material.status)}
                        </StatusBadge>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => navigate(`/materials/edit/${material.id}`)}
                            className="bg-transparent border-none cursor-pointer text-blue-600"
                            title="Editar material"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(material.id)}
                            disabled={deletingId === material.id}
                            className="bg-transparent border-none cursor-pointer text-red-500 disabled:opacity-50"
                            title="Excluir material"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && filteredMaterials.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Nenhum material encontrado
          </div>
        )}
      </div>
    </Layout>
  );
}