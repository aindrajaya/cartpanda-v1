import { create } from 'zustand';
import { Node, Edge, XYPosition, addEdge, Connection } from 'reactflow';
import { NodeType, FunnelNode, FunnelEdge, NodeData } from '@/types/funnel';
import { getNodeTypeConfig } from '@/lib/nodeTypes';
import { validateFunnel } from '@/lib/validation';
import { exportFunnelToJSON, importFunnelFromJSON } from '@/lib/export';

interface NodeCounter {
    sales: number;
    order: number;
    upsell: number;
    downsell: number;
    'thank-you': number;
}

interface FunnelState {
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    nodeCounter: NodeCounter;

    // Actions
    setNodes: (nodes: FunnelNode[]) => void;
    setEdges: (edges: FunnelEdge[]) => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: Connection) => void;

    addNode: (type: NodeType, position: XYPosition) => void;
    updateNode: (id: string, data: Partial<NodeData>) => void;
    deleteNode: (id: string) => void;
    deleteEdge: (id: string) => void;

    validateFunnelState: () => void;
    exportJSON: () => string;
    importJSON: (json: string) => boolean;
    reset: () => void;
}

const initialNodeCounter: NodeCounter = {
    sales: 0,
    order: 0,
    upsell: 0,
    downsell: 0,
    'thank-you': 0,
};

export const useFunnelState = create<FunnelState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeCounter: { ...initialNodeCounter },

    setNodes: (nodes) => set({ nodes }),

    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
        const { nodes } = get();
        const updatedNodes = nodes.map((node) => {
            const change = changes.find((c: any) => c.id === node.id);
            if (!change) return node;

            if (change.type === 'position' && change.position) {
                return { ...node, position: change.position };
            }
            if (change.type === 'remove') {
                return null;
            }
            return node;
        }).filter(Boolean) as FunnelNode[];

        set({ nodes: updatedNodes });
    },

    onEdgesChange: (changes) => {
        const { edges } = get();
        const updatedEdges = edges.filter((edge) => {
            const change = changes.find((c: any) => c.id === edge.id);
            return !(change && change.type === 'remove');
        });

        set({ edges: updatedEdges });
    },

    onConnect: (connection) => {
        const { edges, nodes } = get();

        // Check if source is a Thank You node
        const sourceNode = nodes.find((n) => n.id === connection.source);
        if (sourceNode && sourceNode.data.type === 'thank-you') {
            // Don't allow connections from Thank You nodes
            return;
        }

        const newEdge = {
            ...connection,
            id: `edge-${connection.source}-${connection.target}`,
            type: 'smoothstep',
            animated: true,
        } as FunnelEdge;

        set({ edges: addEdge(newEdge, edges) });
        get().validateFunnelState();
    },

    addNode: (type, position) => {
        const { nodes, nodeCounter } = get();
        const config = getNodeTypeConfig(type);
        const newCounter = nodeCounter[type] + 1;

        const newNode: FunnelNode = {
            id: `${type}-${Date.now()}`,
            type: 'custom',
            position,
            data: {
                type,
                label: `${config.label} ${newCounter}`,
                buttonText: config.defaultButtonText,
                isValid: true,
                warnings: [],
            },
        };

        set({
            nodes: [...nodes, newNode],
            nodeCounter: { ...nodeCounter, [type]: newCounter },
        });

        get().validateFunnelState();
    },

    updateNode: (id, data) => {
        const { nodes } = get();
        const updatedNodes = nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        );
        set({ nodes: updatedNodes });
    },

    deleteNode: (id) => {
        const { nodes, edges } = get();
        const updatedNodes = nodes.filter((node) => node.id !== id);
        const updatedEdges = edges.filter(
            (edge) => edge.source !== id && edge.target !== id
        );
        set({ nodes: updatedNodes, edges: updatedEdges });
        get().validateFunnelState();
    },

    deleteEdge: (id) => {
        const { edges } = get();
        const updatedEdges = edges.filter((edge) => edge.id !== id);
        set({ edges: updatedEdges });
        get().validateFunnelState();
    },

    validateFunnelState: () => {
        const { nodes, edges } = get();
        const result = validateFunnel(nodes, edges);

        // Update node validation states
        const updatedNodes = nodes.map((node) => {
            const nodeErrors = result.errors.filter((e) => e.nodeId === node.id);
            const nodeWarnings = result.warnings.filter((w) => w.nodeId === node.id);

            return {
                ...node,
                data: {
                    ...node.data,
                    isValid: nodeErrors.length === 0,
                    warnings: [...nodeErrors.map((e) => e.message), ...nodeWarnings.map((w) => w.message)],
                },
            };
        });

        set({ nodes: updatedNodes });
    },

    exportJSON: () => {
        const { nodes, edges } = get();
        return exportFunnelToJSON(nodes, edges);
    },

    importJSON: (json) => {
        const result = importFunnelFromJSON(json);
        if (!result) return false;

        // Recalculate node counter
        const newCounter = { ...initialNodeCounter };
        result.nodes.forEach((node) => {
            newCounter[node.data.type]++;
        });

        set({
            nodes: result.nodes,
            edges: result.edges,
            nodeCounter: newCounter,
        });

        get().validateFunnelState();
        return true;
    },

    reset: () => {
        set({
            nodes: [],
            edges: [],
            nodeCounter: { ...initialNodeCounter },
        });
    },
}));
