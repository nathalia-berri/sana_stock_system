import { Layout } from '../components/sana/Layout';
import { StatsCard } from '../components/sana/StatsCard';
import { Card } from '../components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Badge } from '../components/ui/badge';

const movementData = [
  { day: 'Seg', entradas: 45, saidas: 32 },
  { day: 'Ter', entradas: 52, saidas: 38 },
  { day: 'Qua', entradas: 38, saidas: 45 },
  { day: 'Qui', entradas: 65, saidas: 42 },
  { day: 'Sex', entradas: 58, saidas: 51 },
  { day: 'Sáb', entradas: 42, saidas: 28 },
  { day: 'Dom', entradas: 35, saidas: 22 },
];

const recentMovements = [
  { id: 1, material: 'Parafusos M6', type: 'Saída', qty: 150, user: 'João Silva', area: 'Manutenção', date: '10/03/2026 14:30' },
  { id: 2, material: 'Cabos 2.5mm', type: 'Entrada', qty: 500, user: 'Maria Santos', area: 'Almoxarifado', date: '10/03/2026 13:15' },
  { id: 3, material: 'Luvas PVC', type: 'Saída', qty: 25, user: 'Pedro Costa', area: 'Elétrica', date: '10/03/2026 11:45' },
  { id: 4, material: 'Abraçadeiras', type: 'Entrada', qty: 200, user: 'Ana Lima', area: 'Almoxarifado', date: '10/03/2026 10:20' },
  { id: 5, material: 'Fita Isolante', type: 'Saída', qty: 30, user: 'Carlos Souza', area: 'Manutenção', date: '10/03/2026 09:00' },
];

export function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">Dashboard</h2>
          <p className="text-sm text-[#64748B]">Visão geral do sistema de almoxarifado</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Materiais"
            value="1,248"
            icon={Package}
            trend={{ value: '+12% este mês', isPositive: true }}
            iconBgColor="bg-blue-100"
            iconColor="text-[#2563EB]"
          />
          <StatsCard
            title="Estoque Crítico"
            value="15"
            icon={AlertTriangle}
            trend={{ value: '-3 desde ontem', isPositive: true }}
            iconBgColor="bg-red-100"
            iconColor="text-[#EF4444]"
          />
          <StatsCard
            title="Entradas (Semana)"
            value="342"
            icon={TrendingUp}
            trend={{ value: '+8% vs semana anterior', isPositive: true }}
            iconBgColor="bg-green-100"
            iconColor="text-[#10B981]"
          />
          <StatsCard
            title="Saídas (Semana)"
            value="286"
            icon={TrendingDown}
            trend={{ value: '-5% vs semana anterior', isPositive: true }}
            iconBgColor="bg-orange-100"
            iconColor="text-[#F97316]"
          />
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-6">
            Movimentações dos Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Entradas"
              />
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="#F97316" 
                strokeWidth={2}
                name="Saídas"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Movements */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
              Últimas Movimentações
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Material</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Qtd</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Área</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.map((movement) => (
                    <tr key={movement.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 text-sm text-[#0F172A]">{movement.material}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 text-sm text-[#0F172A]">{movement.qty}</td>
                      <td className="py-3 px-4 text-sm text-[#64748B]">{movement.area}</td>
                      <td className="py-3 px-4 text-sm text-[#64748B]">{movement.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
              Alertas de Estoque
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Parafusos M6
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Abaixo do mínimo! Apenas 15 unidades restantes
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Fita Isolante Preta
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Próximo do mínimo: 25 unidades
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Abraçadeiras 1/2"
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Estoque crítico: 8 unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
