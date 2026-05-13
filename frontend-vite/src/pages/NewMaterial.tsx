import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/sana/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function NewMaterial() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    unit: 'un',
    minimum: '',
    current: '',
    location: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    navigate('/materials');
  };

  const getStockPreview = () => {
    const current = parseInt(formData.current) || 0;
    const minimum = parseInt(formData.minimum) || 0;
    
    if (!formData.current || !formData.minimum) {
      return { text: 'Preencha os campos de estoque', color: 'text-[#64748B]' };
    }
    
    if (current < minimum * 0.5) {
      return { text: `Após salvar: ${current} ${formData.unit} (CRÍTICO)`, color: 'text-red-600' };
    } else if (current < minimum) {
      return { text: `Após salvar: ${current} ${formData.unit} (ATENÇÃO)`, color: 'text-yellow-600' };
    } else {
      return { text: `Após salvar: ${current} ${formData.unit} (OK)`, color: 'text-green-600' };
    }
  };

  const preview = getStockPreview();

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/materials')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">
              {isEditing ? 'Editar Material' : 'Novo Material'}
            </h2>
            <p className="text-sm text-[#64748B]">
              {isEditing ? 'Atualize as informações do material' : 'Cadastre um novo material no estoque'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-[#0F172A]">Informações Básicas</h3>
              
              <div className="space-y-2">
                <Label htmlFor="code">
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Ex: MAT001"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Parafusos M6"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixacao">Fixação</SelectItem>
                    <SelectItem value="eletrica">Elétrica</SelectItem>
                    <SelectItem value="conexoes">Conexões</SelectItem>
                    <SelectItem value="tubulacao">Tubulação</SelectItem>
                    <SelectItem value="rede">Rede</SelectItem>
                    <SelectItem value="ferramentas">Ferramentas</SelectItem>
                    <SelectItem value="epi">EPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="cx">Caixa (cx)</SelectItem>
                    <SelectItem value="m">Metro (m)</SelectItem>
                    <SelectItem value="l">Litro (l)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Right Column */}
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-[#0F172A]">Controle de Estoque</h3>
              
              <div className="space-y-2">
                <Label htmlFor="minimum">
                  Estoque Mínimo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minimum"
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.minimum}
                  onChange={(e) => setFormData({ ...formData, minimum: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">
                  Estoque Atual <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="Ex: 150"
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Ex: Prateleira A3, Gaveta 5"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-[#F8FAFC] rounded-lg">
                <div>
                  <Label htmlFor="active" className="cursor-pointer">Status Ativo</Label>
                  <p className="text-xs text-[#64748B] mt-1">
                    Material disponível para movimentação
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-[#0F172A] mb-1">
                  Preview do Estoque
                </p>
                <p className={`text-sm font-semibold ${preview.color}`}>
                  {preview.text}
                </p>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/materials')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669]"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Material
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}