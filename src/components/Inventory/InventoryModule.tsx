import { useState } from 'react';
import { Package, Plus, Minus, AlertTriangle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  barcode: string;
  lastUpdated: string;
}

export function InventoryModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sampleInventory: Product[] = [
    {
      id: '1',
      name: 'Coca Cola 500ml',
      category: 'Bebidas',
      stock: 45,
      minStock: 20,
      price: 2.50,
      barcode: '123456789012',
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      name: 'Pan Integral',
      category: 'Panadería',
      stock: 8,
      minStock: 15,
      price: 1.80,
      barcode: '123456789013',
      lastUpdated: '2024-01-20'
    },
    {
      id: '3',
      name: 'Leche Entera 1L',
      category: 'Lácteos',
      stock: 32,
      minStock: 25,
      price: 1.20,
      barcode: '123456789014',
      lastUpdated: '2024-01-19'
    },
    {
      id: '4',
      name: 'Yogurt Natural',
      category: 'Lácteos',
      stock: 3,
      minStock: 10,
      price: 0.95,
      barcode: '123456789015',
      lastUpdated: '2024-01-20'
    }
  ];

  const categories = ['all', ...Array.from(new Set(sampleInventory.map(p => p.category)))];

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Sin Stock', variant: 'destructive' as const, className: '' };
    if (stock <= minStock) return { label: 'Stock Bajo', variant: 'secondary' as const, className: 'bg-warning text-warning-foreground' };
    return { label: 'Stock OK', variant: 'secondary' as const, className: 'bg-success text-success-foreground' };
  };

  const filteredInventory = sampleInventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = sampleInventory.filter(p => p.stock <= p.minStock);

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{sampleInventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-success rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">${sampleInventory.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex justify-center">
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((product) => {
                const status = getStockStatus(product.stock, product.minStock);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.barcode}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-mono">{product.stock}</TableCell>
                    <TableCell className="font-mono">{product.minStock}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={status.variant}
                        className={status.className}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}