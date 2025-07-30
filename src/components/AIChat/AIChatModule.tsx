import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIChatModule() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente IA del sistema POS. Puedo ayudarte con consultas sobre ventas, inventario, métricas y recomendaciones de pedidos. ¿En qué puedo asistirte hoy?',
      timestamp: new Date(),
      suggestions: [
        '¿Cómo vendió Coca Cola esta semana?',
        '¿Qué productos tienen stock bajo?',
        'Recomiéndame qué pedir a proveedores',
        'Muéstrame las ventas de hoy'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('coca cola') || lowerMessage.includes('ventas')) {
      response = '📊 **Análisis de Coca Cola 500ml:**\n\n• **Esta semana**: 156 unidades vendidas (+23% vs semana anterior)\n• **Ingresos**: $390.00\n• **Stock actual**: 45 unidades\n• **Tendencia**: ⬆️ Crecimiento sostenido\n• **Mejor día**: Viernes (34 unidades)';
      suggestions = ['¿Cuándo debo pedir más Coca Cola?', '¿Qué otras bebidas están vendiendo bien?'];
    } else if (lowerMessage.includes('stock bajo') || lowerMessage.includes('inventario')) {
      response = '⚠️ **Productos con Stock Bajo:**\n\n🔴 **Crítico:**\n• Yogurt Natural: 3 unidades (mínimo: 10)\n• Pan Integral: 8 unidades (mínimo: 15)\n\n🟡 **Atención:**\n• Galletas Oreo: 12 unidades (mínimo: 20)\n\n**Recomendación**: Realizar pedido urgente de yogurt y pan.';
      suggestions = ['Genera pedido automático', '¿Cuánto debo pedir de cada producto?'];
    } else if (lowerMessage.includes('recomienda') || lowerMessage.includes('pedido') || lowerMessage.includes('proveedor')) {
      response = '🚀 **Recomendaciones de Pedido Inteligente:**\n\n**Basado en ventas de últimos 30 días:**\n\n• **Coca Cola 500ml**: 200 unidades\n  (Promedio: 5.2/día, buffer 7 días)\n\n• **Yogurt Natural**: 80 unidades\n  (Promedio: 2.6/día, URGENTE)\n\n• **Pan Integral**: 120 unidades\n  (Promedio: 4.1/día, restock necesario)\n\n**Valor total estimado**: $486.00';
      suggestions = ['Confirmar pedido automático', 'Ajustar cantidades'];
    } else if (lowerMessage.includes('hoy') || lowerMessage.includes('ventas de hoy')) {
      response = '📈 **Resumen de Ventas - Hoy:**\n\n• **Ingresos**: $1,245.50\n• **Transacciones**: 23\n• **Ticket promedio**: $54.15\n• **Productos vendidos**: 89 unidades\n\n**Top 3 del día:**\n1. Coca Cola 500ml (8 unidades)\n2. Leche Entera 1L (6 unidades)\n3. Pan Integral (5 unidades)';
      suggestions = ['Comparar con ayer', '¿Qué productos no se vendieron?'];
    } else {
      response = 'Entiendo tu consulta. Puedo ayudarte con:\n\n• 📊 Análisis de ventas y métricas\n• 📦 Estado del inventario\n• 🤖 Recomendaciones de pedidos\n• 💰 Reportes financieros\n\n¿Sobre qué tema específico te gustaría información?';
      suggestions = [
        'Estado del inventario',
        'Productos más vendidos',
        'Generar reporte semanal'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const quickActions = [
    { label: 'Stock Bajo', icon: Package, query: '¿Qué productos tienen stock bajo?' },
    { label: 'Ventas Hoy', icon: DollarSign, query: 'Muéstrame las ventas de hoy' },
    { label: 'Recomendaciones', icon: TrendingUp, query: 'Recomiéndame qué pedir a proveedores' }
  ];

  return (
    <div className="h-full flex">
      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 shadow-card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              IA Assistant - Sistema POS
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-line text-sm">
                        {message.content}
                      </div>
                    </div>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Pregúntame sobre ventas, inventario, métricas..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSendMessage(inputMessage)}
                className="bg-gradient-primary"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de acciones rápidas */}
      <div className="w-80 ml-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleSendMessage(action.query)}
                >
                  <Icon className="w-5 h-5" />
                  {action.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}