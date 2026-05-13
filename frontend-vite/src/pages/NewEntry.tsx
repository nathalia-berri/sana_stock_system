import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/sana/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const materials = [
  { id: 1, name: 'Parafusos M6', current: 15, unit: 'un' },
  { id: 2, name: 'Cabos 2.5mm', current: 850, unit: 'un' },
  { id: 3, name: 'Luvas PVC', current: 120, unit: 'un' },
  { id: 4, name: 'Fita Isolante Preta', current: 25, unit: 'un' },
  { id: 5, name: 'Abraçadeiras 1/2"', current: 8, unit: 'un' },
];

export function NewEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    material: '',
    quantity: '',
    observation: ''
  });

  const selectedMaterial = materials.find(m => m.id.toString() === formData.material);
  const newStock = selectedMaterial 
    ? selectedMaterial.current + (parseInt(formData.quantity) || 0)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    navigate('/movements');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/movements')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">Nova Entrada</h2>
            <p className="text-sm text-[#64748B]">Registre a entrada de materiais no estoque</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Entrada de Material</p>
                <p className="text-xs text-green-700">Adiciona unidades ao estoque existente</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">
                Material <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.material} 
                onValueChange={(value) => setFormData({ ...formData, material: value })}
                required
              >
                <SelectTrigger id="material">
                  <SelectValue placeholder="Selecione um material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id.toString()}>
                      {material.name} (Estoque atual: {material.current} {material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantidade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Ex: 100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observação</Label>
              <Textarea
                id="observation"
                placeholder="Ex: NF 12345, Fornecedor XYZ Ltda"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-[#64748B]">
                Informações adicionais como nota fiscal, fornecedor, lote, etc.
              </p>
            </div>

            {selectedMaterial && formData.quantity && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-[#0F172A] mb-2">
                  Preview da Movimentação
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#64748B]">Estoque atual:</span>
                  <span className="font-medium text-[#0F172A]">
                    {selectedMaterial.current} {selectedMaterial.unit}
                  </span>
                  <span className="text-[#64748B]">→</span>
                  <span className="text-[#64748B]">Novo estoque:</span>
                  <span className="font-semibold text-green-600">
                    {newStock} {selectedMaterial.unit}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/movements')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#10B981] hover:bg-[#059669]"
              >
                <Save className="h-4 w-4 mr-2" />
                Confirmar Entrada
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
