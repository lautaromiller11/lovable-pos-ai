import { useState, useEffect } from 'react';
import { Search, Scan, ShoppingCart, CreditCard, Banknote, QrCode, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
}

type PaymentMethod = 'efectivo' | 'tarjeta' | 'qr';

export function POSModule() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  const sampleProducts = [
    { id: '1', name: 'Coca Cola 500ml', price: 2.50, barcode: '123456789012' },
    { id: '2', name: 'Pan Integral', price: 1.80, barcode: '123456789013' },
    { id: '3', name: 'Leche Entera 1L', price: 1.20, barcode: '123456789014' },
    { id: '4', name: 'Yogurt Natural', price: 0.95, barcode: '123456789015' },
  ];

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    calculateTotal();
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const procesarVenta = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "No hay productos en el punto de venta",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Selecciona un método de pago",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simular envío al backend
      const ventaData = {
        productos: cart,
        total: total,
        metodoPago: selectedPaymentMethod,
        fecha: new Date().toISOString(),
      };

      // Simular respuesta del servidor con delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Venta exitosa!",
        description: `Total: $${total.toFixed(2)} - Método: ${selectedPaymentMethod}`,
      });

      // Limpiar pantalla para nueva venta
      setCart([]);
      setTotal(0);
      setSelectedPaymentMethod(null);
      setSearchTerm('');

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la venta. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Recalcular total cuando cambie el carrito
  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  return (
    <div className="flex h-full gap-6">
      {/* Productos y Búsqueda */}
      <div className="flex-1">
        <Card className="h-full shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Productos
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto o código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Scan className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-pos transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{product.barcode}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrito y Pago */}
      <div className="w-96">
        <Card className="h-full shadow-card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Punto de Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-2 mb-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Carrito vacío
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded hover:bg-accent/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              {/* Métodos de Pago */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Método de Pago:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedPaymentMethod === 'efectivo' ? 'default' : 'outline'}
                    size="sm" 
                    className="flex flex-col gap-1 h-16"
                    onClick={() => setSelectedPaymentMethod('efectivo')}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-xs">Efectivo</span>
                  </Button>
                  <Button 
                    variant={selectedPaymentMethod === 'tarjeta' ? 'default' : 'outline'}
                    size="sm" 
                    className="flex flex-col gap-1 h-16"
                    onClick={() => setSelectedPaymentMethod('tarjeta')}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">Tarjeta</span>
                  </Button>
                  <Button 
                    variant={selectedPaymentMethod === 'qr' ? 'default' : 'outline'}
                    size="sm" 
                    className="flex flex-col gap-1 h-16"
                    onClick={() => setSelectedPaymentMethod('qr')}
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs">QR</span>
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-success hover:opacity-90"
                disabled={cart.length === 0 || !selectedPaymentMethod}
                size="lg"
                onClick={procesarVenta}
              >
                Procesar Venta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}