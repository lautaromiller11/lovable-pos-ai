import { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function MetricsModule() {
  const [timeRange, setTimeRange] = useState('7d');

  // Datos de ejemplo
  const salesData = [
    { date: '2024-01-14', sales: 2400, transactions: 45 },
    { date: '2024-01-15', sales: 1800, transactions: 32 },
    { date: '2024-01-16', sales: 3200, transactions: 58 },
    { date: '2024-01-17', sales: 2800, transactions: 48 },
    { date: '2024-01-18', sales: 3800, transactions: 65 },
    { date: '2024-01-19', sales: 4200, transactions: 72 },
    { date: '2024-01-20', sales: 3600, transactions: 61 }
  ];

  const productData = [
    { name: 'Bebidas', value: 4200, color: '#3b82f6' },
    { name: 'Lácteos', value: 3100, color: '#10b981' },
    { name: 'Panadería', value: 2800, color: '#f59e0b' },
    { name: 'Snacks', value: 1900, color: '#ef4444' },
    { name: 'Otros', value: 1200, color: '#8b5cf6' }
  ];

  const topProducts = [
    { name: 'Coca Cola 500ml', sales: 156, revenue: 390 },
    { name: 'Pan Integral', sales: 89, revenue: 160.20 },
    { name: 'Leche Entera 1L', sales: 134, revenue: 160.80 },
    { name: 'Yogurt Natural', sales: 78, revenue: 74.10 },
    { name: 'Galletas Oreo', sales: 67, revenue: 134.00 }
  ];

  const metrics = [
    {
      title: 'Ventas Totales',
      value: '$22,400',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Transacciones',
      value: '381',
      change: '+8.2%',
      icon: ShoppingBag,
      trend: 'up'
    },
    {
      title: 'Ticket Promedio',
      value: '$58.79',
      change: '+3.1%',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Productos Vendidos',
      value: '1,247',
      change: '+15.3%',
      icon: Users,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con filtros de tiempo */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Métricas</h2>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-success">{metric.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por tiempo */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Tendencia de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por categorías */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {productData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">${item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top productos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}