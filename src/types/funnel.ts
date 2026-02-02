import { Node, Edge } from 'reactflow';

export type NodeType = 'sales' | 'order' | 'upsell' | 'downsell' | 'thank-you';

export interface NodeData {
    type: NodeType;
    label: string;
    buttonText: string;
    isValid: boolean;
    warnings: string[];
}

export interface FunnelNode extends Node {
    data: NodeData;
}

export interface FunnelEdge extends Edge { }

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    nodeId: string;
    message: string;
}

export interface ValidationWarning {
    nodeId: string;
    message: string;
}

export interface FunnelSchema {
    version: number;
    lastModified: string;
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    metadata: {
        name?: string;
        createdAt: string;
    };
}

export interface NodeTypeConfig {
    type: NodeType;
    label: string;
    icon: string;
    color: string;
    defaultButtonText: string;
    description: string;
}
