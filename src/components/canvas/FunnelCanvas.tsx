import React, { useCallback, useRef, DragEvent } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFunnelState } from '@/hooks/useFunnelState';
import { CustomNode } from './CustomNode';
import { NodeType } from '@/types/funnel';

const nodeTypes = {
    custom: CustomNode,
};

function FunnelCanvasInner() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    } = useFunnelState();

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow') as NodeType;

            if (typeof type === 'undefined' || !type) {
                return;
            }

            if (reactFlowInstance && reactFlowWrapper.current) {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });

                addNode(type, position);
            }
        },
        [reactFlowInstance, addNode]
    );

    return (
        <div
            ref={reactFlowWrapper}
            className="h-full w-full"
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        const colors: Record<string, string> = {
                            sales: '#3b82f6',
                            order: '#22c55e',
                            upsell: '#a855f7',
                            downsell: '#f97316',
                            'thank-you': '#10b981',
                        };
                        return colors[node.data.type] || '#gray';
                    }}
                    className="!bg-white !border !border-gray-200"
                />
            </ReactFlow>
        </div>
    );
}

export function FunnelCanvas() {
    return (
        <ReactFlowProvider>
            <FunnelCanvasInner />
        </ReactFlowProvider>
    );
}
