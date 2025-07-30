import { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Calculator, 
  Plus, 
  CreditCard, 
  Banknote, 
  Receipt, 
  Check, 
  Gift, 
  Percent,
  MessageSquare,
  Archive,
  Save,
  RotateCcw,
  Lock,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
}

type PaymentMethod = 'cash' | 'credit' | 'debit' | 'check' | 'voucher' | 'gift';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  variant?: 'default' | 'success' | 'danger';
  onClick?: () => void;
}

function ActionButton({ icon, label, shortcut, variant = 'default', onClick }: ActionButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center h-16 px-3 ${getVariantClasses()}`}
    >
      {shortcut && (
        <span className="absolute top-1 right-1 text-xs opacity-70">
          {shortcut}
        </span>
      )}
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

interface MetodoPagoButtonProps {
  method: PaymentMethod;
  label: string;
  shortcut?: string;
  isSelected: boolean;
  onClick: () => void;
}

function MetodoPagoButton({ method, label, shortcut, isSelected, onClick }: MetodoPagoButtonProps) {
  const getIcon = () => {
    switch (method) {
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      case 'credit':
        return <CreditCard className="w-5 h-5" />;
      case 'debit':
        return <CreditCard className="w-5 h-5" />;
      case 'check':
        return <Check className="w-5 h-5" />;
      case 'voucher':
        return <Receipt className="w-5 h-5" />;
      case 'gift':
        return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center h-16 px-3 transition-all ${
        isSelected 
          ? method === 'cash' 
            ? 'bg-green-600 text-white border-green-400' 
            : 'bg-blue-600 text-white border-blue-400'
          : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
      } border-2`}
    >
      {shortcut && (
        <span className="absolute top-1 right-1 text-xs opacity-70">
          {shortcut}
        </span>
      )}
      <div className="mb-1">{getIcon()}</div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

export function POSModule() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const sampleProducts = [
    { id: '1', name: 'GNU/Linux free software', price: 999.00, barcode: '123456789012' },
    { id: '2', name: 'Pan Integral', price: 1.80, barcode: '123456789013' },
    { id: '3', name: 'Leche Entera 1L', price: 1.20, barcode: '123456789014' },
    { id: '4', name: 'Yogurt Natural', price: 0.95, barcode: '123456789015' },
  ];

  // Agregar producto de muestra al cargar
  useEffect(() => {
    if (cart.length === 0) {
      const sampleItem = { ...sampleProducts[0], quantity: 1 };
      setCart([sampleItem]);
    }
  }, []);

  const calculateTotals = () => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTax = 0; // Sin impuestos por ahora
    const newTotal = newSubtotal + newTax;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  };

  useEffect(() => {
    calculateTotals();
  }, [cart]);

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
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "¡Venta exitosa!",
        description: `Total: $${total.toFixed(2)} - Método: ${selectedPaymentMethod}`,
      });

      // Limpiar pantalla
      setCart([]);
      setSelectedPaymentMethod(null);
      setSearchTerm('');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la venta",
        variant: "destructive",
      });
    }
  };

  const addSampleProduct = () => {
    const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    const existingItem = cart.find(item => item.id === randomProduct.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === randomProduct.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...randomProduct, quantity: 1 }]);
    }
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Encabezado */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-400">Aronium - POS</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search product by barcode"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400">Items</div>
          <div className="text-lg font-bold">{itemCount}</div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Columna izquierda - 70% */}
        <div className="flex-1 flex flex-col p-4">
          {/* Tabla de productos */}
          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 p-3 grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
              <div>Product name</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Price</div>
              <div className="text-right">Amount</div>
            </div>
            
            <div className="p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No hay productos en la venta
                </div>
              ) : (
                cart.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-4 gap-4 p-3 rounded ${
                      index === 0 ? 'bg-gray-700' : 'hover:bg-gray-750'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-400">#{item.barcode}</div>
                    </div>
                    <div className="text-center">{item.quantity}</div>
                    <div className="text-right">${item.price.toFixed(2)}</div>
                    <div className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totales */}
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - 30% */}
        <div className="w-80 p-4 flex flex-col gap-4">
          {/* Acciones rápidas */}
          <div className="grid grid-cols-2 gap-2">
            <ActionButton
              icon={<Trash2 className="w-5 h-5" />}
              label="Delete"
              onClick={() => setCart([])}
            />
            <ActionButton
              icon={<Search className="w-5 h-5" />}
              label="Search"
              shortcut="F3"
            />
            <ActionButton
              icon={<Calculator className="w-5 h-5" />}
              label="Quantity"
              shortcut="F4"
            />
            <ActionButton
              icon={<Plus className="w-5 h-5" />}
              label="New sale"
              shortcut="F8"
              onClick={addSampleProduct}
            />
          </div>

          {/* Métodos de pago */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">Payment Method</h3>
            <div className="grid grid-cols-3 gap-2">
              <MetodoPagoButton
                method="cash"
                label="Cash"
                shortcut="F12"
                isSelected={selectedPaymentMethod === 'cash'}
                onClick={() => setSelectedPaymentMethod('cash')}
              />
              <MetodoPagoButton
                method="credit"
                label="Credit Card"
                isSelected={selectedPaymentMethod === 'credit'}
                onClick={() => setSelectedPaymentMethod('credit')}
              />
              <MetodoPagoButton
                method="debit"
                label="Debit Card"
                isSelected={selectedPaymentMethod === 'debit'}
                onClick={() => setSelectedPaymentMethod('debit')}
              />
              <MetodoPagoButton
                method="check"
                label="Check"
                isSelected={selectedPaymentMethod === 'check'}
                onClick={() => setSelectedPaymentMethod('check')}
              />
              <MetodoPagoButton
                method="voucher"
                label="Voucher"
                isSelected={selectedPaymentMethod === 'voucher'}
                onClick={() => setSelectedPaymentMethod('voucher')}
              />
              <MetodoPagoButton
                method="gift"
                label="Gift Card"
                isSelected={selectedPaymentMethod === 'gift'}
                onClick={() => setSelectedPaymentMethod('gift')}
              />
            </div>
          </div>

          {/* Acciones de transacción */}
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <ActionButton
                icon={<Percent className="w-4 h-4" />}
                label="Discount"
                shortcut="F2"
              />
              <ActionButton
                icon={<MessageSquare className="w-4 h-4" />}
                label="Comment"
              />
              <ActionButton
                icon={<Archive className="w-4 h-4" />}
                label="Cash drawer"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <ActionButton
                icon={<Save className="w-4 h-4" />}
                label="Save sale"
                shortcut="F9"
              />
              <ActionButton
                icon={<RotateCcw className="w-4 h-4" />}
                label="Refund"
              />
              <ActionButton
                icon={<Lock className="w-4 h-4" />}
                label="Lock"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <ActionButton
                icon={<ArrowRightLeft className="w-4 h-4" />}
                label="Transfer"
                shortcut="F7"
              />
              <ActionButton
                icon={<X className="w-4 h-4" />}
                label="Void order"
                variant="danger"
              />
              <ActionButton
                icon={<CreditCard className="w-5 h-5" />}
                label="Payment"
                shortcut="F10"
                variant="success"
                onClick={procesarVenta}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}