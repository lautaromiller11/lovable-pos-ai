import { Home, ShoppingCart, Package, BarChart3, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'metrics', label: 'Métricas', icon: BarChart3 },
  { id: 'ai-chat', label: 'IA Assistant', icon: MessageCircle },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gradient-card border-r shadow-card">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">POS System</h1>
            <p className="text-sm text-muted-foreground">IA Integrado</p>
          </div>
        </div>

        <nav className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <Button
                key={module.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isActive && "bg-gradient-primary shadow-pos"
                )}
                onClick={() => onModuleChange(module.id)}
              >
                <Icon className="w-5 h-5" />
                {module.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}