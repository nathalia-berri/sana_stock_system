import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/sana/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

type Movement = {
  id: number;
  date: string;
  material: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  user: string;
  area: string;
  responsible: string;
};

const movements: Movement[] = [
  { id: 1, date: '10/03/2026 14:30', material: 'Parafusos M6', type: 'Saída', quantity: 150, user: 'João Silva', area: 'Manutenção', responsible: 'Admin SANA' },
  { id: 2, date: '10/03/2026 13:15', material: 'Cabos 2.5mm', type: 'Entrada', quantity: 500, user: 'Maria Santos', area: 'Almoxarifado', responsible: 'Admin SANA' },
  { id: 3, date: '10/03/2026 11:45', material: 'Luvas PVC', type: 'Saída', quantity: 25, user: 'Pedro Costa', area: 'Elétrica', responsible: 'Admin SANA' },
  { id: 4, date: '10/03/2026 10:20', material: 'Abraçadeiras', type: 'Entrada', quantity: 200, user: 'Ana Lima', area: 'Almoxarifado', responsible: 'Admin SANA' },
  { id: 5, date: '10/03/2026 09:00', material: 'Fita Isolante', type: 'Saída', quantity: 30, user: 'Carlos Souza', area: 'Manutenção', responsible: 'Admin SANA' },
  { id: 6, date: '09/03/2026 16:45', material: 'Tubos PVC 3/4"', type: 'Entrada', quantity: 80, user: 'Roberto Lima', area: 'Almoxarifado', responsible: 'Admin SANA' },
  { id: 7, date: '09/03/2026 15:20', material: 'Conectores RJ45', type: 'Saída', quantity: 100, user: 'Fernanda Costa', area: 'TI', responsible: 'Admin SANA' },
  { id: 8, date: '09/03/2026 14:10', material: 'Parafusos M8', type: 'Entrada', quantity: 300, user: 'Lucas Santos', area: 'Almoxarifado', responsible: 'Admin SANA' },
];

export function Movements() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch = movement.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'entradas' && movement.type === 'Entrada') ||
                       (activeTab === 'saidas' && movement.type === 'Saída');
    return matchesSearch && matchesTab;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">Movimentações</h2>
            <p className="text-sm text-[#64748B]">Histórico de entradas e saídas de materiais</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/movements/new-entry')}
              className="bg-[#10B981] hover:bg-[#059669]"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Nova Entrada
            </Button>
            <Button 
              onClick={() => navigate('/movements/new-exit')}
              className="bg-[#F97316] hover:bg-[#EA580C]"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Nova Saída
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="entradas">Entradas</TabsTrigger>
            <TabsTrigger value="saidas">Saídas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Data/Hora</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Material</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Tipo</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Quantidade</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Funcionário</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Área</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovements.map((movement) => (
                      <tr 
                        key={movement.id} 
                        className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#64748B]">{movement.date}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-[#0F172A]">{movement.material}</span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="outline"
                            className={movement.type === 'Entrada' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                            }
                          >
                            {movement.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-[#0F172A]">
                            {movement.type === 'Entrada' ? '+' : '-'}{movement.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#64748B]">{movement.user}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#64748B]">{movement.area}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#64748B]">{movement.responsible}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {filteredMovements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#64748B]">Nenhuma movimentação encontrada</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
