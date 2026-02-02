import { useEffect } from 'react';
import { FunnelCanvas } from '@/components/canvas/FunnelCanvas';
import { NodePalette } from '@/components/palette/NodePalette';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { Toaster } from '@/components/ui/toaster';
import { usePersistence } from '@/hooks/usePersistence';

function App() {
    // Initialize persistence (auto-save/load)
    usePersistence();

    return (
        <div className="flex h-screen flex-col">
            {/* Toolbar */}
            <Toolbar />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Node Palette */}
                <NodePalette />

                {/* Canvas */}
                <main className="flex-1" aria-label="Funnel canvas">
                    <FunnelCanvas />
                </main>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}

export default App;
