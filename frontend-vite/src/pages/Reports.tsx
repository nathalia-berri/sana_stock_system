import { useState } from 'react';
import { Layout } from '../components/sana/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Download, FileText, TrendingUp, TrendingDown, Package, User } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const areaData = [
  { name: 'Manutenção', value: 450, color: '#2563EB' },
  { name: 'Elétrica', value: 320, color: '#60A5FA' },
  { name: 'TI', value: 180, color: '#10B981' },
  { name: 'Produção', value: 280, color: '#F59E0B' },
  { name: 'Outros', value: 120, color: '#64748B' },
];

const detailedData = [
  { material: 'Parafusos M6', entradas: 500, saidas: 485, saldo: 15 },
  { material: 'Cabos 2.5mm', entradas: 1000, saidas: 150, saldo: 850 },
  { material: 'Luvas PVC', entradas: 200, saidas: 80, saldo: 120 },
  { material: 'Fita Isolante', entradas: 150, saidas: 125, saldo: 25 },
  { material: 'Abraçadeiras 1/2"', entradas: 100, saidas: 92, saldo: 8 },
  { material: 'Tubos PVC 3/4"', entradas: 250, saidas: 70, saldo: 180 },
];

export function Reports() {
  const [dateRange, setDateRange] = useState({
    start: '2026-03-01',
    end: '2026-03-10'
  });

  const handleExportCSV = () => {
    // Simulate CSV export
    const csvContent = [
      ['Material', 'Entradas', 'Saídas', 'Saldo'],
      ...detailedData.map(row => [row.material, row.entradas, row.saidas, row.saldo])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${dateRange.start}-${dateRange.end}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">Relatórios</h2>
            <p className="text-sm text-[#64748B]">Análise e exportação de dados do sistema</p>
          </div>
          <Button onClick={handleExportCSV} className="bg-[#2563EB] hover:bg-[#1E40AF]">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Date Filter */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Filtro de Período</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Total de Entradas</p>
                <p className="text-2xl font-semibold text-[#0F172A]">2,200</p>
                <p className="text-xs text-green-600 mt-2">+15% vs período anterior</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Total de Saídas</p>
                <p className="text-2xl font-semibold text-[#0F172A]">1,002</p>
                <p className="text-xs text-orange-600 mt-2">-8% vs período anterior</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Material Mais Movimentado</p>
                <p className="text-lg font-semibold text-[#0F172A]">Parafusos M6</p>
                <p className="text-xs text-[#64748B] mt-2">985 movimentações</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-[#2563EB]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Top Funcionário</p>
                <p className="text-lg font-semibold text-[#0F172A]">João Silva</p>
                <p className="text-xs text-[#64748B] mt-2">128 requisições</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-6">
              Consumo por Área
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {areaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Materials */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
              Top 5 Materiais Mais Consumidos
            </h3>
            <div className="space-y-4">
              {detailedData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#F8FAFC] rounded-full h-8 w-8 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#2563EB]">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-[#0F172A]">{item.material}</span>
                  </div>
                  <span className="text-sm text-[#64748B]">{item.saidas} saídas</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Relatório Detalhado
            </h3>
            <FileText className="h-5 w-5 text-[#64748B]" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#0F172A]">Material</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-[#0F172A]">Entradas</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-[#0F172A]">Saídas</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-[#0F172A]">Saldo Atual</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-[#0F172A]">Variação</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((item, index) => {
                  const variation = item.entradas - item.saidas;
                  const variationPercent = ((variation / item.entradas) * 100).toFixed(1);
                  
                  return (
                    <tr 
                      key={index} 
                      className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-[#0F172A]">{item.material}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm text-green-600">+{item.entradas}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm text-orange-600">-{item.saidas}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm font-medium text-[#0F172A]">{item.saldo}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`text-sm font-medium ${variation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variation > 0 ? '+' : ''}{variationPercent}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
