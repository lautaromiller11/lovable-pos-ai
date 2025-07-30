import { useState } from 'react';
import { Sidebar } from '@/components/Layout/Sidebar';
import { POSModule } from '@/components/POS/POSModule';
import { InventoryModule } from '@/components/Inventory/InventoryModule';
import { MetricsModule } from '@/components/Metrics/MetricsModule';
import { AIChatModule } from '@/components/AIChat/AIChatModule';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeModule, setActiveModule] = useState('pos');

  const renderModule = () => {
    switch (activeModule) {
      case 'pos':
        return <POSModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'metrics':
        return <MetricsModule />;
      case 'ai-chat':
        return <AIChatModule />;
      default:
        return <POSModule />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 p-6">
        {renderModule()}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
