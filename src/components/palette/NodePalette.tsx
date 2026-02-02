import React, { DragEvent } from 'react';
import {
    ShoppingCart,
    FileText,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    LucideIcon,
} from 'lucide-react';
import { NodeType } from '@/types/funnel';
import { NODE_TYPES } from '@/lib/nodeTypes';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
    ShoppingCart,
    FileText,
    TrendingUp,
    TrendingDown,
    CheckCircle,
};

interface DraggableNodeProps {
    type: NodeType;
}

function DraggableNode({ type }: DraggableNodeProps) {
    const config = NODE_TYPES[type];
    const Icon = iconMap[config.icon];

    const onDragStart = (event: DragEvent, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const colorClasses: Record<NodeType, string> = {
        sales: 'bg-blue-500 hover:bg-blue-600',
        order: 'bg-green-500 hover:bg-green-600',
        upsell: 'bg-purple-500 hover:bg-purple-600',
        downsell: 'bg-orange-500 hover:bg-orange-600',
        'thank-you': 'bg-emerald-500 hover:bg-emerald-600',
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className={cn(
                'flex cursor-grab items-center gap-3 rounded-lg p-3 text-white transition-all active:cursor-grabbing',
                colorClasses[type]
            )}
            role="button"
            tabIndex={0}
            aria-label={`Drag to add ${config.label}`}
        >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <div className="flex-1">
                <div className="font-semibold">{config.label}</div>
                <div className="text-xs opacity-90">{config.description}</div>
            </div>
        </div>
    );
}

export function NodePalette() {
    const nodeTypes: NodeType[] = ['sales', 'order', 'upsell', 'downsell', 'thank-you'];

    return (
        <aside
            className="flex h-full w-64 flex-col border-r border-gray-200 bg-white p-4"
            aria-label="Node palette"
        >
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Node Palette</h2>
                <p className="text-sm text-gray-600">Drag nodes to the canvas</p>
            </div>

            <nav className="space-y-2" aria-label="Available node types">
                {nodeTypes.map((type) => (
                    <DraggableNode key={type} type={type} />
                ))}
            </nav>

            <div className="mt-auto pt-4">
                <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                    <p className="font-semibold">💡 Tip</p>
                    <p className="mt-1">
                        Drag nodes from here to the canvas to build your funnel. Connect
                        them by dragging from the right handle to the left handle of another
                        node.
                    </p>
                </div>
            </div>
        </aside>
    );
}
