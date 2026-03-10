import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/sana/Layout';
import { StatusBadge } from '../components/sana/StatusBadge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

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

const materials: Material[] = [
  { id: 1, code: 'PAR001', name: 'Parafusos M6', category: 'Fixação', current: 15, minimum: 50, unit: 'un', status: 'critical' },
  { id: 2, code: 'CAB002', name: 'Cabos 2.5mm', category: 'Elétrica', current: 850, minimum: 200, unit: 'un', status: 'ok' },
  { id: 3, code: 'LUV003', name: 'Luvas PVC', category: 'Conexões', current: 120, minimum: 100, unit: 'un', status: 'ok' },
  { id: 4, code: 'FIT004', name: 'Fita Isolante Preta', category: 'Elétrica', current: 25, minimum: 20, unit: 'un', status: 'warning' },
  { id: 5, code: 'ABR005', name: 'Abraçadeiras 1/2"', category: 'Fixação', current: 8, minimum: 30, unit: 'un', status: 'critical' },
  { id: 6, code: 'TUB006', name: 'Tubos PVC 3/4"', category: 'Tubulação', current: 180, minimum: 50, unit: 'un', status: 'ok' },
  { id: 7, code: 'CON007', name: 'Conectores RJ45', category: 'Rede', current: 450, minimum: 100, unit: 'un', status: 'ok' },
  { id: 8, code: 'PAR008', name: 'Parafusos M8', category: 'Fixação', current: 65, minimum: 50, unit: 'un', status: 'ok' },
];

export function Materials() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || material.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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
              <option value="Fixação" className="text-black">Fixação</option>
              <option value="Elétrica" className="text-black">Elétrica</option>
              <option value="Conexões" className="text-black">Conexões</option>
              <option value="Tubulação" className="text-black">Tubulação</option>
              <option value="Rede" className="text-black">Rede</option>
            </select>
          </div>
        </div>

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
                {filteredMaterials.map((material) => (
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
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button className="bg-transparent border-none cursor-pointer text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Nenhum material encontrado
          </div>
        )}
      </div>
    </Layout>
  );
}
